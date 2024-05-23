use std::env;
use std::fs;
use std::str;

pub struct ProblemMetadata {
    pub year: i32,
    pub day: i32,
}

pub struct GetPathToFileOptions {
    pub problem: ProblemMetadata,
    pub is_test: bool,
}

pub fn get_path_to_file(options: GetPathToFileOptions) -> String {
    let current_dir = env::current_dir().expect("Could not determine current working directory");
    let cwd = current_dir.to_str().unwrap().to_string();

    if !options.is_test {
        format!(
            "{}/years/src/_{}/data/_{}.in",
            cwd, options.problem.year, options.problem.day
        )
    } else {
        format!(
            "{}/years/src/_{}/data/_{}.test.in",
            cwd, options.problem.year, options.problem.day
        )
    }
}

pub struct GetFileContentOptions<'a> {
    pub year: i32,
    pub day: i32,
    pub is_test: bool,
    pub error_message: &'a str,
}

/// get_file_content reads an input file that we've created
/// for some advent of code problem and returns the content as a String
pub fn get_file_content(options: GetFileContentOptions) -> String {
    let filepath = get_path_to_file(GetPathToFileOptions {
        is_test: options.is_test,
        problem: ProblemMetadata {
            year: options.year,
            day: options.day,
        },
    });

    fs::read_to_string(filepath).expect(options.error_message)
}

pub fn split_by_line(s: &str) -> impl Iterator<Item = &str> {
    s.split("\n").filter(|it| !it.is_empty())
}
