import { ok, Result, err } from 'neverthrow';
import { readFileToString } from '../../lib/file-io';

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

function getSurfaceArea(prism: Prism) {
  return (
    2 * prism.height * prism.length +
    2 * prism.length * prism.width +
    2 * prism.height * prism.width
  );
}

function getSmallestArea(prism: Prism) {
  return Math.min(
    prism.height * prism.length,
    prism.height * prism.width,
    prism.length * prism.width
  );
}

function solvePart1(prisms: Prism[]) {
  return prisms.reduce((acc, prism) => {
    return acc + getSurfaceArea(prism) + getSmallestArea(prism);
  }, 0);
}

function getVolume(prism: Prism) {
  return prism.height * prism.length * prism.width;
}

function getSmallestPerimeter(prism: Prism) {
  return Math.min(
    2 * prism.height + 2 * prism.length,
    2 * prism.height + 2 * prism.width,
    2 * prism.length + 2 * prism.width
  );
}

function solvePart2(prisms: Prism[]) {
  return prisms.reduce((acc, prism) => {
    return acc + getVolume(prism) + getSmallestPerimeter(prism);
  }, 0);
}

async function solve(solveFn: (prisms: Prism[]) => number, part: string) {
  await readFileToString(FILEPATH)
    .andThen(splitByNewline)
    .andThen((lines: string[]) => Result.combine(lines.map(parsePrism)))
    .match(
      (prisms) => {
        const result = solveFn(prisms);
        console.log(`Advent of Code 2015 - Day 02 - Part ${part}: ${result}`);
      },
      (err) => {
        console.error(err);
      }
    );
}

await solve(solvePart1, '1');
await solve(solvePart2, '2');
