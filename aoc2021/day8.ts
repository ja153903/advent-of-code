import { readLines } from './deps.ts'

const definiteValuesMap = new Map<number, number>()
definiteValuesMap.set(2, 1)
definiteValuesMap.set(3, 7)
definiteValuesMap.set(4, 4)
definiteValuesMap.set(7, 8)

interface Signal {
  patterns: string[]
  codes: string[]
}

async function parseFile(): Promise<Signal[]> {
  let results: Signal[] = []

  const file = await Deno.open('aoc2021/day8-data.txt')

  for await (const line of readLines(file)) {
    let [patterns, codes] = line.split(' | ')
    results.push({
      patterns: patterns.trim().split(' '),
      codes: codes.trim().split(' '),
    })
  }

  return results
}

const signals = await parseFile()

// Part 1
const answer = signals.reduce(
  (acc, { codes }) =>
    codes.reduce((acc, code): number => {
      const value: number = definiteValuesMap.get(code.length) ?? -1
      return value !== -1 ? 1 + acc : acc
    }, 0) + acc,
  0
)

console.log(answer)

// Part 2
let result = 0

function intersection(a: string, b: string): string {
  const setA = new Set([...a])
  const setB = new Set([...b])

  return [...setA].filter((ch) => setB.has(ch)).join('')
}

function findIntersectionOfWords(words: string[]): string {
  return words.reduce((acc, word) => intersection(acc, word))
}

function getUniqueCharacter(words: string[]): string[] {
  const counter = new Map<string, number>()

  for (const word of words) {
    for (const ch of word) {
      const currentCount = counter.get(ch) ?? 0
      counter.set(ch, currentCount + 1)
    }
  }

  return [...counter.entries()]
    .filter(([_key, value]) => value === 1)
    .map(([key, _value]) => key)
}

for (const { patterns, codes } of signals) {
  const definiteValues = patterns.filter((pattern) =>
    [2, 3, 4, 7].includes(pattern.length)
  )
  const [commonA, commonB] = findIntersectionOfWords(definiteValues)
  const [uniqueA, uniqueB] = getUniqueCharacter(definiteValues)

  let subresult = 0

  for (const code of codes) {
    const value: number = definiteValuesMap.get(code.length) ?? -1

    subresult *= 10

    if (value !== -1) {
      subresult += value
    } else {
      if (code.length === 5) {
        if (code.includes(commonA) && code.includes(commonB)) {
          subresult += 3
        } else {
          if (code.includes(uniqueA) && code.includes(uniqueB)) {
            subresult += 2
          } else {
            subresult += 5
          }
        }
      } else if (code.length === 6) {
        if (code.includes(commonA) && code.includes(commonB)) {
          if (!code.includes(uniqueA) || !code.includes(uniqueB)) {
            subresult += 9
          }
        } else {
          subresult += 6
        }
      }
    }
  }

  result += subresult
}

console.log(result)
