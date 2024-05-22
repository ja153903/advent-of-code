use std::env;

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
