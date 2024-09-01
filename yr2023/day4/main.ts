async function readData() {
  const filepath = `${import.meta.dir}/data.in`;
  const file = Bun.file(filepath);

  const text = await file.text();
  return text.split("\n").filter(Boolean);
}

const data = await readData();

const getPointValue = (n: number) => Math.pow(2, n - 1);

type Card = {
  id: number;
  winning: number[];
  own: number[];
};

function getCardData(line: string): Card {
  const [id, numbers] = line.split(":");
  const [winning, own] = numbers.trim().split(" | ");

  return {
    id: parseInt(id.split(/\s+/)[1]),
    winning: winning.split(/\s+/).map((ch) => parseInt(ch)),
    own: own.split(/\s+/).map((ch) => parseInt(ch)),
  };
}

function getNumMatches(card: Card): number {
  const winningSet = new Set(card.winning);
  const ownSet = new Set(card.own);

  let matches = 0;

  for (const num of ownSet) {
    if (winningSet.has(num)) {
      matches += 1;
    }
  }

  return matches;
}

function getPointValueFromCard(card: Card): number {
  const matches = getNumMatches(card);
  return matches > 0 ? getPointValue(matches) : 0;
}

function solvePart1(data: string[]) {
  const result = data
    .map((line) => getPointValueFromCard(getCardData(line)))
    .reduce((acc, point) => acc + point, 0);

  console.log(`Year 2023 - Day 4 - Part 1: ${result}`);
}

function solvePart2(data: string[]) {
  const cards = data.map((line) => getCardData(line));
  const counter = new Map<number, number>();

  for (const card of cards) {
    counter.set(card.id, (counter.get(card.id) ?? 0) + 1);

    const matches = getNumMatches(card);
    const count = counter.get(card.id)!;
    for (let i = 1; i <= matches && card.id + i < cards.length + 1; i += 1) {
      counter.set(card.id + i, (counter.get(card.id + i) ?? 0) + count);
    }
  }

  const result = [...counter.values()].reduce((acc, value) => acc + value, 0);

  console.log(`Year 2023 - Day 4 - Part 2: ${result}`);
}

solvePart1(data);
solvePart2(data);
