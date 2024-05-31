#![allow(unused_variables, dead_code)]

use regex::Regex;
use std::collections::HashMap;
use utils::fs::{get_file_content, split_by_line, GetFileContentOptions};

#[derive(Debug, Clone)]
pub enum Operation {
    And,
    Not,
    Or,
    LShift,
    RShift,
    Assign,
}

impl Operation {
    pub fn from_str(s: &str) -> Operation {
        match s {
            "AND" => Operation::And,
            "OR" => Operation::Or,
            "NOT" => Operation::Not,
            "LSHIFT" => Operation::LShift,
            "RSHIFT" => Operation::RShift,
            _ => Operation::Assign,
        }
    }
}

#[derive(Debug, Clone)]
pub struct Negation {
    pub signal: String,
}

#[derive(Debug, Clone)]
pub struct Assignment {
    pub signal: String,
}

#[derive(Debug, Clone)]
pub struct Evaluation {
    pub lhs: String,
    pub rhs: String,
}

#[derive(Debug, Clone)]
pub enum InstructionType {
    Negate(Negation),
    Assign(Assignment),
    Evaluate(Evaluation),
}

#[derive(Debug, Clone)]
pub struct Instruction {
    pub register: String,
    pub operation: Operation,
    pub instruction_type: InstructionType,
}

impl Instruction {
    fn from(line: &str) -> Instruction {
        let negation_re = Regex::new(r"NOT (?P<signal>\w+) -> (?P<register>\w+)").unwrap();
        if negation_re.is_match(line) {
            let caps = negation_re.captures(line).unwrap();
            let signal = String::from(&caps["signal"]);
            let register = String::from(&caps["register"]);

            return Instruction {
                register,
                operation: Operation::Not,
                instruction_type: InstructionType::Negate(Negation { signal }),
            };
        }

        let evaluation_re =
            Regex::new(r"(?P<lhs>\w+) (?P<operation>\w+) (?P<rhs>\w+) -> (?P<register>\w+)")
                .unwrap();
        if evaluation_re.is_match(line) {
            let caps = evaluation_re.captures(line).unwrap();
            let lhs = String::from(&caps["lhs"]);
            let rhs = String::from(&caps["rhs"]);
            let operation = Operation::from_str(&caps["operation"]);
            let register = String::from(&caps["register"]);

            return Instruction {
                register,
                operation,
                instruction_type: InstructionType::Evaluate(Evaluation { lhs, rhs }),
            };
        }

        let assignment_re = Regex::new(r"(?P<signal>\w+) -> (?P<register>\w+)").unwrap();
        if assignment_re.is_match(line) {
            let caps = assignment_re.captures(line).unwrap();
            let signal = String::from(&caps["signal"]);
            let register = String::from(&caps["register"]);

            return Instruction {
                register,
                operation: Operation::Assign,
                instruction_type: InstructionType::Assign(Assignment { signal }),
            };
        }

        panic!("Something went wrong with parsing")
    }
}

fn apply_operation(lhs: i32, rhs: i32, operation: &Operation) -> i32 {
    match operation {
        Operation::And => lhs & rhs,
        Operation::Or => lhs | rhs,
        Operation::LShift => lhs << rhs,
        Operation::RShift => lhs >> rhs,
        _ => todo!("This case should not really happen"),
    }
}

