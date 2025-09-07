import { ResultAsync } from 'neverthrow';

export function readFileToString(
  filepath: string
): ResultAsync<string, unknown> {
  const file = Bun.file(filepath);
  return ResultAsync.fromPromise(file.text(), (e: unknown) => e);
}

export function readFileToObject(
  filepath: string
): ResultAsync<Object, unknown> {
  const file = Bun.file(filepath);
  return ResultAsync.fromPromise(file.json(), (e: unknown) => e);
}
