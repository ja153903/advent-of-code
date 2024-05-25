#![allow(unused_variables, unused_mut)]

use regex::Regex;
use std::collections::HashMap;

use utils::fs::{get_file_content, split_by_line, GetFileContentOptions};

#[derive(Debug)]
pub enum Operator {
    And,
    Or,
    LShift,
    RShift,
    Not,
}

impl Operator {
    pub fn from_str(s: &str) -> Operator {
        match s {
            "AND" => Operator::And,
            "OR" => Operator::Or,
            "LSHIFT" => Operator::LShift,
            "RSHIFT" => Operator::RShift,
            "NOT" => Operator::Not,
            _ => panic!("Invalid value provided"),
        }
    }
}

#[derive(Debug)]
pub struct SignalProvision {
    pub signal: String,
}

#[derive(Debug)]
pub struct Negation {
    pub signal: String,
    pub operator: Operator,
}

#[derive(Debug)]
pub struct Operation {
    pub signal1: String,
    pub signal2: String,
    pub operator: Operator,
}

#[derive(Debug)]
pub enum InstructionType {
    SignalProvision(SignalProvision),
    Negation(Negation),
    Operation(Operation),
}

#[derive(Debug)]
pub struct Instruction {
    pub instruction_type: InstructionType,
    pub register: String,
}

impl Instruction {
    pub fn from(line: &str) -> Instruction {
        let signal_provision_re = Regex::new(r"(?P<signal>\w+) -> (?P<register>\w+)").unwrap();
        if signal_provision_re.is_match(line) {
            let caps = signal_provision_re.captures(line).unwrap();
            let signal = &caps["signal"];
            let register = &caps["register"];

            return Instruction {
                instruction_type: InstructionType::SignalProvision(SignalProvision {
                    signal: String::from(signal),
                }),
                register: String::from(register),
            };
        }

        let negation_re = Regex::new(r"NOT (?<signal>\w+) -> (?P<register>\w+)").unwrap();
        if negation_re.is_match(line) {
            let caps = negation_re.captures(line).unwrap();
            let signal = &caps["signal"];
            let register = &caps["register"];

            return Instruction {
                instruction_type: InstructionType::Negation(Negation {
                    signal: String::from(signal),
                    operator: Operator::Not,
                }),
                register: String::from(register),
            };
        }

        let operation_re =
            Regex::new(r"(?P<signal1>\w+) (?P<operator>\w+) (?P<signal2>\w+) -> (?P<register>\w+)")
                .unwrap();
        if operation_re.is_match(line) {
            let caps = operation_re.captures(line).unwrap();
            let signal1 = &caps["signal1"];
            let signal2 = &caps["signal2"];
            let operator = &caps["operator"];
            let register = &caps["register"];

            Instruction {
                instruction_type: InstructionType::Operation(Operation {
                    signal1: String::from(signal1),
                    signal2: String::from(signal2),
                    operator: Operator::from_str(operator),
                }),
                register: String::from(register),
            }
        } else {
            panic!("Could not properly parse line")
        }
    }
}

pub fn main() {
    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 7");

    let file_content = get_file_content(GetFileContentOptions {
        year: 2015,
        day: 7,
        is_test: false,
        error_message: "Could not read file for Year 2015 - Day 7",
    });

    let instructions = split_by_line(&file_content)
        .map(|it| Instruction::from(it))
        .collect::<Vec<Instruction>>();

    let mut state: HashMap<&str, i32> = HashMap::new();

    println!("Part 1: {}", state.get("a").unwrap());
    println!("Part 2: {}", "");


    println!("==================================");
}
