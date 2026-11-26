/** Only interpret the explicit server error marker, not generic network failures. */
export function isWriteLimitError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const value = error as { message?: unknown; error?: unknown };
  return (typeof value.message === 'string' && value.message.includes('SLEER_RATE_LIMIT')) ||
    (typeof value.error === 'string' && value.error.includes('SLEER_RATE_LIMIT'));
}
