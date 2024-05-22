#![allow(unused_variables)]

use std::collections::HashMap;

use utils::fs::{get_file_content, split_by_line, GetFileContentOptions};

fn count_vowels(s: &str) -> usize {
    s.chars()
        .filter(|it| ['a', 'e', 'i', 'o', 'u'].contains(it))
        .count()
}

fn contains_duplicate_consecutive_chars(s: &str) -> bool {
    let mut i: usize = 1;

    while i < s.len() {
        if s[i - 1..i] == s[i..i + 1] {
            return true;
        }
        i += 1;
    }

    false
}

fn contains_forbidden_consecutive_chars(s: &str) -> bool {
    let mut i: usize = 1;

    while i < s.len() {
        if ["ab", "cd", "pq", "xy"].contains(&&s[i - 1..i + 1]) {
            return true;
        }

        i += 1;
    }

    false
}

fn contains_repeating_characters_with_character_buffer(s: &str) -> bool {
    let mut i = 1;

    while i < s.len() - 1 {
        if &s[i - 1..i] == &s[i + 1..i + 2] {
            return true;
        }

        i += 1;
    }

    false
}

fn contains_nonoverlapping_pair_of_two_letters(s: &str) -> bool {
    // can use a hashmap here but we need a complex value (count, start, end)
    let mut count: HashMap<&str, (i32, usize, usize)> = HashMap::new();

    let mut i = 1;

    while i < s.len() {
        let current = &s[i - 1..i + 1];
        count
            .entry(current)
            .and_modify(|e| {
                if e.2 != i - 1 {
                    *e = (e.0 + 1, i - 1, i);
                }
            })
            .or_insert((1, i - 1, i));

        i += 1;
    }

    count.values().find(|it| it.0 > 1).is_some()
}

pub fn main() {
    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 5");

    let file_content = get_file_content(GetFileContentOptions {
        year: 2015,
        day: 5,
        is_test: false,
        error_message: "Could not read file for Year 2015 - Day 5",
    });

    let part1 = split_by_line(&file_content)
        .filter(|it| {
            count_vowels(it) >= 3
                && contains_duplicate_consecutive_chars(it)
                && !contains_forbidden_consecutive_chars(it)
        })
        .count();

    println!("Part 1: {}", part1);

    let part2 = split_by_line(&file_content)
        .filter(|it| {
            contains_repeating_characters_with_character_buffer(it)
                && contains_nonoverlapping_pair_of_two_letters(it)
        })
        .count();

    println!("Part 2: {}", part2);

    println!("==================================");
}
