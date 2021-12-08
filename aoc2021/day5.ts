import { readLines } from 'https://deno.land/std/io/buffer.ts'

interface Point {
  x: number
  y: number
}

interface LineSegment {
  start: Point
  end: Point
  direction: string
}

async function parseFile(): Promise<{
  lineSegments: LineSegment[]
  maxX: number
  maxY: number
}> {
  const result: LineSegment[] = []

  const file = await Deno.open('aoc2021/day5-data.txt')

  let maxX = 0
  let maxY = 0

  for await (const line of readLines(file)) {
    const [start, end] = line.split(' -> ')

    const [ax, ay] = start.split(',')
    const [bx, by] = end.split(',')

    const startPoint: Point = { x: parseInt(ax) ?? 0, y: parseInt(ay) ?? 0 }
    const endPoint: Point = { x: parseInt(bx) ?? 0, y: parseInt(by) ?? 0 }

    const direction =
      startPoint.y === endPoint.y
        ? 'horizontal'
        : startPoint.x === endPoint.x
        ? 'vertical'
        : 'diagonal'

    maxX = Math.max(maxX, startPoint.x, endPoint.x)
    maxY = Math.max(maxY, startPoint.y, endPoint.y)

    result.push({
      direction,
      end: endPoint,
      start: startPoint,
    })
  }

  return { lineSegments: result, maxX, maxY }
}

function createMatrix(
  maxX: number,
  maxY: number,
  defaultValue = 0
): number[][] {
  const matrix: number[][] = new Array(maxY + 1)
  for (let i = 0; i < maxY + 1; i++) {
    matrix[i] = new Array(maxX + 1).fill(defaultValue)
  }

  return matrix
}

function countSignificantOverlaps(matrix: number[][]): number {
  let count = 0

  for (const row of matrix) {
    for (const col of row) {
      if (col >= 2) {
        count += 1
      }
    }
  }

  return count
}

function visualizeMatrix(matrix: number[][]) {
  for (const row of matrix) {
    const rowAsStr: string = row
      .map((num) => (num === 0 ? '.' : num.toString()))
      .join('')
    console.log(rowAsStr)
  }
}

function evaluatePart1(
  lineSegments: LineSegment[],
  maxX: number,
  maxY: number
) {
  const matrix = createMatrix(maxX, maxY)

  for (const lineSegment of lineSegments) {
    const { direction, start, end } = lineSegment

    if (direction === 'horizontal') {
      const horizontalStart = Math.min(start.x, end.x)
      const horizontalEnd = Math.max(start.x, end.x)

      for (let i = horizontalStart; i <= horizontalEnd; i++) {
        matrix[start.y][i] += 1
      }
    } else if (direction === 'vertical') {
      const verticalStart = Math.min(start.y, end.y)
      const verticalEnd = Math.max(start.y, end.y)

      for (let i = verticalStart; i <= verticalEnd; i++) {
        matrix[i][start.x] += 1
      }
    }
  }

  const count = countSignificantOverlaps(matrix)

  console.log(count)
}

function evaluatePart2(
  lineSegments: LineSegment[],
  maxX: number,
  maxY: number
) {
  const matrix = createMatrix(maxX, maxY)

  for (const lineSegment of lineSegments) {
    const { direction, start, end } = lineSegment

    if (direction === 'horizontal') {
      const horizontalStart = Math.min(start.x, end.x)
      const horizontalEnd = Math.max(start.x, end.x)

      for (let i = horizontalStart; i <= horizontalEnd; i++) {
        matrix[start.y][i] += 1
      }
    } else if (direction === 'vertical') {
      const verticalStart = Math.min(start.y, end.y)
      const verticalEnd = Math.max(start.y, end.y)

      for (let i = verticalStart; i <= verticalEnd; i++) {
        matrix[i][start.x] += 1
      }
    } else {
      if (
        (start.x < end.x && start.y < end.y) ||
        (start.x > end.x && start.y > end.y)
      ) {
        const diagonalStartX = Math.min(start.x, end.x)
        const diagonalStartY = Math.min(start.y, end.y)

        const diagonalEndX = Math.max(start.x, end.x)
        const diagonalEndY = Math.max(start.y, end.y)

        for (
          let i = diagonalStartX, j = diagonalStartY;
          i <= diagonalEndX && j <= diagonalEndY;
          i++, j++
        ) {
          matrix[j][i] += 1
        }
      } else if (start.x > end.x && start.y < end.y) {
        for (let i = start.x, j = start.y; i >= end.x; i--, j++) {
          matrix[j][i] += 1
        }
      } else if (start.x < end.x && start.y > end.y) {
        for (let i = start.x, j = start.y; i <= end.x; i++, j--) {
          matrix[j][i] += 1
        }
      }
    }
  }

  const count = countSignificantOverlaps(matrix)

  console.log(count)
}

const { lineSegments, maxX, maxY } = await parseFile()

// Part 1
evaluatePart1(lineSegments, maxX, maxY)

// Part 2
evaluatePart2(lineSegments, maxX, maxY)
