import { type Result, ok } from 'neverthrow';
import { readFileToString } from '../../lib/file-io';
import { splitByNewline } from '../../lib/strings';
import { logError } from '../../lib/log';

const FILEPATH = './data/years/2015/05.txt';

function countVowels(line: string) {
  let count = 0;

  for (const char of line) {
    if ('aeiou'.includes(char)) {
      count++;
    }
  }

  return count;
}

function hasDuplicateChars(line: string) {
  for (let i = 1; i < line.length; i++) {
    if (line[i - 1] === line[i]) {
      return true;
    }
  }

  return false;
}

const FORBIDDEN_STRINGS: readonly string[] = ['ab', 'cd', 'pq', 'xy'];

function containsForbiddenSubstring(line: string) {
  for (let i = 1; i < line.length; i++) {
    if (FORBIDDEN_STRINGS.includes(line.substring(i - 1, i + 1))) {
      return true;
    }
  }

  return false;
}

function isNice(line: string) {
  return (
    countVowels(line) >= 3 &&
    hasDuplicateChars(line) &&
    !containsForbiddenSubstring(line)
  );
}

function findNiceStrings(lines: string[]): Result<number, unknown> {
  return ok(lines.filter(isNice).length);
}

function repeatsInBetween(line: string) {
  for (let i = 1; i < line.length - 1; i++) {
    if (line[i - 1] === line[i + 1]) {
      return true;
    }
  }

  return false;
}

function hasRepeatingPair(line: string) {
  for (let i = 1; i < line.length - 1; i++) {
    const pair = line.substring(i - 1, i + 1);
    const result = line.indexOf(pair, i + 1);
    if (result !== -1) {
      return true;
    }
  }

  return false;
}

function isNicer(line: string) {
  return repeatsInBetween(line) && hasRepeatingPair(line);
}

function findNicerStrings(lines: string[]): Result<number, unknown> {
  return ok(lines.filter(isNicer).length);
}

async function solve(
  findNiceStrings: (lines: string[]) => Result<number, unknown>,
  logAnswer: (result: number) => void
) {
  await readFileToString(FILEPATH)
    .andThen(splitByNewline)
    .andThen(findNiceStrings)
    .match(logAnswer, logError);
}

await solve(findNiceStrings, (result: number) => {
  console.log(`Advent of Code 2015 - Day 05 - Part 1: ${result}`);
});
await solve(findNicerStrings, (result: number) => {
  console.log(`Advent of Code 2015 - Day 05 - Part 2: ${result}`);
});
