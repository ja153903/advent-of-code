#![allow(dead_code)]

use std::fs;

use utils::fs::{get_path_to_file, GetPathToFileOptions, ProblemMetadata};

pub fn get_file_content(is_test: bool) -> String {
    let filepath = get_path_to_file(GetPathToFileOptions {
        is_test,
        problem: ProblemMetadata { year: 2015, day: 1 },
    });

    fs::read_to_string(filepath).expect("Could not read file for Year 2015 - Day 1")
}

pub fn main() {
    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 1");

    let file_content = get_file_content(false);

    let part1 = file_content
        .chars()
        .map(|it| match it {
            '(' => 1,
            ')' => -1,
            _ => 0,
        })
        .sum::<i32>();

    println!("Part 1: {}", part1);

    let mut current_level = 0;

    for (i, ch) in file_content.char_indices() {
        match ch {
            '(' => {
                current_level += 1;
            }
            ')' => {
                current_level -= 1;
            }
            _ => {}
        }

        if current_level < 0 {
            println!("Part 2: {}", i + 1);
            break;
        }
    }

    println!("==================================");
}
