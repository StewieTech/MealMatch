import {
  classifyPhotoNetworkError,
  PhotoApiError,
  extractIngredientsFromPhoto,
  searchRecipeVideo,
} from '../app/lib/photoApi';
import {
  getWebCompressionTargets,
  normalizeCapturedPhotoMimeType,
  scaleDimensions,
} from '../app/hooks/useCameraCapture';

describe('photoApi', () => {
  const originalFetch = global.fetch;
  const originalConsoleError = console.error;
  const originalConsoleInfo = console.info;

  beforeEach(() => {
    console.error = jest.fn();
    console.info = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
    console.info = originalConsoleInfo;
    jest.restoreAllMocks();
  });

  it('POSTs imageBase64+mimeType to /photo/extract and returns parsed ingredients', async () => {
    const mockFetch = jest.fn(async () =>
      new Response(
        JSON.stringify({
          ingredients: [
            { raw: 'Tomato', normalized: 'tomato', confidence: 'high' },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const result = await extractIngredientsFromPhoto('abc', 'image/jpeg');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain('/photo/extract');
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
    expect(JSON.parse(String(init.body))).toEqual({
      imageBase64: 'abc',
      mimeType: 'image/jpeg',
    });
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0].normalized).toBe('tomato');
  });

  it('throws with server error message when /photo/extract fails', async () => {
    global.fetch = jest.fn(async () =>
      new Response(
        JSON.stringify({ error: 'not configured', reason: 'not_configured' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    ) as unknown as typeof fetch;

    await expect(extractIngredientsFromPhoto('abc', 'image/jpeg')).rejects.toThrow(
      'not configured'
    );
  });

  it('exposes payload_too_large errors for phone web uploads', async () => {
    global.fetch = jest.fn(async () =>
      new Response(
        JSON.stringify({
          error: 'Image payload too large.',
          reason: 'payload_too_large',
        }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      )
    ) as unknown as typeof fetch;

    try {
      await extractIngredientsFromPhoto('abc', 'image/jpeg');
      throw new Error('Expected extractIngredientsFromPhoto to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(PhotoApiError);
      expect((error as PhotoApiError).status).toBe(413);
      expect((error as PhotoApiError).reason).toBe('payload_too_large');
    }
  });

  it('normalizes HEIC and HEIF captures to JPEG for upload', () => {
    expect(normalizeCapturedPhotoMimeType('file:///photo.HEIC', 'image/heic')).toBe(
      'image/jpeg'
    );
    expect(normalizeCapturedPhotoMimeType('file:///photo.heif', null)).toBe('image/jpeg');
    expect(normalizeCapturedPhotoMimeType('file:///photo.png', 'image/png')).toBe('image/png');
  });

  it('classifies Safari-style load failures as network_failed', () => {
    const result = classifyPhotoNetworkError(new TypeError('Load failed'));

    expect(result).toBeInstanceOf(PhotoApiError);
    expect(result?.reason).toBe('network_failed');
    expect(result?.status).toBe(0);
  });

  it('rethrows network_failed when fetch rejects before a response exists', async () => {
    global.fetch = jest.fn(async () => {
      throw new TypeError('Load failed');
    }) as unknown as typeof fetch;

    try {
      await extractIngredientsFromPhoto('abc', 'image/jpeg');
      throw new Error('Expected extractIngredientsFromPhoto to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(PhotoApiError);
      expect((error as PhotoApiError).reason).toBe('network_failed');
      expect((error as PhotoApiError).status).toBe(0);
    }
  });

  it('uses the expected web compression policy for large phone images', () => {
    expect(getWebCompressionTargets()).toEqual([
      { maxLongEdge: 1600, quality: 0.7 },
      { maxLongEdge: 1600, quality: 0.5 },
      { maxLongEdge: 1280, quality: 0.5 },
    ]);
    expect(scaleDimensions(4284, 5712, 1600)).toEqual({ width: 1200, height: 1600 });
    expect(scaleDimensions(4284, 5712, 1280)).toEqual({ width: 960, height: 1280 });
  });

  it('GETs /videos/search with query and returns parsed video', async () => {
    const mockFetch = jest.fn(async () =>
      new Response(
        JSON.stringify({
          videoId: 'abc123',
          title: 'Stir Fry',
          channel: 'Chef',
          thumbnailUrl: 'https://img/',
          embedUrl: 'https://www.youtube.com/embed/abc123',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    global.fetch = mockFetch as unknown as typeof fetch;

    const result = await searchRecipeVideo('Chicken Stir Fry');

    const [url, init] = mockFetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain('/videos/search?q=Chicken%20Stir%20Fry');
    expect(init.method).toBe('GET');
    expect(result.videoId).toBe('abc123');
    expect(result.embedUrl).toContain('youtube.com/embed/abc123');
  });
});
