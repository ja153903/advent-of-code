async function readData() {
  const filepath = `${import.meta.dir}/data.in`;
  const file = Bun.file(filepath);

  const text = await file.text();
  return text
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.split(""));
}

type QueueItem = [number, number];

function isSymbol(char: string): boolean {
  if (char >= "0" && char <= "9") {
    return false;
  }

  if (char === ".") {
    return false;
  }

  return true;
}

function enqueueSymbols(data: string[][]): QueueItem[] {
  const items: QueueItem[] = [];

  for (let i = 0; i < data.length; i += 1) {
    for (let j = 0; j < data[i].length; j += 1) {
      if (isSymbol(data[i][j])) {
        items.push([i, j]);
      }
    }
  }

  return items;
}

const DIRS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 0],
  [0, -1],
  [-1, -1],
  [-1, 1],
  [1, -1],
];

// TODO: Figure out how should this should be implemented
function collectPartNumbers(data: string[][], origin: QueueItem): number[] {
  // for each origin, we should look around to see if there are any numbers
  // this should be done in a BFS manner so we can easily remove overlapping items
  const visited = new Set<string>();
  const partNumbers: number[] = [];

  for (const [dx, dy] of DIRS) {
    const cx = origin[0] + dx;
    const cy = origin[1] + dy;
  }

  return partNumbers;
}

async function solvePart1() {
  const data = await readData();
  const origins = enqueueSymbols(data);
  let result = 0;

  for (const origin of origins) {
    const partNumbers = collectPartNumbers(data, origin);
    result += partNumbers.reduce((acc, num) => acc + num, 0);
  }

  console.log(`Year 2023 - Day 3 - Part 1: ${result}`);
}

function solvePart2() {}

solvePart1();
solvePart2();
