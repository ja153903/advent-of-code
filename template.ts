async function readData() {
  const filepath = `${import.meta.dir}/data.in`;
  const file = Bun.file(filepath);

  const text = await file.text();
  return text.split("\n").filter((line) => line.length > 0);
}

const data = await readData();

function solvePart1(data: string[]) {}

function solvePart2(data: string[]) {}

solvePart1(data);
solvePart2(data);
