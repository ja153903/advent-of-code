const getInput = () => 'hepxcrrq';

function convertPasswordToAsciiArray(password: string): number[] {
  const result: number[] = [];

  for (let i = password.length - 1; i >= 0; i--) {
    result.push(password[i].charCodeAt(0) - 97);
  }

  return result;
}

function convertAsciiArrayToPassword(ascii: number[]): string {
  let result: string[] = [];

  // first value is the actually the last in our array
  for (let i = ascii.length - 1; i >= 0; i--) {
    result.push(String.fromCharCode(ascii[i] + 97));
  }

  return result.join('');
}

function incrementPassword(password: string) {
  const ascii = convertPasswordToAsciiArray(password);

  let carry = 0;

  // increment the first value and then keep track if a carry is necessary
  ascii[0]++;
  if (ascii[0] === 26) {
    ascii[0] %= 26;
    carry = 1;
  }

  for (let i = 1; i < password.length && carry === 1; i++) {
    ascii[i]++;
    if (ascii[i] !== 26) {
      carry = 0;
    } else {
      ascii[i] %= 26;
    }
  }

  return convertAsciiArrayToPassword(ascii);
}

const FORBIDDEN_LETTERS: readonly string[] = ['i', 'o', 'l'];

function hasForbiddenLetters(password: string) {
  for (const char of password) {
    if (FORBIDDEN_LETTERS.includes(char)) {
      return true;
    }
  }

  return false;
}

function getNumberOfOverlappingPairs(password: string) {
  const pairs = new Set<string>();

  for (let i = 1; i < password.length; i++) {
    if (password[i] === password[i - 1]) {
      pairs.add(password[i]);
    }
  }

  return pairs.size;
}

function hasIncreasingStraight(password: string) {
  for (let i = 2; i < password.length; i++) {
    if (
      password[i - 2].charCodeAt(0) + 1 === password[i - 1].charCodeAt(0) &&
      password[i - 1].charCodeAt(0) + 1 === password[i].charCodeAt(0)
    ) {
      return true;
    }
  }
  return false;
}

function isValidPasswordForPart1(password: string) {
  return (
    !hasForbiddenLetters(password) &&
    getNumberOfOverlappingPairs(password) >= 2 &&
    hasIncreasingStraight(password)
  );
}

function _solve(initialPassword = getInput()) {
  let password = initialPassword;

  while (true) {
    password = incrementPassword(password);
    if (isValidPasswordForPart1(password)) {
      return password;
    }
  }
}

function solve(solveFn: () => string, logAnswer: (result: string) => void) {
  logAnswer(solveFn());
}

solve(_solve, (result: string) => {
  console.log(`Advent of Code 2015 - Day 11 - Part 1: ${result}`);
});
solve(
  () => _solve(_solve()),
  (result: string) => {
    console.log(`Advent of Code 2015 - Day 11 - Part 2: ${result}`);
  }
);
