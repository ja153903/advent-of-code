use utils;
use years;

/// workspace_initialized_log is maintained to make sure that
/// our dependencies are installed properly
fn workspace_initialized_log() {
    utils::workspace_initialized_log();
    years::workspace_initialized_log();
}

fn main() {
    workspace_initialized_log();

    years::_2015::_1::main();
}
