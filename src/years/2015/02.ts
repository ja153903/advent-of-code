import { ok, Result, err } from 'neverthrow';
import { readFileToString } from '../../lib/file-io';
import { logError } from '../../lib/log';

const FILEPATH = './data/years/2015/02.txt';

function splitByNewline(line: string): Result<string[], unknown> {
  return ok(line.split('\n').filter(Boolean));
}

type Prism = {
  length: number;
  width: number;
  height: number;
};

function parsePrism(line: string): Result<Prism, unknown> {
  const [length, width, height] = line.split('x');
  if (!length || !width || !height) {
    return err('Something went wrong while parsing...');
  }
  return ok({
    length: Number(length),
    width: Number(width),
    height: Number(height),
  });
}

function getSurfaceArea({ height, length, width }: Prism) {
  return 2 * height * length + 2 * length * width + 2 * height * width;
}

function getSmallestArea({ height, length, width }: Prism) {
  return Math.min(height * length, height * width, length * width);
}

function solvePart1(prisms: Prism[]) {
  return ok(
    prisms.reduce((acc, prism) => {
      return acc + getSurfaceArea(prism) + getSmallestArea(prism);
    }, 0)
  );
}

function getVolume({ height, length, width }: Prism) {
  return height * length * width;
}

function getSmallestPerimeter({ height, length, width }: Prism) {
  return Math.min(
    2 * height + 2 * length,
    2 * height + 2 * width,
    2 * length + 2 * width
  );
}

function solvePart2(prisms: Prism[]) {
  return ok(
    prisms.reduce((acc, prism) => {
      return acc + getVolume(prism) + getSmallestPerimeter(prism);
    }, 0)
  );
}

async function solve(
  solveFn: (prisms: Prism[]) => Result<number, unknown>,
  logAnswer: (result: number) => void
) {
  await readFileToString(FILEPATH)
    .andThen(splitByNewline)
    .andThen((lines: string[]) => Result.combine(lines.map(parsePrism)))
    .andThen((prisms: Prism[]) => solveFn(prisms))
    .match(logAnswer, logError);
}

await solve(solvePart1, (result: number) => {
  console.log(`Advent of Code 2015 - Day 02 - Part 1: ${result}`);
});
await solve(solvePart2, (result: number) => {
  console.log(`Advent of Code 2015 - Day 02 - Part 2: ${result}`);
});
