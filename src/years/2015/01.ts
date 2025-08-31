import { type Result, ok, err } from 'neverthrow';
import { readFileToString } from '../../lib/file-io';
import { logError } from '../../lib/log';

const FILEPATH = './data/years/2015/01.txt';

function solvePart1(input: string) {
  let floor = 0;
  for (const char of input) {
    if (char === '(') {
      floor++;
    } else if (char === ')') {
      floor--;
    }
  }

  return ok(floor);
}

function solvePart2(input: string) {
  let floor = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '(') {
      floor++;
    } else if (input[i] === ')') {
      floor--;
    }

    if (floor < 0) {
      return ok(i + 1);
    }
  }

  return err('Did not find an appropriate floor to exit');
}

async function solve(
  solveFn: (input: string) => Result<number, unknown>,
  logAnswer: (result: number) => void
) {
  await readFileToString(FILEPATH).andThen(solveFn).match(logAnswer, logError);
}

await solve(solvePart1, (result: number) => {
  console.log(`Advent of Code 2015 - Day 01 - Part 1: ${result}`);
});
await solve(solvePart2, (result: number) => {
  console.log(`Advent of Code 2015 - Day 01 - Part 2: ${result}`);
});
