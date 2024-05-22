use clap::Parser;

use std::env;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    #[arg(short, long)]
    year: i32,
    #[arg(short, long)]
    problem: i32,
}

fn get_cwd() -> String {
    env::current_dir()
        .expect("Could not get current working directory")
        .to_str()
        .unwrap()
        .to_string()
}

fn get_years_cwd() -> String {
    let current_cwd = get_cwd();

    format!("{}/years/src", current_cwd)
}

fn mkdir_year(year: i32) {
    let cwd = get_years_cwd();
    let potential_year_dir = format!("{}/_{}", cwd, year);
    let path = path::Path::new(&potential_year_dir);

    println!("==> Checking if we need to create a new directory...");

    if !path.exists() {
        fs::create_dir(path).expect("Something went wrong when creating the new path");

        println!("==> Created a new directory at {}", potential_year_dir);
    } else {
        println!("==> Directory at {} already exists", potential_year_dir);
    }
}

fn mk_problem_file(year: i32, problem: i32) {
    let cwd = get_years_cwd();
    let potential_problem_file = format!("{}/_{}/_{}.rs", cwd, year, problem);
    let path = path::Path::new(&potential_problem_file);

    println!("==> Checking if we need to create a new file...");

    if !path.exists() {
        fs::File::create(path).expect("Something went wrong when creating the new path");

        println!("==> Created a new file at {}", potential_problem_file);
    } else {
        println!("==> File at {} already exists", potential_problem_file);
    }
}

fn mk_problem_input_file(year: i32, problem: i32) {
    let cwd = get_years_cwd();
    let potential_problem_file = format!("{}/_{}/data/_{}.in", cwd, year, problem);
    let path = path::Path::new(&potential_problem_file);

    println!("==> Checking if we need to create a new file...");

    if !path.exists() {
        fs::File::create(path).expect("Something went wrong when creating the new path");

        println!("==> Created a new file at {}", potential_problem_file);
    } else {
        println!("==> File at {} already exists", potential_problem_file);
    }
}

fn update_mod(year: i32, problem: i32) {
    let cwd = get_years_cwd();
    let problem_mod_file = format!("{}/_{}/mod.rs", cwd, year);
    let mut file = OpenOptions::new()
        .append(true)
        .open(problem_mod_file)
        .expect("Could not open file in write mode");

    let line = format!("pub mod _{};", problem);
    file.write_all(line.as_bytes())
        .expect("Could not write to mod file properly");

    println!("==> Updated mod.rs with pub mod _{};", problem);
}

fn main() {
    let args = Args::parse();

    mkdir_year(args.year);

    mk_problem_file(args.year, args.problem);
    mk_problem_input_file(args.year, args.problem);

    update_mod(args.year, args.problem);
}
