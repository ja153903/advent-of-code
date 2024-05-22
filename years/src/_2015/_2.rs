#![allow(dead_code)]

use std::fs;

use utils::fs::{get_path_to_file, GetPathToFileOptions, ProblemMetadata};

pub struct BoxMetadata {
    pub length: i32,
    pub width: i32,
    pub height: i32,
}

impl BoxMetadata {
    fn surface_area(&self) -> i32 {
        2 * self.length * self.width + 2 * self.length * self.height + 2 * self.width * self.height
    }

    fn smallest_side_area(&self) -> i32 {
        (self.height * self.width).min((self.height * self.length).min(self.width * self.length))
    }

    fn part1(&self) -> i32 {
        self.surface_area() + self.smallest_side_area()
    }

    fn smallest_sides_perimeter(&self) -> i32 {
        (2 * self.length + 2 * self.height)
            .min((2 * self.length + 2 * self.width).min(2 * self.height + 2 * self.width))
    }

    fn volume(&self) -> i32 {
        self.width * self.height * self.length
    }

    fn part2(&self) -> i32 {
        self.smallest_sides_perimeter() + self.volume()
    }
}

pub fn get_file_content(is_test: bool) -> String {
    let filepath = get_path_to_file(GetPathToFileOptions {
        is_test,
        problem: ProblemMetadata { year: 2015, day: 2 },
    });

    fs::read_to_string(filepath).expect("Could not read file for Year 2015 - Day 2")
}

pub fn parse_file_content(data: &str) -> Vec<BoxMetadata> {
    data.split("\n")
        .filter(|it| !it.is_empty())
        .into_iter()
        .map(|it| {
            let mut parts = it.split("x");
            let length = parts.next().unwrap().parse::<i32>().unwrap();
            let width = parts.next().unwrap().parse::<i32>().unwrap();
            let height = parts.next().unwrap().parse::<i32>().unwrap();

            BoxMetadata {
                length,
                width,
                height,
            }
        })
        .collect::<Vec<BoxMetadata>>()
}

pub fn main() {
    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 2");

    let file_content = get_file_content(false);
    let box_metadata_vec = parse_file_content(&file_content);

    let part1 = box_metadata_vec.iter().map(|it| it.part1()).sum::<i32>();

    println!("Part 1: {}", part1);

    let part2 = box_metadata_vec.iter().map(|it| it.part2()).sum::<i32>();

    println!("Part 2: {}", part2);

    println!("==================================");
}
