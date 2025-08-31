import { Result, ok, err } from 'neverthrow';
import { readFileToString } from '../../lib/file-io';
import { splitByNewline } from '../../lib/strings';
import { logError } from '../../lib/log';

const FILEPATH = './data/years/2015/08.txt';

function getInMemoryLength(line: string): Result<number, unknown> {
  let length = 0;
  let i = 1;

  while (i < line.length - 1) {
    if (line[i] === '\\') {
      if (line[i + 1] === 'x') {
        length++;
        i += 4;
      } else if (line[i + 1] === '\\' || line[i + 1] === '\"') {
        length++;
        i += 2;
      } else {
        return err('Something went wrong while getting in-memory length');
      }
    } else {
      length++;
      i++;
    }
  }

  return ok(length);
}

function solvePart1(line: string): Result<number, unknown> {
  const codeRepresentationLength = line.length; // length of the string as is
  const inMemoryLength = getInMemoryLength(line);
  return inMemoryLength.match(
    (inMemoryLength) => {
      return ok(codeRepresentationLength - inMemoryLength);
    },
    (e) => {
      return err(e);
    }
  );
}

function getReEncodedStringLength(line: string) {
  let result = 2;

  for (const char of line) {
    if (char === '\"' || char === '\\') {
      result += 2;
    } else {
      result++;
    }
  }

  return result;
}

function solvePart2(line: string): Result<number, unknown> {
  const codeRepresentationLength = line.length;
  const reEncodedStringLength = getReEncodedStringLength(line);
  return ok(reEncodedStringLength - codeRepresentationLength);
}

async function solve(
  solveFn: (line: string) => Result<number, unknown>,
  logAnswer: (result: number) => void
) {
  await readFileToString(FILEPATH)
    .andThen(splitByNewline)
    .andThen((lines: string[]) => Result.combine(lines.map(solveFn)))
    .andThen((counts: number[]) => ok(counts.reduce((a, b) => a + b)))
    .match(logAnswer, logError);
}

await solve(solvePart1, (result: number) => {
  console.log(`Advent of Code 2015 - Day 08 - Part 1: ${result}`);
});

await solve(solvePart2, (result: number) => {
  console.log(`Advent of Code 2015 - Day 08 - Part 2: ${result}`);
});
