import { readLines } from './deps.ts'

async function parseFile(): Promise<number[]> {
  let result: number[] = []

  const file = await Deno.open('aoc2021/day7-data.txt')

  for await (const line of readLines(file)) {
    result = line.split(',').map(ch => parseInt(ch) ?? -1)
    break
  }

  return result
}

const crabs: number[] = await parseFile()

// Part 1

// Part 2
