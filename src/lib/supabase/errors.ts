export function mapSupabaseError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error || '');
  if (/jwt|token|unauthorized|forbidden|permission/i.test(message)) return 'You do not have permission to complete this action.';
  if (/duplicate|unique/i.test(message)) return 'This item already exists.';
  if (/network|fetch/i.test(message)) return 'Connection issue. Please try again.';
  if (/not found/i.test(message)) return 'We could not find the requested item.';
  return 'Something went wrong. Please try again.';
}
