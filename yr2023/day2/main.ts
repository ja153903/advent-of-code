async function readData() {
  const filepath = `${import.meta.dir}/data.in`;
  const file = Bun.file(filepath);

  const text = await file.text();
  return text.split("\n").filter((line) => line.length > 0);
}

const data = await readData();

type Cube = {
  blue?: number;
  green?: number;
  red?: number;
};
type Game = {
  id: number;
  set: Cube[];
};

function createGame(line: string): Game {
  const [gameId, set] = line.split(":");
  const [_, id] = gameId.split(" ");

  const gameset = set.split(";").map((cube) => {
    const colors = cube
      .trim()
      .split(",")
      .map((color) => color.trim())
      .map((color) => {
        const [value, key] = color.split(" ");
        return { [key]: Number.parseInt(value) };
      })
      .reduce((acc, cur) => {
        return { ...acc, ...cur };
      }, {});
    return colors;
  });

  return {
    id: Number.parseInt(id),
    set: gameset,
  };
}

const RED_CUBE_LIMIT = 12;
const GREEN_CUBE_LIMIT = 13;
const BLUE_CUBE_LIMIT = 14;

function solvePart1(data: string[]) {
  const games = data.map((line) => createGame(line));
  const idSum = games
    .filter((game) => {
      const impossibleGame = game.set.find((set) => {
        return (
          (set?.red ?? 0) > RED_CUBE_LIMIT ||
          (set?.green ?? 0) > GREEN_CUBE_LIMIT ||
          (set?.blue ?? 0) > BLUE_CUBE_LIMIT
        );
      });

      return impossibleGame === undefined;
    })
    .reduce((acc, game) => acc + game.id, 0);

  console.log(`Year 2023 - Day 2 - Part 1: ${idSum}`);
}

function solvePart2(data: string[]) {
  const games = data.map((line) => createGame(line));
  const powerSet = games
    .map((game) => {
      const colors = { red: 0, blue: 0, green: 0 };
      for (const { red = 0, blue = 0, green = 0 } of game.set) {
        colors.red = Math.max(colors.red, red);
        colors.blue = Math.max(colors.blue, blue);
        colors.green = Math.max(colors.green, green);
      }

      return colors.red * colors.blue * colors.green;
    })
    .reduce((acc, cur) => acc + cur);

  console.log(`Year 2023 - Day 2 - Part 2: ${powerSet}`);
}

solvePart1(data);
solvePart2(data);
