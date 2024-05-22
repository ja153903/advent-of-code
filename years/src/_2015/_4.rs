#![allow(unused_variables)]

use md5::compute;

pub fn main() {
    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 4");

    let puzzle_input = String::from("ckczppom");

    let mut i = 1;

    loop {
        let s = format!("{}{}", &puzzle_input, i);
        let digest = compute(s.as_bytes());

        if format!("{:x}", digest).starts_with("00000") {
            println!("Part 1: {}", i);
            break;
        }

        i += 1;
    }

    // Part 2 starts here

    let mut i = 1;

    loop {
        let s = format!("{}{}", &puzzle_input, i);
        let digest = compute(s.as_bytes());

        if format!("{:x}", digest).starts_with("000000") {
            println!("Part 2: {}", i);
            break;
        }

        i += 1;
    }

    println!("==================================");
}
