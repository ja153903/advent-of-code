async function readData() {
  const filepath = `${import.meta.dir}/data.in`;
  const file = Bun.file(filepath);

  const text = await file.text();
  return text
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.split(""));
}

const data = await readData();

// find all symbols
// then for each symbol, we should look around it
// make sure that we do this in a breadth first search
// manner and then change the number to dots so we don't
// double up the numbers
// this probably means that we want to work with a clone
// of the data rather than the original data that we read in
// because we're mutating everything
function solvePart1(data: string[][]) {}

function solvePart2(data: string[][]) {}

solvePart1(data);
solvePart2(data);
