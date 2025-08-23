import { ok, type Result } from 'neverthrow';
import { readFileToString } from '../../lib/file-io';
import { logError } from '../../lib/log';

const FILEPATH = './data/years/2015/03.txt';

function solvePart1(input: string) {
  let x = 0,
    y = 0;
  const visited = new Set<string>();

  visited.add(`${x},${y}`);

  for (const char of input) {
    if (char === '>') {
      y++;
    } else if (char === '<') {
      y--;
    } else if (char === '^') {
      x--;
    } else if (char === 'v') {
      x++;
    }

    visited.add(`${x},${y}`);
  }

  return ok(visited.size);
}

function solvePart2(input: string) {
  let x = 0,
    y = 0;
  let rx = 0,
    ry = 0;
  const visited = new Set<string>();

  visited.add(`${x},${y}`);

  for (let i = 0; i < input.length; i++) {
    const isRoboTurn = i % 2 === 1;
    const char = input[i];

    if (char === '>') {
      isRoboTurn ? ry++ : y++;
    } else if (char === '<') {
      isRoboTurn ? ry-- : y--;
    } else if (char === '^') {
      isRoboTurn ? rx-- : x--;
    } else if (char === 'v') {
      isRoboTurn ? rx++ : x++;
    }

    visited.add(isRoboTurn ? `${rx},${ry}` : `${x},${y}`);
  }

  return ok(visited.size);
}

async function solve(
  solveFn: (input: string) => Result<number, unknown>,
  logAnswer: (result: number) => void
) {
  await readFileToString(FILEPATH).andThen(solveFn).match(logAnswer, logError);
}

await solve(solvePart1, (result: number) => {
  console.log(`Advent of Code 2015 - Day 03 - Part 1: ${result}`);
});
await solve(solvePart2, (result: number) => {
  console.log(`Advent of Code 2015 - Day 03 - Part 2: ${result}`);
});
