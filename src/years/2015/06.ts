import { err, ok, Result } from 'neverthrow';
import { readFileToString } from '../../lib/file-io';
import { splitByNewline } from '../../lib/strings';
import { logError } from '../../lib/log';

const FILEPATH = './data/years/2015/06.txt';

type Operation = 'turn off' | 'turn on' | 'toggle';

type Coordinate = { x: number; y: number };

type Instruction = {
  operation: Operation;
  start: Coordinate;
  end: Coordinate;
};

const INSTRUCTION_REGEX =
  /(?<operation>turn off|turn on|toggle) (?<startX>\d+),(?<startY>\d+) through (?<endX>\d+),(?<endY>\d+)/;

function isValidOperation(operation: string): operation is Operation {
  return (
    operation === 'turn off' ||
    operation === 'turn on' ||
    operation === 'toggle'
  );
}

function parseInstruction(line: string): Result<Instruction, unknown> {
  const match = line.match(INSTRUCTION_REGEX);
  if (!match) {
    return err('There is no RegExpMatchArray');
  }

  const groups = match.groups;
  if (!groups) {
    return err('There is are no groups within the RegExpMatchArray');
  }

  const { operation, startX, startY, endX, endY } = groups;
  if (!operation || !startX || !startY || !endX || !endY) {
    return err(`The groups were not properly captured for line: ${line}`);
  }

  if (!isValidOperation(operation)) {
    return err(`The operation ${operation} is not a valid member of Operation`);
  }

  return ok({
    operation,
    start: {
      x: Number.parseInt(startX),
      y: Number.parseInt(startY),
    },
    end: {
      x: Number.parseInt(endX),
      y: Number.parseInt(endY),
    },
  });
}

async function getInstructions() {
  return await readFileToString(FILEPATH)
    .andThen(splitByNewline)
    .andThen((lines: string[]) => Result.combine(lines.map(parseInstruction)));
}

// Convert (x, y) coordinates to flat array index
function coordToIndex(x: number, y: number): number {
  return y * 1000 + x;
}

// Operation lookup table for better performance
const operations = {
  'turn off': (_: number) => 0,
  'turn on': (_: number) => 1,
  toggle: (value: number) => value ^ 1,
} as const;

function solvePart1(instructions: Instruction[]) {
  const grid = new Uint8Array(1000 * 1000);
  let count = 0;

  for (const instruction of instructions) {
    const { operation, start, end } = instruction;
    const operationFn = operations[operation];

    for (let x = start.x; x <= end.x; x++) {
      for (let y = start.y; y <= end.y; y++) {
        const index = coordToIndex(x, y);
        const oldValue = grid[index];
        const newValue = operationFn(oldValue);
        grid[index] = newValue;

        // Update count incrementally instead of separate counting pass
        if (oldValue === 0 && newValue === 1) count++;
        else if (oldValue === 1 && newValue === 0) count--;
      }
    }
  }

  return ok(count);
}

/* Original implementation (commented out for reference):
function solvePart1Original(instructions: Instruction[]) {
  const grid = [];
  for (let i = 0; i < 1000; i++) {
    grid.push(new Array(1000).fill(0));
  }

  for (const instruction of instructions) {
    for (let i = instruction.start.x; i <= instruction.end.x; i++) {
      for (let j = instruction.start.y; j <= instruction.end.y; j++) {
        switch (instruction.operation) {
          case 'turn off':
            grid[i][j] = 0;
            break;
          case 'turn on':
            grid[i][j] = 1;
            break;
          case 'toggle':
            grid[i][j] ^= 1;
            break;
        }
      }
    }
  }

  let count = 0;

  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 1000; j++) {
      if (grid[i][j] === 1) {
        count++;
      }
    }
  }

  return ok(count);
}
*/

const augmentedOperations = {
  'turn off': (value: number) => Math.max(0, value - 1),
  'turn on': (value: number) => value + 1,
  toggle: (value: number) => value + 2,
} as const;

function solvePart2(instructions: Instruction[]) {
  const grid = new Uint8Array(1000 * 1000);

  for (const instruction of instructions) {
    const { operation, start, end } = instruction;
    const operationFn = augmentedOperations[operation];

    for (let x = start.x; x <= end.x; x++) {
      for (let y = start.y; y <= end.y; y++) {
        const index = coordToIndex(x, y);
        const oldValue = grid[index];
        const newValue = operationFn(oldValue);
        grid[index] = newValue;
      }
    }
  }

  return ok(grid.reduce((a, b) => a + b));
}

async function solve(
  solveFn: (instructions: Instruction[]) => Result<number, unknown>,
  logAnswer: (result: number) => void
) {
  (await getInstructions()).andThen(solveFn).match(logAnswer, logError);
}

await solve(solvePart1, (result: number) => {
  console.log(`Advent of Code 2015 - Day 06 - Part 1: ${result}`);
});

await solve(solvePart2, (result: number) => {
  console.log(`Advent of Code 2015 - Day 06 - Part 2: ${result}`);
});
