import { readLines } from './deps.ts'

async function parseFile(): Promise<number[][]> {
  const result: number[][] = []

  const file = await Deno.open('aoc2021/day15-data.txt')

  for await (const line of readLines(file)) {
    const row = line.split('').map((ch) => parseInt(ch) ?? -1)
    result.push(row)
  }

  return result
}

const grid = await parseFile()

// Part 1
// this problem ends up being an application of Dijkstra's algorithm

interface Node {
  x: number
  y: number
  dist: number
}

const directions: number[][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

function findShortestPath(grid: number[][], row: number, col: number) {
  const distances = Array.from(Array(row), () => Array(col).fill(0))

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      distances[i][j] = Number.MAX_SAFE_INTEGER
    }
  }

  const spanningTree: Node[] = []

  spanningTree.push({ x: 0, y: 0, dist: 0 })

  distances[0][0] = grid[0][0]

  while (spanningTree.length) {
    const nodeWithMinDist = spanningTree.shift() ?? null
    if (!nodeWithMinDist) {
      break
    }

    for (const [dx, dy] of directions) {
      const cx = nodeWithMinDist.x + dx
      const cy = nodeWithMinDist.y + dy

      if (cx < 0 || cy < 0 || cx >= row || cy >= col) {
        continue
      }

      if (
        distances[cx][cy] >
        distances[nodeWithMinDist.x][nodeWithMinDist.y] + grid[cx][cy]
      ) {
        distances[cx][cy] =
          distances[nodeWithMinDist.x][nodeWithMinDist.y] + grid[cx][cy]
        spanningTree.push({ x: cx, y: cy, dist: distances[cx][cy] })
      }
    }

    spanningTree.sort((a, b) => {
      if (a.dist === b.dist) {
        if (a.x !== b.x) {
          return a.x - b.x
        }

        return a.y - b.y
      }

      return a.dist - b.dist
    })
  }

  console.log(distances[row - 1][col - 1] - grid[0][0])
}

findShortestPath(grid, grid.length, grid[0].length)

function createCopy(grid: number[][]): number[][] {
  const result = Array.from(new Array(grid.length), () =>
    new Array(grid[0].length).fill(0)
  )

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      result[i][j] = grid[i][j]
    }
  }

  return result
}

function increaseRiskLevel(grid: number[][]): number[][] {
  const copy = createCopy(grid)

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      copy[i][j] += 1

      if (copy[i][j] === 10) {
        copy[i][j] = 1
      }
    }
  }

  return copy
}

function getIncreasedRiskLevels(grid: number[][]): number[][][] {
  const result: number[][][] = []
  const copy = createCopy(grid)

  result.push(copy)

  for (let i = 1; i < 10; i++) {
    result.push(increaseRiskLevel(result[i - 1]))
  }

  return result
}

const levels = getIncreasedRiskLevels(grid)

const giantGrid: number[][] = Array.from(new Array(grid.length * 5), () =>
  new Array(grid[0].length * 5).fill(0)
)

for (
  let i = 0, level = 0;
  i < grid.length * 5 && level < 5;
  i += grid.length, level += 1
) {
  for (
    let j = 0, k = level;
    k < 5 + level && j < grid[0].length * 5;
    k += 1, j += grid[0].length
  ) {
    const grid = levels[k]

    for (let a = 0; a < grid.length; a++) {
      for (let b = 0; b < grid[a].length; b++) {
        giantGrid[i + a][b + j] = grid[a][b]
      }
    }
  }
}

findShortestPath(giantGrid, giantGrid.length, giantGrid[0].length)
