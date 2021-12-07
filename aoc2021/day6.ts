import { readLines } from './deps.ts';

async function parseLine(): Promise<number[]> {
  let result: number[] = [];
  const file = await Deno.open('aoc2021/day6-data.txt');

  for await (const line of readLines(file)) {
    result = line.split(',').map((ch) => parseInt(ch) ?? -1);
    break;
  }

  return result;
}

async function countFishes(days: number) {
  const fishes = await parseLine();
  const state: number[] = new Array(9).fill(0);

  fishes.forEach(fish => {
    state[fish] += 1;
  });

  for (let i = 1; i <= days; i++) {
    const toShift = state[0];

    for (let j = 1; j < 9; j++) {
      state[j - 1] = state[j];
    }

    state[8] = toShift;

    if (toShift > 0) {
      state[6] += toShift;
    }
  }

  console.log(state.reduce((acc, num) => acc + num));
}

countFishes(80);
countFishes(256);

