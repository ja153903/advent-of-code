import { readLines } from './deps.ts'

async function parseFile(): Promise<number[][]> {
  const result: number[][] = []

  const file = await Deno.open('aoc2021/day11-data.txt')

  for await (const line of readLines(file)) {
    const row: number[] = line.split('').map((ch) => parseInt(ch) ?? 0)
    result.push(row)
  }

  return result
}

let octopus = await parseFile()

interface Point {
  row: number
  column: number
}

function isZeroMatrix(matrix: number[][]): boolean {
  for (const row of matrix) {
    for (const col of row) {
      if (col !== 0) {
        return false
      }
    }
  }

  return true
}

const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
]

const DEFAULT_POINT = { row: -1, column: -1 }
let flashes = 0

function evaluateFlashPoints(octopus: number[][]): number[][] {
  const flashPoints: Point[] = []

  // iterate over every element and increase values by 1
  for (let r = 0; r < octopus.length; r++) {
    for (let c = 0; c < octopus[r].length; c++) {
      octopus[r][c] += 1
      if (octopus[r][c] > 9) {
        flashPoints.push({ row: r, column: c })
      }
    }
  }

  // for each coordinate pair in flashPoints,
  // we should then check adjacent coordinate pairs
  // and make sure that we update those. We should also
  // make sure that the points within flashPoints
  // are not repeatedly updated so we need to make sure that
  // it's been visited
  // for now, we can mark a point that's been flashed with -1

  while (flashPoints.length > 0) {
    const { row, column } = flashPoints.shift() ?? DEFAULT_POINT
    octopus[row][column] = -1
    flashes += 1

    for (const [dcolumn, drow] of DIRECTIONS) {
      const crow = row + drow
      const ccolumn = column + dcolumn

      if (
        crow < 0 ||
        crow >= octopus.length ||
        ccolumn < 0 ||
        ccolumn >= octopus[0].length ||
        octopus[crow][ccolumn] === -1 ||
        octopus[crow][ccolumn] > 9
      ) {
        continue
      }

      octopus[crow][ccolumn] += 1

      if (octopus[crow][ccolumn] > 9) {
        flashPoints.push({ row: crow, column: ccolumn })
      }
    }
  }

  for (let r = 0; r < octopus.length; r++) {
    for (let c = 0; c < octopus[r].length; c++) {
      if (octopus[r][c] === -1) {
        octopus[r][c] = 0
      }
    }
  }

  return octopus
}

for (let i = 0; i < 100; i++) {
  octopus = evaluateFlashPoints(octopus)
}

console.log(flashes)

// Part 2
octopus = await parseFile()

let i = 0

while (!isZeroMatrix(octopus)) {
  octopus = evaluateFlashPoints(octopus)
  i++
}

console.log(`Sync flash: ${i}`)
