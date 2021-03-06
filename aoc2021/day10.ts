import { readLines } from './deps.ts'

async function parseFile(): Promise<string[]> {
  const result: string[] = []

  const file = await Deno.open('aoc2021/day10-data.txt')

  for await (const line of readLines(file)) {
    result.push(line)
  }

  return result
}

function getIllegalCharacter(line: string): string | null {
  const stack: string[] = []

  for (const ch of line.split('')) {
    if (ch === '(') {
      stack.push(')')
    } else if (ch === '{') {
      stack.push('}')
    } else if (ch === '[') {
      stack.push(']')
    } else if (ch === '<') {
      stack.push('>')
    } else if (stack.length === 0 || stack.pop() !== ch) {
      return ch
    }
  }

  return null
}

const lines = await parseFile()

const scores = new Map<string, number>()
scores.set(')', 3)
scores.set(']', 57)
scores.set('}', 1197)
scores.set('>', 25137)

const illegals = new Map<string, number>()

lines.forEach((line) => {
  const illegalChar = getIllegalCharacter(line)
  if (illegalChar) {
    const count = illegals.get(illegalChar) ?? 0
    illegals.set(illegalChar, count + 1)
  }
})

const part1 = [...illegals.entries()].reduce(
  (acc: number, [key, value]: [string, number]) =>
    acc + (scores.get(key) ?? 0) * value,
  0
)

console.log(part1)

// Part 2

function getClosingCharacters(line: string): string[] | null {
  const stack: string[] = []

  for (const ch of line.split('')) {
    if (ch === '(') {
      stack.push(')')
    } else if (ch === '{') {
      stack.push('}')
    } else if (ch === '[') {
      stack.push(']')
    } else if (ch === '<') {
      stack.push('>')
    } else if (stack.length === 0 || stack.pop() !== ch) {
      return null
    }
  }

  return stack
}

const close = new Map<string, number>()
close.set(')', 1)
close.set(']', 2)
close.set('}', 3)
close.set('>', 4)

const incomplete = lines
  .map((line: string) => {
    const closingChars = getClosingCharacters(line)
    if (closingChars !== null) {
      let score = 0

      for (const ch of closingChars.reverse()) {
        score *= 5
        score += close.get(ch) ?? 0
      }

      return score
    }

    return 0
  })
  .filter((score) => score > 0)
  .sort((a, b) => a - b)

console.log(incomplete[Math.floor(incomplete.length / 2)])