pub fn main() {
    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 7");

    let file_contents = get_file_content(GetFileContentOptions {
        year: 2015,
        day: 7,
        is_test: false,
        error_message: "Could not open file for Year 2015 Day 7",
    });

    let instructions = split_by_line(&file_contents)
        .map(|it| Instruction::from(it))
        .collect::<Vec<Instruction>>();

    assert!(instructions.len() != 0);

    // NOTE: This state should be cleared between part 1 and 2
    let mut state: HashMap<&str, i32> = HashMap::new();

    loop {
        for instruction in instructions.iter() {
            if state.contains_key(&instruction.register as &str) {
                continue;
            }

            match &instruction.instruction_type {
                InstructionType::Negate(ins) => {
                    // 1. Check if the signal already has a value
                    // 1a. If the signal has a value, then we should negate that value and set it
                    //     to the register
                    // 1b. If the signal does not have a value, then we can't do this operation.
                    if let Some(&value) = state.get(&ins.signal as &str) {
                        state.insert(&instruction.register, !value);
                    }
                }
                InstructionType::Assign(ins) => {
                    // 1. Check if the the signal can be numeric
                    // 1a. If the signal is numeric, then we can just assign the value to the
                    // register
                    // 1b. If the signal is a variable, then we have to check if that value already
                    // exists
                    //   1b(i). If a value exists for this signal, then we grab that value and
                    //   assign it
                    //   1b(ii). Otherwise, we cannot do this operation
                    if let Ok(signal_i32) = ins.signal.parse::<i32>() {
                        state.insert(&instruction.register, signal_i32);
                    } else if let Some(&value) = state.get(&ins.signal as &str) {
                        state.insert(&instruction.register, value);
                    }
                }
                InstructionType::Evaluate(ins) => {
                    let is_lhs_numeric = ins.lhs.parse::<i32>().is_ok();
                    let is_rhs_numeric = ins.rhs.parse::<i32>().is_ok();

                    match (is_lhs_numeric, is_rhs_numeric) {
                        (true, true) => {
                            let lhs_i32 = ins.lhs.parse::<i32>().unwrap();
                            let rhs_i32 = ins.rhs.parse::<i32>().unwrap();
                            let evaluated =
                                apply_operation(lhs_i32, rhs_i32, &instruction.operation);
                            state.insert(&instruction.register, evaluated);
                        }
                        (true, false) => {
                            let lhs_i32 = ins.lhs.parse::<i32>().unwrap();

                            let rhs_i32 = if let Some(value) = state.get(&ins.rhs as &str) {
                                Some(*value)
                            } else {
                                None
                            };

                            if rhs_i32.is_some() {
                                let rhs_i32 = rhs_i32.unwrap();

                                let evaluated =
                                    apply_operation(lhs_i32, rhs_i32, &instruction.operation);
                                state.insert(&instruction.register, evaluated);
                            }
                        }
                        (false, true) => {
                            let rhs_i32 = ins.rhs.parse::<i32>().unwrap();

                            let lhs_i32 = if let Some(value) = state.get(&ins.lhs as &str) {
                                Some(*value)
                            } else {
                                None
                            };

                            if lhs_i32.is_some() {
                                let lhs_i32 = lhs_i32.unwrap();

                                let evaluated =
                                    apply_operation(lhs_i32, rhs_i32, &instruction.operation);
                                state.insert(&instruction.register, evaluated);
                            }
                        }
                        (false, false) => {
                            let lhs_i32 = if let Some(value) = state.get(&ins.lhs as &str) {
                                Some(*value)
                            } else {
                                None
                            };

                            let rhs_i32 = if let Some(value) = state.get(&ins.rhs as &str) {
                                Some(*value)
                            } else {
                                None
                            };

                            if lhs_i32.is_some() && rhs_i32.is_some() {
                                let rhs_i32 = rhs_i32.unwrap();
                                let lhs_i32 = lhs_i32.unwrap();

                                let evaluated =
                                    apply_operation(lhs_i32, rhs_i32, &instruction.operation);
                                state.insert(&instruction.register, evaluated);
                            }
                        }
                    }
                }
            }
        }

        if instructions.len() == state.len() {
            break;
        }
    }

    let result = *state.get("a").unwrap();

    println!("Part 1: {}", result);

    state.clear();
    state.insert("b", 3176);

    loop {
        for instruction in instructions.iter() {
            if state.contains_key(&instruction.register as &str) {
                continue;
            }

            match &instruction.instruction_type {
                InstructionType::Negate(ins) => {
                    // 1. Check if the signal already has a value
                    // 1a. If the signal has a value, then we should negate that value and set it
                    //     to the register
                    // 1b. If the signal does not have a value, then we can't do this operation.
                    if let Some(&value) = state.get(&ins.signal as &str) {
                        state.insert(&instruction.register, !value);
                    }
                }
                InstructionType::Assign(ins) => {
                    // 1. Check if the the signal can be numeric
                    // 1a. If the signal is numeric, then we can just assign the value to the
                    // register
                    // 1b. If the signal is a variable, then we have to check if that value already
                    // exists
                    //   1b(i). If a value exists for this signal, then we grab that value and
                    //   assign it
                    //   1b(ii). Otherwise, we cannot do this operation
                    if let Ok(signal_i32) = ins.signal.parse::<i32>() {
                        state.insert(&instruction.register, signal_i32);
                    } else if let Some(&value) = state.get(&ins.signal as &str) {
                        state.insert(&instruction.register, value);
                    }
                }
                InstructionType::Evaluate(ins) => {
                    let is_lhs_numeric = ins.lhs.parse::<i32>().is_ok();
                    let is_rhs_numeric = ins.rhs.parse::<i32>().is_ok();

                    match (is_lhs_numeric, is_rhs_numeric) {
                        (true, true) => {
                            let lhs_i32 = ins.lhs.parse::<i32>().unwrap();
                            let rhs_i32 = ins.rhs.parse::<i32>().unwrap();
                            let evaluated =
                                apply_operation(lhs_i32, rhs_i32, &instruction.operation);
                            state.insert(&instruction.register, evaluated);
                        }
                        (true, false) => {
                            let lhs_i32 = ins.lhs.parse::<i32>().unwrap();

                            let rhs_i32 = if let Some(value) = state.get(&ins.rhs as &str) {
                                Some(*value)
                            } else {
                                None
                            };

                            if rhs_i32.is_some() {
                                let rhs_i32 = rhs_i32.unwrap();

                                let evaluated =
                                    apply_operation(lhs_i32, rhs_i32, &instruction.operation);
                                state.insert(&instruction.register, evaluated);
                            }
                        }
                        (false, true) => {
                            let rhs_i32 = ins.rhs.parse::<i32>().unwrap();

                            let lhs_i32 = if let Some(value) = state.get(&ins.lhs as &str) {
                                Some(*value)
                            } else {
                                None
                            };

                            if lhs_i32.is_some() {
                                let lhs_i32 = lhs_i32.unwrap();

                                let evaluated =
                                    apply_operation(lhs_i32, rhs_i32, &instruction.operation);
                                state.insert(&instruction.register, evaluated);
                            }
                        }
                        (false, false) => {
                            let lhs_i32 = if let Some(value) = state.get(&ins.lhs as &str) {
                                Some(*value)
                            } else {
                                None
                            };

                            let rhs_i32 = if let Some(value) = state.get(&ins.rhs as &str) {
                                Some(*value)
                            } else {
                                None
                            };

                            if lhs_i32.is_some() && rhs_i32.is_some() {
                                let rhs_i32 = rhs_i32.unwrap();
                                let lhs_i32 = lhs_i32.unwrap();

                                let evaluated =
                                    apply_operation(lhs_i32, rhs_i32, &instruction.operation);
                                state.insert(&instruction.register, evaluated);
                            }
                        }
                    }
                }
            }
        }

        if instructions.len() == state.len() {
            break;
        }
    }

    let result = state.get("a").unwrap();

    println!("Part 2: {}", result);

    println!("==================================");
}
