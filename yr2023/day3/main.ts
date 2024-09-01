import { DIRS_WITH_DIAGONALS } from "../../utils/constants";

async function readData() {
  const filepath = `${import.meta.dir}/data.in`;
  const file = Bun.file(filepath);

  const text = await file.text();
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(""));
}

type NumberMetadata = {
  value: number;
  row: number;
  start: number;
  end: number;
};

function fetchNumbersPerRow(line: string[], row: number): NumberMetadata[] {
  const result: NumberMetadata[] = [];
  let currentNum = "";
  let start = line.length;
  let end = 0;

  for (let i = 0; i < line.length; i += 1) {
    if (line[i] >= "0" && line[i] <= "9") {
      currentNum += line[i];
      start = Math.min(start, i);
      end = Math.max(end, i);
    } else if (start <= end) {
      result.push({ value: parseInt(currentNum), row, start, end });
      currentNum = "";
      start = line.length;
      end = 0;
    }
  }

  // Make sure we add the last value
  if (start <= end) {
    result.push({ value: parseInt(currentNum), row, start, end });
  }

  return result;
}

function isAdjacentToSymbol(number: NumberMetadata, data: string[][]): boolean {
  const { row, start, end } = number;

  for (let i = start; i <= end; i += 1) {
    for (const [a, b] of DIRS_WITH_DIAGONALS) {
      const newRow = row + a;
      const newCol = i + b;

      if (
        newRow < 0 ||
        newCol < 0 ||
        newRow >= data.length ||
        newCol >= data[0].length
      ) {
        continue;
      }

      if (
        (data[newRow][newCol] >= "0" && data[newRow][newCol] <= "9") ||
        data[newRow][newCol] === "."
      ) {
        continue;
      }

      return true;
    }
  }

  return false;
}

async function solvePart1() {
  const data = await readData();
  const result = data
    .flatMap((line, index) => fetchNumbersPerRow(line, index))
    .filter((number) => isAdjacentToSymbol(number, data))
    .reduce((acc, number) => acc + number.value, 0);

  console.log(`Year 2023 - Day 3 - Part 1: ${result}`);
}

function isAdjacentToStar(
  number: NumberMetadata,
  data: string[][]
): { isAdjacent: boolean; key: string } {
  const { row, start, end } = number;

  for (let i = start; i <= end; i += 1) {
    for (const [a, b] of DIRS_WITH_DIAGONALS) {
      const newRow = row + a;
      const newCol = i + b;

      if (
        newRow < 0 ||
        newCol < 0 ||
        newRow >= data.length ||
        newCol >= data[0].length
      ) {
        continue;
      }

      if (
        (data[newRow][newCol] >= "0" && data[newRow][newCol] <= "9") ||
        data[newRow][newCol] === "."
      ) {
        continue;
      }

      if (data[newRow][newCol] === "*") {
        return { isAdjacent: true, key: `${newRow},${newCol}` };
      }
    }
  }

  return { isAdjacent: false, key: "" };
}

async function solvePart2() {
  const data = await readData();
  const numbers = data.flatMap((line, index) =>
    fetchNumbersPerRow(line, index)
  );

  const starMap = new Map<string, number[]>();

  for (let i = 0; i < data.length; i += 1) {
    for (let j = 0; j < data[i].length; j += 1) {
      if (data[i][j] === "*") {
        starMap.set(`${i},${j}`, []);
      }
    }
  }

  for (const number of numbers) {
    const { isAdjacent, key } = isAdjacentToStar(number, data);
    if (isAdjacent) {
      starMap.get(key)?.push(number.value);
    }
  }

  const result = [...starMap.values()]
    .filter((value) => value.length === 2)
    .map((value) => value[0] * value[1])
    .reduce((acc, value) => acc + value, 0);

  console.log(`Year 2023 - Day 3 - Part 2: ${result}`);
}

solvePart1();
solvePart2();
