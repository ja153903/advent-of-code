import { readLines } from './deps.ts'

function hexToBinary(n: string): string {
  return parseInt(n, 16).toString(2)
}

async function parseFile(): Promise<string> {
  let result = ''

  const file = await Deno.open('aoc2021/day16-data.txt')

  for await (const line of readLines(file)) {
    result += line
  }

  return result
}

const packet: string = await parseFile()

// The first 3 bits once we've transformed this into binary represent the packet version
// The next 3 bits represent type ID
// if type ID is 4, then we have literal value, these values encode a single binary number
// this is done by padding with leading zeros until the length is a multiple of 4 bits and then
// its broken into groups of 4 bits; each group is prefixed by a 1 except for the last group
