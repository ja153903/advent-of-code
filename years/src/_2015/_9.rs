#![allow(dead_code)]

use regex::Regex;
use std::collections::HashMap;

use utils::fs::{get_file_content, split_by_line, GetFileContentOptions};

#[derive(Debug, Clone)]
struct Node {
    pub src: String,
    pub dst: String,
    pub value: i32,
}

impl Node {
    pub fn from(line: &str) -> Self {
        let re = Regex::new(r"(?P<src>\w+) to (?P<dst>\w+) = (?P<value>\d+)").unwrap();
        let caps = re.captures(line).unwrap();

        Self {
            src: String::from(&caps["src"]),
            dst: String::from(&caps["dst"]),
            value: caps["value"]
                .parse::<i32>()
                .expect("Could not parse i32 value properly"),
        }
    }
}

pub fn main() {
    let file_content = get_file_content(GetFileContentOptions {
        year: 2015,
        day: 9,
        is_test: false,
        error_message: "Could not load file content for Year 2015 Day 9",
    });
    let nodes = split_by_line(&file_content)
        .map(|it| Node::from(it))
        .collect::<Vec<Node>>();

    let part1 = "";
    let part2 = "";

    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 9");
    println!("Part 1: {}", part1);
    println!("Part 2: {}", part2);
    println!("==================================");
}
