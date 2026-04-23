import { CorsOptions } from 'cors';

const DEFAULT_ALLOWED_ORIGINS = [
  'https://d1jvmkdzx7bn57.cloudfront.net',
  'http://localhost:8082',
  'http://localhost:19006',
];

const DEFAULT_ALLOWED_METHODS = ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];

const DEFAULT_ALLOWED_HEADERS = [
  'content-type',
  'authorization',
  'x-api-key',
  'x-amz-date',
  'x-amz-security-token',
  'x-amz-user-agent',
  'x-amzn-trace-id',
];

function parseCsvEnv(name: string, fallback: string[]) {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : fallback;
}

function parsePositiveIntEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return parsed;
}

export const corsConfig = {
  allowedOrigins: parseCsvEnv('CORS_ALLOWED_ORIGINS', DEFAULT_ALLOWED_ORIGINS),
  allowedMethods: parseCsvEnv('CORS_ALLOWED_METHODS', DEFAULT_ALLOWED_METHODS),
  allowedHeaders: parseCsvEnv('CORS_ALLOWED_HEADERS', DEFAULT_ALLOWED_HEADERS),
  maxAgeSeconds: parsePositiveIntEnv('CORS_MAX_AGE_SECONDS', 86400),
};

const allowedOriginSet = new Set(corsConfig.allowedOrigins);

export function isCorsOriginAllowed(origin?: string) {
  if (!origin) return true;
  return allowedOriginSet.has(origin);
}

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (isCorsOriginAllowed(origin)) return callback(null, true);
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  methods: corsConfig.allowedMethods,
  allowedHeaders: corsConfig.allowedHeaders,
  maxAge: corsConfig.maxAgeSeconds,
  optionsSuccessStatus: 200,
};

