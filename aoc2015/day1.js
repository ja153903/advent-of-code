import { readLines } from '../aoc2021/deps.ts'

async function parseFile() {
  let result = ''
  const file = await Deno.open('aoc2015/data/day1-data.txt')

  for await (const line of readLines(file)) {
    result += line
  }

  return result
}

const lisp = await parseFile()

const part1 = lisp
  .split('')
  .reduce((acc, current) => acc + (current === '(' ? 1 : -1), 0)

console.log(part1)

// part 2

let pos = 0

for (let i = 0; i < lisp.length; i++) {
  if (lisp[i] === '(') {
    pos++
  } else {
    pos--
  }

  if (pos === -1) {
    console.log(i + 1)
    break
  }
}
