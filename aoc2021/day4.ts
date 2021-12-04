import { readLines } from 'https://deno.land/std/io/buffer.ts';

async function parseFile(): Promise<{
  bingoNumbers: number[];
  bingoBoardRows: number[][];
}> {
  let bingoNumbers: number[] = []
  const bingoBoardRows: number[][] = []

  const file = await Deno.open('aoc2021/day4-data.txt')

  for await (const line of readLines(file)) {
    if (line.includes(',')) {
      const numbersAsStr: string[] = line.split(',')
      bingoNumbers = numbersAsStr.map((num) => parseInt(num) ?? 0)
    } else if (line.length > 0) {
      const rowAsStr: string[] = line.trim().split(' ')
      const rowAsNum: number[] = rowAsStr
        .map((num) => parseInt(num) ?? 0)
        .filter(num => !Number.isNaN(num))

      bingoBoardRows.push(rowAsNum)
    }
  }

  return {
    bingoNumbers,
    bingoBoardRows,
  }
}

function convertBingoBoardRowsIntoMatrices(rows: number[][], size: number): number[][][] {
  const result: number[][][] = []

  let subresult: number[][] = []
  let count = 0

  for (const row of rows) {
    subresult.push(row)
    count += 1

    if (count % size === 0) {
      count = 0
      result.push(subresult)
      subresult = []
    }
  }

  return result
}

function doesBoardHaveWinner(board: number[][]): boolean {
  // check rows
  for (const row of board) {
    let isAllNegative = true
    for (let i = 0; i < 5; i++) {
      if (row[i] !== -1) {
        isAllNegative = false
        break
      }
    }

    if (isAllNegative) {
      return true
    }
  }

  for (let i = 0; i < board[0].length; i++) {
    let isAllNegative = true
    for (let j = 0; j < board.length; j++) {
      if (board[j][i] !== -1) {
        isAllNegative = false
        break
      }
    }

    if (isAllNegative) {
      return true
    }
  }

  return false
}

function markBoard(board: number[][], bingoNumber: number): boolean {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === bingoNumber) {
        board[i][j] = -1
      }
    }
  }

  return doesBoardHaveWinner(board)
}

function sumUpNonNegativeElements(board: number[][]): number {
  let sum = 0

  for (const row of board) {
    for (const col of row) {
      if (col > 0) {
        sum += col
      }
    }
  }

  return sum
}

const { bingoNumbers, bingoBoardRows } = await parseFile()
const bingoBoards = convertBingoBoardRowsIntoMatrices(bingoBoardRows, 5)

// Part 1
for (const number of bingoNumbers) {
  let foundWinner = false
  for (const board of bingoBoards) {
    const doesBoardHaveWinner = markBoard(board, number)
    if (doesBoardHaveWinner) {
      foundWinner = true
      const sum = sumUpNonNegativeElements(board)
      console.log(sum * number)
      break
    }
  }

  if (foundWinner) {
    break
  }
}

// Part 2
const winners = new Set<number>()

for (const number of bingoNumbers) {
  let skippedAll = true
  for (let i = 0; i < bingoBoards.length; i++) {
    if (winners.has(i)) {
      continue
    }

    skippedAll = false

    const doesBoardHaveWinner = markBoard(bingoBoards[i], number)
    if (doesBoardHaveWinner) {
      winners.add(i)
    }

    if (doesBoardHaveWinner && winners.size === bingoBoards.length) {
      const sum = sumUpNonNegativeElements(bingoBoards[i])
      console.log (sum * number)
    }
  }

  if (skippedAll) {
    break
  }
}
