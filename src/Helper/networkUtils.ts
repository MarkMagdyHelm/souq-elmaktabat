import axios from 'axios';

const NETWORK_ERROR_CODES = new Set([
  'ERR_NETWORK',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
]);

export function isNetworkConnectionError(error: unknown): boolean {
  if (!error || axios.isCancel(error)) {
    return false;
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
      return false;
    }

    const code = error.code?.toUpperCase();
    if (code && NETWORK_ERROR_CODES.has(code)) {
      return true;
    }

    const message = error.message?.toLowerCase() ?? '';
    return (
      message === 'network error' ||
      message.includes('network request failed')
    );
  }

  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network request failed') ||
      message.includes('failed to fetch')
    );
  }

  return false;
}
