#![allow(unused_variables, dead_code)]

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

    /// `from` allows us to create an Instruction instance
    /// from some line of text
    fn from(line: &str) -> Instruction {
        // TODO: Add more detail to this method
        Instruction {
            command: Command::Toggle,
            start_coordinate: Coordinate { x: 0, y: 0 },
            end_coordinate: Coordinate { x: 0, y: 0 },
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

    println!("==================================");
}
