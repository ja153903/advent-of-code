#![allow(unused_variables)]

use std::collections::HashMap;

use utils::fs::{get_file_content, GetFileContentOptions};

pub fn main() {
    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 3");

    let file_content = get_file_content(GetFileContentOptions {
        year: 2015,
        day: 3,
        is_test: false,
        error_message: "Could not read file for Year 2015 - Day 3",
    });

    let directions_as_int = file_content
        .chars()
        .map(|it| match it {
            '^' => (0, 1),
            'v' => (0, -1),
            '<' => (-1, 0),
            '>' => (1, 0),
            _ => (0, 0),
        })
        .collect::<Vec<(i32, i32)>>();

    let mut visited: HashMap<(i32, i32), i32> = HashMap::new();

    let mut x = 0;
    let mut y = 0;

    // insert the first value
    visited
        .entry((x, y))
        .and_modify(|e| {
            *e += 1;
        })
        .or_insert(1);

    directions_as_int.iter().for_each(|it| {
        x += it.0;
        y += it.1;

        visited
            .entry((x, y))
            .and_modify(|e| {
                *e += 1;
            })
            .or_insert(1);
    });

    println!("Part 1: {}", visited.len());

    let mut x = 0;
    let mut y = 0;

    let mut rx = 0;
    let mut ry = 0;

    visited.clear();

    visited
        .entry((x, y))
        .and_modify(|e| {
            *e += 1;
        })
        .or_insert(1);

    directions_as_int.iter().enumerate().for_each(|(i, it)| {
        if i % 2 == 0 {
            x += it.0;
            y += it.1;
            visited
                .entry((x, y))
                .and_modify(|e| {
                    *e += 1;
                })
                .or_insert(1);
        } else {
            rx += it.0;
            ry += it.1;
            visited
                .entry((rx, ry))
                .and_modify(|e| {
                    *e += 1;
                })
                .or_insert(1);
        }
    });

    println!("Part 2: {}", visited.len());
    println!("==================================");
}
