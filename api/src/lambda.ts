import serverless from 'serverless-http';
import { app } from './app';
import { corsConfig, isCorsOriginAllowed } from './config/cors';
import { connectToDatabase } from './lib/mongo';

const proxy = serverless(app);

type EventLike = {
  headers?: Record<string, string | undefined>;
  rawPath?: string;
  requestContext?: { http?: { method?: string; path?: string } };
};

type LambdaProxyResult = {
  statusCode: number;
  headers?: Record<string, string>;
  body?: string;
};

function getHeaderValue(headers: Record<string, string | undefined> | undefined, name: string) {
  if (!headers) return undefined;
  const direct = headers[name];
  if (direct) return direct;
  const lowered = name.toLowerCase();
  const matchedKey = Object.keys(headers).find((key) => key.toLowerCase() === lowered);
  return matchedKey ? headers[matchedKey] : undefined;
}

function buildCorsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': corsConfig.allowedMethods.join(','),
    'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(','),
    'Access-Control-Max-Age': String(corsConfig.maxAgeSeconds),
    Vary: 'Origin',
  };
}

function isProxyResult(value: unknown): value is LambdaProxyResult {
  return !!value && typeof value === 'object' && 'statusCode' in value;
}

export const handler = async (event: unknown, context: unknown) => {
  const eventLike = event as EventLike;

  const method = eventLike.requestContext?.http?.method;
  const path = eventLike.rawPath || eventLike.requestContext?.http?.path;
  const origin = getHeaderValue(eventLike.headers, 'origin');
  const shouldSkipDbConnect = method === 'OPTIONS' || path === '/health';

  if (method === 'OPTIONS' && origin) {
    if (!isCorsOriginAllowed(origin)) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json', Vary: 'Origin' },
        body: JSON.stringify({ error: 'CORS origin not allowed.' }),
      };
    }

    return {
      statusCode: 200,
      headers: buildCorsHeaders(origin),
      body: '',
    };
  }

  if (!shouldSkipDbConnect) {
    try {
      await connectToDatabase();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown error';
      console.error('[lambda] database connection failed, continuing without DB:', message);
    }
  }

  const response = await proxy(event as never, context as never);

  if (origin && isCorsOriginAllowed(origin) && isProxyResult(response)) {
    response.headers = {
      ...(response.headers || {}),
      ...buildCorsHeaders(origin),
    };
  }

  return response;
};
