use utils::fs::{get_file_content, split_by_line, GetFileContentOptions};

#[derive(Debug)]
struct Metadata {
    pub code_repr_len: usize,
    pub in_mem_len: usize,
}

// TODO: Still need to implement a way to get the in_mem_len
impl Metadata {
    pub fn new(line: &str) -> Self {
        Self {
            code_repr_len: line.len(),
            in_mem_len: 0,
        }
    }

    pub fn diff(&self) -> usize {
        self.code_repr_len - self.in_mem_len
    }
}

pub fn main() {
    let file_content = get_file_content(GetFileContentOptions {
        year: 2015,
        day: 8,
        is_test: false,
        error_message: "Failed to load content for Year 2015 Day 8",
    });

    let lines = split_by_line(&file_content)
        .map(|it| Metadata::new(it))
        .collect::<Vec<Metadata>>();

    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 8");

    let part1 = lines.iter().map(|it| it.diff()).sum::<usize>();

    println!("Part 1: {}", part1);
    println!("Part 2: {}", "");
    println!("==================================");
}
