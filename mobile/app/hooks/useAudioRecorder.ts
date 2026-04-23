import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { MAX_RECORDING_MS } from '../constants/filters';
import { VoiceCaptureStatus } from '../types/voice';

export interface RecordingCapture {
  base64: string;
  mimeType: string;
  durationMs: number;
  uri: string;
}

export interface UseAudioRecorderResult {
  status: VoiceCaptureStatus;
  durationMs: number;
  error: string | null;
  recordingUri: string | null;
  start: () => Promise<void>;
  stop: () => Promise<RecordingCapture | null>;
  reset: () => void;
}

const DEFAULT_MIME_TYPE = 'audio/m4a';

async function readRecordingAsBase64(
  uri: string
): Promise<{ base64: string; mimeType: string }> {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    const mimeType = blob.type || 'audio/webm';
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('Unable to read recording blob.'));
      };
      reader.onerror = () => reject(reader.error ?? new Error('FileReader failed.'));
      reader.readAsDataURL(blob);
    });
    const commaIndex = dataUrl.indexOf(',');
    const base64 = commaIndex === -1 ? dataUrl : dataUrl.slice(commaIndex + 1);
    return { base64, mimeType };
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return { base64, mimeType: DEFAULT_MIME_TYPE };
}

export function useAudioRecorder(): UseAudioRecorderResult {
  const [status, setStatus] = useState<VoiceCaptureStatus>('idle');
  const [durationMs, setDurationMs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (tickerRef.current) clearInterval(tickerRef.current);
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => undefined);
        recordingRef.current = null;
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (tickerRef.current) clearInterval(tickerRef.current);
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
    tickerRef.current = null;
    autoStopRef.current = null;
    recordingRef.current = null;
    startTimeRef.current = null;
    setDurationMs(0);
    setError(null);
    setRecordingUri(null);
    setStatus('idle');
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      setRecordingUri(null);
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setError('Microphone permission was denied.');
        setStatus('error');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      startTimeRef.current = Date.now();
      setStatus('recording');
      setDurationMs(0);

      tickerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Date.now() - startTimeRef.current;
          if (mountedRef.current) setDurationMs(elapsed);
        }
      }, 200);

      autoStopRef.current = setTimeout(() => {
        if (recordingRef.current) {
          stopInternal().catch(() => undefined);
        }
      }, MAX_RECORDING_MS);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to start recording.';
      setError(message);
      setStatus('error');
    }
    // stopInternal intentionally not in deps to avoid recreating timers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopInternal = useCallback(async () => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }

    const recording = recordingRef.current;
    if (!recording) return null;
    recordingRef.current = null;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) throw new Error('Recording URI missing.');

      const { base64, mimeType } = await readRecordingAsBase64(uri);

      const finalDuration = startTimeRef.current ? Date.now() - startTimeRef.current : durationMs;
      startTimeRef.current = null;
      if (mountedRef.current) {
        setDurationMs(finalDuration);
        setRecordingUri(uri);
        setStatus('uploading');
      }

      return { base64, mimeType, durationMs: finalDuration, uri };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to stop recording.';
      if (mountedRef.current) {
        setError(message);
        setStatus('error');
      }
      return null;
    }
  }, [durationMs]);

  const stop = useCallback(async () => {
    return stopInternal();
  }, [stopInternal]);

  return { status, durationMs, error, recordingUri, start, stop, reset };
}
