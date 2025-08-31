import { Result, err, ok } from 'neverthrow';
import { readFileToString } from '../../lib/file-io';
import { splitByNewline } from '../../lib/strings';
import { logError } from '../../lib/log';

const FILEPATH = './data/years/2015/09.txt';

type Edge = {
  u: string;
  v: string;
  weight: number;
};

const EDGE_REGEX = /(?<u>\w+) to (?<v>\w+) = (?<weight>\d+)/;

function parseEdge(line: string): Result<Edge, unknown> {
  const match = line.match(EDGE_REGEX);
  if (!match) {
    return err(`Could not find the appropriate match group for ${line}`);
  }

  const groups = match.groups;
  if (!groups) {
    return err(`Could not find the appropriate groups for ${line}`);
  }

  const { u, v, weight } = groups;

  return ok({ u, v, weight: Number.parseInt(weight) });
}

function parseAllEdges(lines: string[]): Result<Edge[], unknown> {
  return Result.combine(lines.map(parseEdge));
}

type Graph = Map<string, [string, number][]>;

function buildGraph(edges: Edge[]): Graph {
  const graph = new Map<string, [string, number][]>();

  for (const { u, v, weight } of edges) {
    if (!graph.has(u)) {
      graph.set(u, []);
    }
    if (!graph.has(v)) {
      graph.set(v, []);
    }

    graph.get(u)?.push([v, weight]);
    graph.get(v)?.push([u, weight]);
  }

  return graph;
}

function getShortestPath(graph: Graph, node: string): Result<number, unknown> {
  let result = Number.POSITIVE_INFINITY;
  const numNodes = graph.size;
  const queue: [string, number, Set<string>][] = [[node, 0, new Set([node])]];

  while (queue.length) {
    const front = queue.shift();
    if (!front) {
      return err('Something went wrong with shortest path algorithm');
    }

    const [currentNode, totalWeight, visited] = front;

    if (visited.size === numNodes) {
      result = Math.min(result, totalWeight);
      continue;
    }

    const children = graph.get(currentNode);
    if (!children) {
      continue;
    }

    for (const [child, weight] of children) {
      if (visited.has(child)) {
        continue;
      }

      visited.add(child);
      queue.push([child, totalWeight + weight, new Set(visited)]);

      // remove it for the rest of the children we're iterating over
      visited.delete(child);
    }
  }

  return ok(result);
}

function solvePart1(edges: Edge[]): Result<number, unknown> {
  const graph = buildGraph(edges);

  let result = Number.POSITIVE_INFINITY;

  for (const node of graph.keys()) {
    // from some node, figure out the shortest path to visit all nodes
    getShortestPath(graph, node).map((shortestPath: number) => {
      result = Math.min(result, shortestPath);
    });
  }

  if (result === Number.POSITIVE_INFINITY) {
    return err('Could not find the appropriate solution');
  }

  return ok(result);
}

function getLongestPath(graph: Graph, node: string): Result<number, unknown> {
  let result = Number.NEGATIVE_INFINITY;
  const numNodes = graph.size;
  const queue: [string, number, Set<string>][] = [[node, 0, new Set([node])]];

  while (queue.length) {
    const front = queue.shift();
    if (!front) {
      return err('Something went wrong with longest path algorithm');
    }

    const [currentNode, totalWeight, visited] = front;

    if (visited.size === numNodes) {
      result = Math.max(result, totalWeight);
      continue;
    }

    const children = graph.get(currentNode);
    if (!children) {
      continue;
    }

    for (const [child, weight] of children) {
      if (visited.has(child)) {
        continue;
      }

      visited.add(child);
      queue.push([child, totalWeight + weight, new Set(visited)]);

      // remove it for the rest of the children we're iterating over
      visited.delete(child);
    }
  }

  return ok(result);
}

function solvePart2(edges: Edge[]): Result<number, unknown> {
  const graph = buildGraph(edges);

  let result = Number.NEGATIVE_INFINITY;

  for (const node of graph.keys()) {
    // from some node, figure out the shortest path to visit all nodes
    getLongestPath(graph, node).map((longestPath: number) => {
      result = Math.max(result, longestPath);
    });
  }

  if (result === Number.NEGATIVE_INFINITY) {
    return err('Could not find the appropriate solution');
  }

  return ok(result);
}

async function solve(
  solveFn: (edges: Edge[]) => Result<number, unknown>,
  logAnswer: (result: number) => void
) {
  await readFileToString(FILEPATH)
    .andThen(splitByNewline)
    .andThen(parseAllEdges)
    .andThen(solveFn)
    .match(logAnswer, logError);
}

await solve(solvePart1, (result: number) => {
  console.log(`Advent of Code 2015 - Day 09 - Part 1: ${result}`);
});

await solve(solvePart2, (result: number) => {
  console.log(`Advent of Code 2015 - Day 09 - Part 2: ${result}`);
});
