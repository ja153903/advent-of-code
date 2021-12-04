import { readLines } from 'https://deno.land/std/io/buffer.ts';

async function parseFile(): Promise<string[]> {
  const result: string[] = [];

  const file = await Deno.open('aoc2021/day3-data.txt');

  for await (const line of readLines(file)) {
    result.push(line);
  }

  return result;
}

function convertBinaryToNumber(binary: string[]): number {
  let result = 0;
  let power = 0;
  while (binary.length > 0) {
    result += parseInt(binary.pop() ?? '0') * Math.pow(2, power);
    power += 1;
  }

  return result;
}

const binaryNums = await parseFile();

// Part 1
console.log('==== Part 1 ====');

interface CommonBits {
  mostCommonBits: string[];
  leastCommonBits: string[];
}

function getMostAndLeastCommonBits(binaryNums: string[]): CommonBits {
  const mostCommonBits = [];
  const leastCommonBits = [];

  for (let i = 0; i < binaryNums[0].length; i++) {
    let zeros = 0;
    let ones = 0;

    for (const binaryNum of binaryNums) {
      if (binaryNum[i] === '1') {
        ones += 1;
      } else {
        zeros += 1;
      }
    }

    if (ones >= zeros) {
      mostCommonBits.push('1');
      leastCommonBits.push('0');
    } else {
      mostCommonBits.push('0');
      leastCommonBits.push('1');
    }
  }

  return {
    mostCommonBits,
    leastCommonBits,
  };
}

const { mostCommonBits, leastCommonBits } =
  getMostAndLeastCommonBits(binaryNums);

const gamma = convertBinaryToNumber(mostCommonBits);
const epsilon = convertBinaryToNumber(leastCommonBits);

console.log(gamma * epsilon);

// Part 2
console.log('==== Part 2 ====');

// Find oxygenGeneratorRating
let oxygenGeneratorRating = [...binaryNums];
let co2GeneratorRating = [...binaryNums];
let currentIndex = 0;

while (oxygenGeneratorRating.length > 1) {
  const { mostCommonBits } = getMostAndLeastCommonBits(oxygenGeneratorRating);
  const mostCommonBit = mostCommonBits[currentIndex];

  oxygenGeneratorRating = oxygenGeneratorRating.filter(
    (binaryNum) => binaryNum[currentIndex] === mostCommonBit
  );
  currentIndex += 1;
}

currentIndex = 0;

while (co2GeneratorRating.length > 1) {
  const { leastCommonBits } = getMostAndLeastCommonBits(co2GeneratorRating);

  const leastCommonBit = leastCommonBits[currentIndex];

  co2GeneratorRating = co2GeneratorRating.filter(
    (binaryNum) => binaryNum[currentIndex] === leastCommonBit
  );

  currentIndex += 1;
}

const oxygenGeneratorRatingCandidate = oxygenGeneratorRating?.[0] ?? '';
const co2GeneratorRatingCandidate = co2GeneratorRating?.[0] ?? '';

const oxygen = convertBinaryToNumber([...oxygenGeneratorRatingCandidate]);
const co2 = convertBinaryToNumber([...co2GeneratorRatingCandidate]);

console.log(oxygen * co2);
