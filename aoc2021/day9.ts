import { readLines } from './deps.ts'

async function parseFile(): Promise<number[][]> {
  const result: number[][] = []

  const file = await Deno.open('aoc2021/day9-data.txt')

  for await (const line of readLines(file)) {
    const nums = line.split('').map((num) => parseInt(num) ?? 0)
    result.push(nums)
  }

  return result
}

const heightMap = await parseFile()

const UPPER_ROW_LIMIT = heightMap.length
const UPPER_COL_LIMIT = heightMap[0].length

const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
]

function checkIfLocalMin(row: number, col: number): boolean {
  const currentValue = heightMap[row][col]
  for (const [dc, dr] of DIRECTIONS) {
    const cr = row + dr
    const cc = col + dc

    if (cr < 0 || cr >= UPPER_ROW_LIMIT || cc < 0 || cc >= UPPER_COL_LIMIT) {
      continue
    }

    if (currentValue >= heightMap[cr][cc]) {
      return false
    }
  }

  return true
}

let sumOfLocalMinimums = 0

const lowPoints: number[][] = []

for (let i = 0; i < UPPER_ROW_LIMIT; i++) {
  for (let j = 0; j < UPPER_COL_LIMIT; j++) {
    if (checkIfLocalMin(i, j)) {
      sumOfLocalMinimums += heightMap[i][j] + 1
      lowPoints.push([i, j])
    }
  }
}

console.log(sumOfLocalMinimums)

// Part 2
// for every low point, we want to make sure to do dfs until we hit 9 or the number adjacent to it is less than itself

function copyMatrix(matrix: number[][]): number[][] {
  const copy = []

  for (const row of matrix) {
    copy.push([...row])
  }

  return copy
}

function getBasinSize(i: number, j: number, matrix: number[][]): number {
  if (
    i < 0 ||
    i >= matrix.length ||
    j < 0 ||
    j >= matrix[0].length ||
    matrix[i][j] === 9 ||
    matrix[i][j] === -1
  ) {
    return 0
  }

  matrix[i][j] = -1

  return (
    1 +
    getBasinSize(i + 1, j, matrix) +
    getBasinSize(i - 1, j, matrix) +
    getBasinSize(i, j + 1, matrix) +
    getBasinSize(i, j - 1, matrix)
  )
}

const result: number[] = []

for (const [i, j] of lowPoints) {
  const copy = copyMatrix(heightMap)
  result.push(getBasinSize(i, j, copy))
}

const product = result
  .sort((a: number, b: number) => b - a)
  .splice(0, 3)
  .reduce((acc, num) => acc * num)

console.log(product)
