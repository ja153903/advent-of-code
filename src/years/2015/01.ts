import { type Result, ok, err } from 'neverthrow';
import { readFileToString } from '../../lib/file-io';

const FILEPATH = `./data/years/2015/01.txt`;

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
  part: string
) {
  await readFileToString(FILEPATH)
    .andThen(solveFn)
    .match(
      (result) => {
        console.log(`Advent of Code 2015 - Day 01 - Part ${part}: ${result}`);
      },
      (e) => {
        console.error(e);
      }
    );
}

await solve(solvePart1, '1');
await solve(solvePart2, '2');
