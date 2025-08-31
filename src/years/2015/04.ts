import { createHash } from 'node:crypto';
import { ok } from 'neverthrow';

const INPUT = 'iwrupvqb';

function solve(startsWith: string) {
  let start = 0;
  let hash = '';

  while (!hash.startsWith(startsWith)) {
    start++;
    hash = createHash('md5').update(`${INPUT}${start}`).digest('hex');
  }

  return ok(start);
}

solve('00000').match(
  (result) => {
    console.log(`Advent of Code 2015 - Day 04 - Part 1: ${result}`);
  },
  (e) => {
    console.error(e);
  }
);

solve('000000').match(
  (result) => {
    console.log(`Advent of Code 2015 - Day 04 - Part 2: ${result}`);
  },
  (e) => {
    console.error(e);
  }
);
