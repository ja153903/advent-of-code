#![allow(unused_variables)]

use utils::fs::{get_file_content, GetFileContentOptions};

pub fn main() {
    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 7");

    let file_content = get_file_content(GetFileContentOptions {
        year: 2015,
        day: 7,
        is_test: false,
        error_message: "Could not read file for Year 2015 - Day 7"
    });

    println!("Part 1: {}", "");
    println!("Part 2: {}", "");

    println!("==================================");
}
