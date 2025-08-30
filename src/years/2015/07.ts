import { Result, err, ok } from 'neverthrow';
import { readFileToString } from '../../lib/file-io';
import { splitByNewline } from '../../lib/strings';
import { logError } from '../../lib/log';

const FILEPATH = './data/years/2015/07.txt';

type SingleOperand = {
  operation: 'NOT' | null;
  input: string;
  output: string;
};

type DualOperand = {
  operation: 'AND' | 'OR' | 'LSHIFT' | 'RSHIFT';
  lhs: string;
  rhs: string;
  output: string;
};

type GateOperation = SingleOperand | DualOperand;

type State = Map<string, number>;

const NOT_OPERAND_REGEX = /NOT (?<input>\w+) -> (?<output>\w+)/;
const DUAL_OPERAND_REGEX =
  /(?<lhs>\w+) (?<operation>AND|OR|RSHIFT|LSHIFT) (?<rhs>\w+) -> (?<output>\w+)/;
const ASSIGNMENT_REGEX = /(?<input>\w+) -> (?<output>\w+)/;

function isValidDualOperandOperation(
  operation: string
): operation is DualOperand['operation'] {
  return (
    operation === 'AND' ||
    operation === 'OR' ||
    operation === 'LSHIFT' ||
    operation === 'RSHIFT'
  );
}

function parseGateOperation(line: string): Result<GateOperation, unknown> {
  const dualOperandMatch = line.match(DUAL_OPERAND_REGEX);
  if (dualOperandMatch) {
    const groups = dualOperandMatch.groups;
    if (!groups) {
      return err('There are no groups for the dual operand regex match');
    }
    const { operation, lhs, rhs, output } = groups;

    if (!isValidDualOperandOperation(operation)) {
      return err(
        `The operation ${operation} is not a valid dual operand operation`
      );
    }

    return ok({
      operation,
      lhs,
      rhs,
      output,
    });
  }

  const notOperandMatch = line.match(NOT_OPERAND_REGEX);
  if (notOperandMatch) {
    const groups = notOperandMatch.groups;
    if (!groups) {
      return err('There are no groups for the not operand regex match');
    }

    const { input, output } = groups;

    return ok({ operation: 'NOT', input, output });
  }

  const assignmentMatch = line.match(ASSIGNMENT_REGEX);
  if (assignmentMatch) {
    const groups = assignmentMatch.groups;
    if (!groups) {
      return err('There are no groups for the assignment regex match');
    }

    const { input, output } = groups;

    return ok({ operation: null, input, output });
  }

  return err(`Could not properly match ${line}`);
}

function getValueFromState(
  state: State,
  source: string
): Result<number, unknown> {
  const asNumber = Number.parseInt(source);

  // check if the value is a number first
  // if the value is not a number, then try to grab from state
  if (Number.isNaN(asNumber)) {
    const existingValue = state.get(source);
    if (existingValue == null) {
      return err(`${source} does not exist within state`);
    }

    return ok(existingValue);
  }

  return ok(asNumber);
}

function getDualOperandFn(operation: DualOperand['operation']) {
  return (lhs: number, rhs: number) => {
    switch (operation) {
      case 'AND':
        return lhs & rhs;
      case 'LSHIFT':
        return lhs << rhs;
      case 'RSHIFT':
        return lhs >>> rhs;
      default:
        return lhs | rhs;
    }
  };
}

function getSingleOperandFn(operation: SingleOperand['operation']) {
  return (value: number) => (!operation ? value : ~value);
}

function evaluate(state: State, gateOperation: GateOperation) {
  switch (gateOperation.operation) {
    case 'LSHIFT':
    case 'RSHIFT':
    case 'OR':
    case 'AND': {
      const lhs = getValueFromState(state, gateOperation.lhs);
      const rhs = getValueFromState(state, gateOperation.rhs);
      const operationFn = getDualOperandFn(gateOperation.operation);
      Result.combine([lhs, rhs]).map(([lhs, rhs]) =>
        state.set(gateOperation.output, operationFn(lhs, rhs))
      );
      break;
    }
    default: {
      const value = getValueFromState(state, gateOperation.input);
      const operationFn = getSingleOperandFn(gateOperation.operation);
      value.map((v) => state.set(gateOperation.output, operationFn(v)));
      break;
    }
  }
}

function solvePart1(operations: GateOperation[]) {
  const state = new Map<string, number>();
  while (state.get('a') == null) {
    for (const operation of operations) {
      evaluate(state, operation);
    }
  }

  const result = state.get('a');
  if (!result) {
    return err('We could not find the proper value of a');
  }

  return ok(result);
}

function solvePart2(operations: GateOperation[]) {
  const state = new Map<string, number>();
  state.set('b', 3176);

  while (state.get('a') == null) {
    for (const operation of operations) {
      if (operation.output === 'b') {
        continue;
      }
      evaluate(state, operation);
    }
  }

  const result = state.get('a');
  if (!result) {
    return err('We could not find the proper value of a');
  }

  return ok(result);
}

async function solve(
  solveFn: (operations: GateOperation[]) => Result<number, unknown>,
  logAnswer: (result: number) => void
) {
  await readFileToString(FILEPATH)
    .andThen(splitByNewline)
    .andThen((lines: string[]) => Result.combine(lines.map(parseGateOperation)))
    .andThen(solveFn)
    .match(logAnswer, logError);
}

await solve(solvePart1, (result: number) => {
  console.log(`Advent of Code 2015 - Day 07 - Part 1: ${result}`);
});

await solve(solvePart2, (result: number) => {
  console.log(`Advent of Code 2015 - Day 07 - Part 2: ${result}`);
});
