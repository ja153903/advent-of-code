import { ok, type Result } from 'neverthrow';
import { readFileToObject } from '../../lib/file-io';
import { logError } from '../../lib/log';

const FILEPATH = './data/years/2015/12.json';

function sumNumbersFromObject(json: Object) {
  if (!json) {
    return 0;
  }

  let sum = 0;

  for (const item of Object.values(json)) {
    if (typeof item === 'number') {
      sum += item;
    } else if (typeof item === 'object') {
      sum += sumNumbersFromObject(item);
    }
  }

  return sum;
}

function sumExceptRed(json: Object) {
  if (!json) {
    return 0;
  }

  let sum = 0;

  for (const value of Object.values(json)) {
    if (typeof value === 'number') {
      sum += value;
    } else if (typeof value === 'object') {
      if (
        Array.isArray(value) ||
        !Object.values(value).some((v) => v === 'red')
      ) {
        sum += sumExceptRed(value);
      }
    }
  }

  return sum;
}

async function solve(
  solveFn: (t: Object) => Result<number, unknown>,
  logAnswer: (result: number) => void
) {
  await readFileToObject(FILEPATH).andThen(solveFn).match(logAnswer, logError);
}

await solve(
  (t: Object) => ok(sumNumbersFromObject(t)),
  (result: number) => {
    console.log(`Advent of Code 2015 - Day 12 - Part 1: ${result}`);
  }
);
await solve(
  (t: Object) => ok(sumExceptRed(t)),
  (result: number) => {
    console.log(`Advent of Code 2015 - Day 12 - Part 2: ${result}`);
  }
);
