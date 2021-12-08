import { readLines } from './deps.ts'

async function parseFile(): Promise<number[]> {
  let result: number[] = []

  const file = await Deno.open('aoc2021/day7-data.txt')

  for await (const line of readLines(file)) {
    result = line.split(',').map(ch => parseInt(ch) ?? -1)
  }

  return result
}

const crabs: number[] = await parseFile()

const maxPos = Math.max(...crabs)
const minPos = Math.min(...crabs)

// Part 1
let minFuel = Number.MAX_VALUE
for (let i = minPos; i <= maxPos; i++) {
  const curFuel = crabs
      .map(crab => Math.abs(i - crab))
      .reduce((acc, num) => acc + num)

  minFuel = Math.min(minFuel, curFuel)
}

console.log(minFuel)

// Part 2
function getSumUpToN(n: number): number {
  return n * (n + 1) / 2
}

minFuel = Number.MAX_VALUE
for (let i = minPos; i <= maxPos; i++) {
  const curFuel = crabs
      .map(crab => {
        const diff = Math.abs(i - crab)
        return getSumUpToN(diff)
      })
      .reduce((acc, num) => acc + num)

  minFuel = Math.min(minFuel, curFuel)
}

console.log(minFuel)
