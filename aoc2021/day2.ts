import { readLines } from 'https://deno.land/std/io/buffer.ts';

interface Moves {
  direction: string
  unit: number
}

async function parseFile(): Promise<Moves[]> {
  const result: Moves[] = [];

  const file = await Deno.open('aoc2021/day2-data.txt');

  for await (const line of readLines(file)) {
    const [direction, unit] = line.split(' ');

    result.push({
      direction,
      unit: parseInt(unit),
    });
  }

  return result;
}

const moves = await parseFile()

// Part 1
let forward = 0, depth = 0

for (const { direction, unit } of moves) {
  switch (direction) {
  case 'forward':
    forward += unit
    break
  case 'up':
    depth -= unit
    break
  case 'down':
    depth += unit
    break
  }
}

console.log(forward * depth)

// Part 2
let aim = 0
forward = 0, depth = 0

for (const { direction, unit } of moves) {
  switch(direction) {
  case 'forward':
    forward += unit
    depth += aim * unit
    break
  case 'up':
    aim -= unit
    break
  case 'down':
    aim += unit
    break
  }
}

console.log(forward * depth)
