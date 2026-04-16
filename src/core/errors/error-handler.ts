/**
 * Centralized error handling utility.
 * All service-level errors should flow through here for consistent logging.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'UNKNOWN',
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/** Log and optionally rethrow a service error with context. */
export function handleServiceError(
  error: unknown,
  context: { service: string; method: string },
): never {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';

  console.error(`[${context.service}.${context.method}]`, message, error);

  if (error instanceof AppError) throw error;

  throw new AppError(message, 'SERVICE_ERROR', {
    service: context.service,
    method: context.method,
  });
}
