#![allow(unused_variables, dead_code)]

use regex::Regex;
use std::collections::HashMap;

use utils::fs::{get_file_content, split_by_line, GetFileContentOptions};

#[derive(Debug)]
pub enum Command {
    Toggle,
    TurnOff,
    TurnOn,
    Error,
}

#[derive(Debug)]
pub struct Coordinate {
    pub x: i32,
    pub y: i32,
}

#[derive(Debug)]
pub struct Instruction {
    pub command: Command,
    pub start_coordinate: Coordinate,
    pub end_coordinate: Coordinate,
}

impl Instruction {
    fn get_command_from_str(cmd: &str) -> Command {
        match cmd {
            "toggle" => Command::Toggle,
            "turn on" => Command::TurnOn,
            "turn off" => Command::TurnOff,
            _ => Command::Error,
        }
    }

    fn get_coordinate_from_str(coordinate_as_str: &str) -> Coordinate {
        let mut parts = coordinate_as_str.split(",");
        let x = parts.next().unwrap().parse::<i32>().unwrap();
        let y = parts.next().unwrap().parse::<i32>().unwrap();

        Coordinate { x, y }
    }

    /// `from` allows us to create an Instruction instance
    /// from some line of text
    fn from(line: &str) -> Instruction {
        let re = Regex::new(
            r"(?P<command>(toggle|turn off|turn on)) (?P<start_coordinate_str>\d+,\d+) through (?P<end_coordinate_str>\d+,\d+)",
        ).unwrap();

        let caps = re.captures(line).unwrap();

        let command = Instruction::get_command_from_str(&caps["command"]);
        let start_coordinate = Instruction::get_coordinate_from_str(&caps["start_coordinate_str"]);
        let end_coordinate = Instruction::get_coordinate_from_str(&caps["end_coordinate_str"]);

        Instruction {
            command,
            start_coordinate,
            end_coordinate,
        }
    }
}

pub fn main() {
    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 6");

    let file_content = get_file_content(GetFileContentOptions {
        year: 2015,
        day: 6,
        is_test: false,
        error_message: "Could not read file for Year 2015 - Day 6",
    });

    let instructions = split_by_line(&file_content)
        .map(|it| Instruction::from(it))
        .collect::<Vec<Instruction>>();

    let mut state: HashMap<(i32, i32), bool> = HashMap::new();

    instructions.iter().for_each(|it| {
        for i in it.start_coordinate.x..=it.end_coordinate.x {
            for j in it.start_coordinate.y..=it.end_coordinate.y {
                match it.command {
                    Command::Toggle => {
                        state
                            .entry((i, j))
                            .and_modify(|e| {
                                *e = !*e;
                            })
                            .or_insert(true);
                    }
                    Command::TurnOn => {
                        state
                            .entry((i, j))
                            .and_modify(|e| *e = true)
                            .or_insert(true);
                    }
                    Command::TurnOff => {
                        state
                            .entry((i, j))
                            .and_modify(|e| *e = false)
                            .or_insert(false);
                    }
                    Command::Error => {
                        panic!("Something went wrong at some point when parsing")
                    }
                }
            }
        }
    });

    let part1 = state.values().filter(|&it| *it).count();

    println!("Part 1: {}", part1);

    let mut state: HashMap<(i32, i32), i32> = HashMap::new();

    instructions.iter().for_each(|it| {
        for i in it.start_coordinate.x..=it.end_coordinate.x {
            for j in it.start_coordinate.y..=it.end_coordinate.y {
                match it.command {
                    Command::Toggle => {
                        state
                            .entry((i, j))
                            .and_modify(|e| {
                                *e += 2;
                            })
                            .or_insert(2);
                    }
                    Command::TurnOn => {
                        state
                            .entry((i, j))
                            .and_modify(|e| {
                                *e += 1;
                            })
                            .or_insert(1);
                    }
                    Command::TurnOff => {
                        state
                            .entry((i, j))
                            .and_modify(|e| {
                                *e = 0.max(*e - 1);
                            })
                            .or_insert(0);
                    }
                    Command::Error => {
                        panic!("Something went wrong at some point when parsing")
                    }
                }
            }
        }
    });

    let part2 = state.values().sum::<i32>();

    println!("Part 2: {}", part2);

    println!("==================================");
}
