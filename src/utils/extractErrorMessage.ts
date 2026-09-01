import axios from 'axios';
import type { ApiErrorBody } from '../types/common.types';

/**
 * Backend errors always come back as `{ error: { message, details } }`
 * (see the backend's error.middleware.ts) - this pulls the human-readable
 * message out for display in a form/alert, with a generic fallback. Uses
 * axios.isAxiosError (duck-typing on the `isAxiosError` marker) rather than
 * `instanceof AxiosError`, which is the robust way to check across mocked
 * errors and bundling boundaries.
 */
export function extractErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined;

  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return body?.error?.message ?? 'Something went wrong. Please try again.';
  }

  return 'Something went wrong. Please try again.';
}
