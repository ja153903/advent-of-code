import { readLines } from './deps.ts'

async function parseFile(): Promise<{
  template: string
  mapping: Map<string, string>
}> {
  const map = new Map<string, string>()
  let template = ''

  const file = await Deno.open('aoc2021/day14-data.txt')

  for await (const line of readLines(file)) {
    if (line.includes('->')) {
      const [pattern, middle] = line.split(' -> ')
      map.set(pattern, middle)
    } else if (line.length > 0) {
      template = line
    }
  }

  return { template, mapping: map }
}

function fetchMaxMinCount(frequency: Map<string, number>): {
  maxCount: number
  minCount: number
} {
  let minCount = Number.MAX_SAFE_INTEGER

  let maxCount = Number.MIN_SAFE_INTEGER

  for (const [, count] of frequency) {
    maxCount = Math.max(count, maxCount)
    minCount = Math.min(count, minCount)
  }

  return { maxCount, minCount }
}

function getSingleCharFrequency(
  frequencies: Map<string, number>
): Map<string, number> {
  const map = new Map<string, number>()

  let index = 0

  for (const [key, value] of frequencies) {
    const [first, second] = key.split('')
    const currentCount = map.get(second) ?? 0

    map.set(second, currentCount + value)

    if (index === 0) {
      map.set(first, 1)
      index++
    }
  }

  return map
}

async function evaluatePolymer(rounds: number) {
  const { template, mapping } = await parseFile()

  let frequencies = new Map<string, number>()
  for (let i = 0; i < template.length - 1; i++) {
    const substr = template.substring(i, i + 2)
    const currentCount = frequencies.get(substr) ?? 0
    frequencies.set(substr, currentCount + 1)
  }

  for (let i = 0; i < rounds; i++) {
    const tempFrequencies = new Map<string, number>()

    for (const [key, value] of frequencies) {
      const middle = mapping.get(key) ?? ''
      const first = `${key[0]}${middle}`
      const firstCount = tempFrequencies.get(first) ?? 0
      tempFrequencies.set(first, firstCount + value)

      const second = `${middle}${key[1]}`
      const secondCount = tempFrequencies.get(second) ?? 0
      tempFrequencies.set(second, secondCount + value)
    }

    frequencies = tempFrequencies
  }

  const singleCharFrequency = getSingleCharFrequency(frequencies)
  const { maxCount, minCount } = fetchMaxMinCount(singleCharFrequency)
  console.log(maxCount - minCount)
}

await evaluatePolymer(10)
await evaluatePolymer(40)
