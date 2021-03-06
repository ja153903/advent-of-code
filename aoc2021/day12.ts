import { readLines } from './deps.ts'

class GraphNode {
  isBig: boolean
  value: string
  children: GraphNode[]

  constructor(value: string) {
    this.value = value
    this.isBig = isUpperCase(value)
    this.children = []
  }

  addChild(child: GraphNode) {
    this.children.push(child)
  }

  print() {
    let children = ``
    for (const child of this.children) {
      children += `${child.value} `
    }

    console.log(`${this.value}: ${children}`)
  }
}

function isUpperCase(word: string): boolean {
  if (word.length === 0) {
    return false
  }

  const ascii = word.charCodeAt(0)

  return ascii >= 65 && ascii <= 90
}

async function parseFile(): Promise<Map<string, GraphNode>> {
  const map = new Map<string, GraphNode>()

  const file = await Deno.open('aoc2021/day12-data.txt')

  for await (const line of readLines(file)) {
    const [start, end] = line.split('-')

    const startNode = map.get(start) ?? new GraphNode(start)
    const endNode = map.get(end) ?? new GraphNode(end)

    startNode.addChild(endNode)
    endNode.addChild(startNode)

    if (!map.has(start)) {
      map.set(start, startNode)
    }

    if (!map.has(end)) {
      map.set(end, endNode)
    }
  }

  return map
}

const graph = await parseFile()

// Part 1

// starting from the start node
// we want to start doing a dfs over its children
// keep track of visited edges
function dfs(): number {
  let count = 0
  const start = graph.get('start')

  if (start) {
    for (const child of start.children) {
      const currentPath = `start-${child.value}`
      count += dfsHelper(child, new Set<string>([currentPath]), currentPath)
    }
  }

  return count
}

function dfsHelper(
  node: GraphNode,
  visitedEdges: Set<string>,
  currentPath: string
): number {
  if (!node || !node.children) {
    return 0
  }

  if (node.value === 'end') {
    // console.log(currentPath)
    return 1
  }

  let count = 0

  for (const child of node.children) {
    if (child.value === 'start') {
      continue
    }

    const edge = `${node.value}-${child.value}`
    // we want to make sure that the child value
    // is not an existing lowercase edge that we've visited
    const inSmallCaveInPath =
      currentPath.split('-').includes(child.value) && !isUpperCase(child.value)
    if (inSmallCaveInPath) {
      continue
    }

    count += dfsHelper(
      child,
      new Set<string>([...visitedEdges, edge]),
      `${currentPath}-${child.value}`
    )
  }

  return count
}

function dfsPt2(): number {
  const start = graph.get('start')

  const smallCaves = [...graph.values()].filter(
    (node) => !node.isBig && !['start', 'end'].includes(node.value)
  )

  let paths = new Set<string>()

  if (start) {
    for (const cave of smallCaves) {
      for (const child of start.children) {
        const currentPath = `start-${child.value}`
        dfsHelperPt2(
          child,
          new Set<string>([currentPath]),
          currentPath,
          cave.value,
          paths
        )
      }
    }
  }

  return paths.size
}

function dfsHelperPt2(
  node: GraphNode,
  visitedEdges: Set<string>,
  currentPath: string,
  allowedSecondVisit: string,
  builtPaths: Set<string>
): number {
  if (!node || !node.children) {
    return 0
  }

  if (node.value === 'end') {
    builtPaths.add(currentPath)
    return 1
  }

  let count = 0

  for (const child of node.children) {
    if (child.value === 'start') {
      continue
    }

    // we want to make sure that the child value
    // is not an existing lowercase edge that we've visited
    const childFrequency = currentPath
      .split('-')
      .reduce(
        (acc: number, comp: string) => acc + (comp === child.value ? 1 : 0),
        0
      )
    if (!isUpperCase(child.value)) {
      if (allowedSecondVisit !== child.value && childFrequency > 0) {
        continue
      }

      if (allowedSecondVisit === child.value && childFrequency > 1) {
        continue
      }
    }

    const edge = `${node.value}-${child.value}`

    count += dfsHelperPt2(
      child,
      new Set<string>([...visitedEdges, edge]),
      `${currentPath}-${child.value}`,
      allowedSecondVisit,
      builtPaths
    )
  }

  return count
}

for (const value of graph.values()) {
  value.print()
}

console.log(dfs())
console.log(dfsPt2())
