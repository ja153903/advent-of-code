import { readLines } from './deps.ts'

interface Point {
  x: number
  y: number
}

interface Instruction {
  axis: string
  value: number
}

async function parseFile(): Promise<{
  points: Point[]
  instructions: Instruction[]
}> {
  const points: Point[] = []
  const instructions: Instruction[] = []

  const file = await Deno.open('aoc2021/day13-data.txt')

  for await (const line of readLines(file)) {
    if (line.includes(',')) {
      const [x, y] = line.split(',')
      points.push({ x: parseInt(x) ?? 0, y: parseInt(y) ?? 0 })
    } else if (line.length > 0) {
      const foldOverX = line.includes('x')
      const [_instruction, value] = line.split('=')

      instructions.push({
        axis: foldOverX ? 'x' : 'y',
        value: parseInt(value) ?? 0,
      })
    }
  }

  return { points, instructions }
}

const { points, instructions } = await parseFile()

let rows = 0
let cols = 0

for (const { x, y } of points) {
  rows = Math.max(rows, y)
  cols = Math.max(cols, x)
}

rows += 1
cols += 1

function createMatrix(rows: number, cols: number): string[][] {
  const matrix: string[][] = new Array(rows)
  for (let i = 0; i < rows; i++) {
    matrix[i] = new Array(cols).fill('.')
  }

  for (const { x, y } of points) {
    matrix[y][x] = '#'
  }

  return matrix
}

let matrix = createMatrix(rows, cols)

// Part 1
// how many dots are left after the first fold instruction

function horizontalFold(matrix: string[][], fold: number): string[][] {
  let i = fold + 1
  let j = fold - 1

  while (i < matrix.length && j >= 0) {
    for (let col = 0; col < matrix[i].length; col++) {
      let temp = '.'
      if (matrix[i][col] === '#' || matrix[j][col] == '#') {
        temp = '#'
      }

      matrix[j][col] = temp
    }

    i += 1
    j -= 1
  }

  const result: string[][] = []

  for (let i = 0; i < fold; i++) {
    result.push([...matrix[i]])
  }

  return result
}

function verticalFold(matrix: string[][], fold: number): string[][] {
  let i = fold + 1
  let j = fold - 1

  while (i < matrix[0].length && j >= 0) {
    for (let row = 0; row < matrix.length; row++) {
      let temp = '.'
      if (matrix[row][i] === '#' || matrix[row][j] == '#') {
        temp = '#'
      }

      matrix[row][j] = temp
    }

    i += 1
    j -= 1
  }

  const result: string[][] = new Array(matrix.length)

  for (let i = 0; i < fold; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (!result[j]) {
        result[j] = []
      }
      result[j].push(matrix[j][i])
    }
  }

  return result
}

function countDots(matrix: string[][]): number {
  let count = 0
  for (const row of matrix) {
    for (const col of row) {
      if (col === '#') {
        count += 1
      }
    }
  }

  return count
}

function print(matrix: string[][]) {
  for (const row of matrix) {
    console.log(row.join(''))
  }
}

let count = 0

for (const { axis, value } of instructions) {
  const cols = matrix[0].length
  const rows = matrix.length
  // if axis = y, then we go horizontally
  // if axis = x, then we go vertically
  if (axis === 'y') {
    for (let i = 0; i < cols; i++) {
      matrix[value][i] = '-'
    }
    matrix = horizontalFold(matrix, value)
  } else {
    for (let i = 0; i < rows; i++) {
      matrix[i][value] = '|'
    }
    matrix = verticalFold(matrix, value)
  }

  count += 1

  // Part 1
  if (count === 1) {
    console.log(`The number of dots after one fold is: ${countDots(matrix)}`)
  }

  // Part 2
  if (count === instructions.length) {
    print(matrix)
  }
}
