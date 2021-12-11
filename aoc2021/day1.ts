import { readLines } from "https://deno.land/std/io/buffer.ts"

async function parseFileToArray(): Promise<number[]> {
  const result: number[] = []

  const file = await Deno.open("aoc2021/day1-data.txt")

  for await (const line of readLines(file)) {
    const num = parseInt(line)
    result.push(num)
  }

  return result
}

function getNumIncreased(numbers: number[]): number {
  let numIncreased = 0

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > numbers[i - 1]) {
      numIncreased++
    }
  }

  return numIncreased
}

const numbers = await parseFileToArray()

// Part 1
let numIncreased = getNumIncreased(numbers)

console.log(numIncreased)

// Part 2
const slidingWindowSums: number[] = []
let runningSum = 0

for (let i = 0; i <= numbers.length; i++) {
  if (i === numbers.length) {
    slidingWindowSums.push(runningSum)
    break
  } else if (i > 2) {
    slidingWindowSums.push(runningSum)
    runningSum -= numbers[i - 3]
  }

  runningSum += numbers[i]
}

numIncreased = getNumIncreased(slidingWindowSums)

console.log(numIncreased)
