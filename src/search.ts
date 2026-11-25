/** PostgREST treats both percent and asterisk as LIKE wildcards. Strip filter syntax
 * rather than interpreting user input as part of a database expression. */
export function searchPattern(input: string): string | null {
  const text = input.trim().replace(/[%_*,().\\]/g, '').trim();
  return text ? `%${text}%` : null;
}
