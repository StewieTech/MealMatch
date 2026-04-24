import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { CapturedPhoto } from '../types/photo';

type CaptureStatus = 'idle' | 'capturing' | 'error';

interface UseCameraCaptureResult {
  status: CaptureStatus;
  error: string | null;
  captureFromCamera: () => Promise<CapturedPhoto | null>;
  pickFromGallery: () => Promise<CapturedPhoto | null>;
  reset: () => void;
}

const WEB_MAX_BASE64_LENGTH = 1_500_000;
const WEB_PRIMARY_LONG_EDGE = 1600;
const WEB_FALLBACK_LONG_EDGE = 1280;
const WEB_PRIMARY_QUALITY = 0.7;
const WEB_SECONDARY_QUALITY = 0.5;

function inferMimeType(uri: string, explicit?: string | null): string {
  if (explicit) return explicit.toLowerCase();
  const lower = uri.split('?')[0].toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic')) return 'image/heic';
  if (lower.endsWith('.heif')) return 'image/heif';
  return 'image/jpeg';
}

export function normalizeCapturedPhotoMimeType(uri: string, explicit?: string | null): string {
  const inferred = inferMimeType(uri, explicit);
  if (inferred === 'image/png' || inferred === 'image/webp') return inferred;
  if (
    inferred === 'image/jpeg' ||
    inferred === 'image/jpg' ||
    inferred === 'image/heic' ||
    inferred === 'image/heif'
  ) {
    return 'image/jpeg';
  }
  return 'image/jpeg';
}

function isWebRuntime() {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof Image !== 'undefined'
  );
}

function estimateBase64Bytes(base64: string) {
  return Math.floor((base64.length * 3) / 4);
}

export function scaleDimensions(width: number, height: number, maxLongEdge: number) {
  const longEdge = Math.max(width, height);
  if (!longEdge || longEdge <= maxLongEdge) {
    return { width, height };
  }
  const scale = maxLongEdge / longEdge;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function getWebCompressionTargets() {
  return [
    { maxLongEdge: WEB_PRIMARY_LONG_EDGE, quality: WEB_PRIMARY_QUALITY },
    { maxLongEdge: WEB_PRIMARY_LONG_EDGE, quality: WEB_SECONDARY_QUALITY },
    { maxLongEdge: WEB_FALLBACK_LONG_EDGE, quality: WEB_SECONDARY_QUALITY },
  ] as const;
}

function loadImageFromUri(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not load the selected image for compression.'));
    image.src = uri;
  });
}

function canvasToBase64(
  image: HTMLImageElement,
  width: number,
  height: number,
  quality: number
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not prepare an image canvas in this browser.');
  }
  context.drawImage(image, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const commaIndex = dataUrl.indexOf(',');
  return commaIndex === -1 ? dataUrl : dataUrl.slice(commaIndex + 1);
}

async function compressWebCapturedAsset(
  asset: ImagePicker.ImagePickerAsset
): Promise<CapturedPhoto> {
  const originalWidth = asset.width || 0;
  const originalHeight = asset.height || 0;
  const image = await loadImageFromUri(asset.uri);
  const measuredWidth = image.naturalWidth || originalWidth;
  const measuredHeight = image.naturalHeight || originalHeight;

  const targets = getWebCompressionTargets();
  let base64 = '';
  let finalWidth = measuredWidth;
  let finalHeight = measuredHeight;
  let finalQuality = WEB_PRIMARY_QUALITY;

  for (const target of targets) {
    const size = scaleDimensions(measuredWidth, measuredHeight, target.maxLongEdge);
    base64 = canvasToBase64(image, size.width, size.height, target.quality);
    finalWidth = size.width;
    finalHeight = size.height;
    finalQuality = target.quality;
    if (base64.length <= WEB_MAX_BASE64_LENGTH) {
      break;
    }
  }

  console.info('[MealMatch][photo] compressed web image for upload', {
    originalWidth: measuredWidth,
    originalHeight: measuredHeight,
    compressedWidth: finalWidth,
    compressedHeight: finalHeight,
    originalFileSize: asset.fileSize ?? null,
    compressedEstimatedBytes: estimateBase64Bytes(base64),
    compressedBase64Length: base64.length,
    quality: finalQuality,
  });

  if (base64.length > WEB_MAX_BASE64_LENGTH) {
    throw new Error(
      'This photo is too large to process in your phone browser. Try a smaller photo or retake it.'
    );
  }

  return {
    base64,
    mimeType: 'image/jpeg',
    uri: asset.uri,
    width: finalWidth,
    height: finalHeight,
    fileSize: asset.fileSize ?? estimateBase64Bytes(base64),
  };
}

async function toCaptured(asset: ImagePicker.ImagePickerAsset | undefined): Promise<CapturedPhoto | null> {
  if (!asset || !asset.base64) return null;
  const mimeType = normalizeCapturedPhotoMimeType(asset.uri, asset.mimeType ?? null);
  console.info('[MealMatch][photo] captured image ready for upload', {
    assetMimeType: asset.mimeType ?? null,
    uploadMimeType: mimeType,
    width: asset.width,
    height: asset.height,
    fileSize: asset.fileSize ?? null,
    base64Length: asset.base64.length,
  });

  if (isWebRuntime()) {
    return compressWebCapturedAsset(asset);
  }

  return {
    base64: asset.base64,
    mimeType,
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    fileSize: asset.fileSize ?? estimateBase64Bytes(asset.base64),
  };
}

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 0.6,
  base64: true,
  allowsEditing: false,
  exif: false,
};

export function useCameraCapture(): UseCameraCaptureResult {
  const [status, setStatus] = useState<CaptureStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  async function run(
    launcher: () => Promise<ImagePicker.ImagePickerResult>,
    requestPermission: () => Promise<ImagePicker.PermissionResponse>,
    permissionMessage: string
  ): Promise<CapturedPhoto | null> {
    setError(null);
    setStatus('capturing');
    try {
      const perm = await requestPermission();
      if (!perm.granted) {
        setStatus('error');
        setError(permissionMessage);
        return null;
      }
      const result = await launcher();
      if (result.canceled) {
        console.info('[MealMatch][photo] image selection canceled');
        setStatus('idle');
        return null;
      }
      const captured = await toCaptured(result.assets?.[0]);
      if (!captured) {
        setStatus('error');
        setError('Could not read the selected image.');
        return null;
      }
      setStatus('idle');
      return captured;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Image capture failed.';
      console.error('[MealMatch][photo] image capture failed', { message });
      setStatus('error');
      setError(message);
      return null;
    }
  }

  function captureFromCamera() {
    return run(
      () => ImagePicker.launchCameraAsync(PICKER_OPTIONS),
      () => ImagePicker.requestCameraPermissionsAsync(),
      'Camera permission is required to scan ingredients.'
    );
  }

  function pickFromGallery() {
    return run(
      () => ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS),
      () => ImagePicker.requestMediaLibraryPermissionsAsync(),
      'Photo library permission is required to pick an image.'
    );
  }

  function reset() {
    setStatus('idle');
    setError(null);
  }

  return { status, error, captureFromCamera, pickFromGallery, reset };
}
