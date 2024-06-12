use utils::fs::{get_file_content, split_by_line, GetFileContentOptions};

#[derive(Debug)]
struct Metadata {
    pub code_repr_len: usize,
    pub in_mem_len: usize,
    pub expanded_code_repr_len: usize,
}

impl Metadata {
    pub fn new(line: &str) -> Self {
        Self {
            code_repr_len: line.len(),
            in_mem_len: Self::get_in_mem_len(line),
            expanded_code_repr_len: Self::get_expanded_code_repr_len(line),
        }
    }

    pub fn get_in_mem_len(line: &str) -> usize {
        let mut len = 0;
        let mut itr = line.chars().peekable();

        while itr.peek().is_some() {
            let ch = itr.next().unwrap();
            if ch == '"' {
                continue;
            } else if ch == '\\' {
                let next = itr.next().unwrap();
                match next {
                    '\\' | '"' => {}
                    'x' => {
                        assert!(itr.next().unwrap().is_ascii_hexdigit());
                        assert!(itr.next().unwrap().is_ascii_hexdigit());
                    }
                    _ => panic!("Invalid sequence"),
                }
            }

            len += 1;
        }

        len
    }

    pub fn part1(&self) -> usize {
        self.code_repr_len - self.in_mem_len
    }

    pub fn part2(&self) -> usize {
        self.expanded_code_repr_len - self.code_repr_len
    }

    pub fn get_expanded_code_repr_len(line: &str) -> usize {
        let mut len = 0;
        let mut itr = line.chars().peekable();

        while itr.peek().is_some() {
            let ch = itr.next().unwrap();

            if ch == '"' || ch == '\\' {
                len += 2;
            } else {
                len += 1;
            }
        }

        2 + len
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

    let part1 = lines.iter().map(|it| it.part1()).sum::<usize>();
    let part2 = lines.iter().map(|it| it.part2()).sum::<usize>();

    println!("==================================");
    println!("Advent of Code - Year 2015 - Day 8");
    println!("Part 1: {}", part1);
    println!("Part 2: {}", part2);
    println!("==================================");
}
