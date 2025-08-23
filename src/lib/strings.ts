import { ok } from 'neverthrow';

export function splitByNewline(input: string) {
  return ok(input.split('\n').filter(Boolean));
}
