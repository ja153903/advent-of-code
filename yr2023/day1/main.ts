async function readData() {
  const filepath = `${import.meta.dir}/data.in`;
  const file = Bun.file(filepath);

  const text = await file.text();
  return text.split("\n").filter((line) => line.length > 0);
}

const data = await readData();

/**
 * `getCalibrationValues` takes the first and last digit
 * that appears in the line
 */
function getCalibrationValues(line: string): number {
  const numbers = line.split("").filter((ch) => ch >= "0" && ch <= "9");
  const head = numbers[0];
  const tail = numbers[numbers.length - 1];

  return Number.parseInt(`${head}${tail}`);
}

function solvePart1(data: string[]) {
  const calibrationValues = data.map((line) => getCalibrationValues(line));
  const part1 = calibrationValues.reduce((a, b) => a + b);

  console.log(`Year 2023 - Day 1 - Part 1: ${part1}`);
}

function getUpdatedCalibrationValues(line: string) {
  // we use a lookahead group to capture overlaps with regex
  const matches = line.matchAll(
    /(?=(one|two|three|four|five|six|seven|eight|nine|[0-9]))/g,
  );

  if (matches === null) {
    throw new Error("Could not parse line for calibration values");
  }

  const matchesAsArray = Array.from(matches, (match) => match[1]);

  const head = parsePotentialValue(matchesAsArray[0]);
  const tail = parsePotentialValue(matchesAsArray[matchesAsArray.length - 1]);

  return head * 10 + tail;
}

function parsePotentialValue(value: string): number {
  switch (value) {
    case "one":
      return 1;
    case "two":
      return 2;
    case "three":
      return 3;
    case "four":
      return 4;
    case "five":
      return 5;
    case "six":
      return 6;
    case "seven":
      return 7;
    case "eight":
      return 8;
    case "nine":
      return 9;
    default:
      return Number.parseInt(value);
  }
}

function solvePart2(data: string[]) {
  const calibrationValues = data.map((line) =>
    getUpdatedCalibrationValues(line),
  );
  const part2 = calibrationValues.reduce((a, b) => a + b);

  console.log(`Year 2023 - Day 1 - Part 2: ${part2}`);
}

solvePart1(data);
solvePart2(data);
