const getProblemInput = () => '1113222113';

function lookAndSay(line: string) {
  let current = line[0];
  let count = 1;
  let result = '';

  for (let i = 1; i < line.length; i++) {
    if (current === line[i]) {
      count++;
    } else {
      result += `${count}${current}`;
      current = line[i];
      count = 1;
    }
  }

  result += `${count}${current}`;

  return result;
}

function solve(n: number) {
  let res = getProblemInput();

  for (let i = 0; i < n; i++) {
    res = lookAndSay(res);
  }

  return res.length;
}

console.log(`Advent of Code 2015 - Day 10 - Part 1: ${solve(40)}`);
console.log(`Advent of Code 2015 - Day 10 - Part 2: ${solve(50)}`);
