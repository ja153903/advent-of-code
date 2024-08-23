/**
 * `DIRS_WITH_DIAGONALS` contains all the necessary deltas
 * to visit the neighbors that are immediately adjacent
 * to the given node (including the diagonals)
 */
export const DIRS_WITH_DIAGONALS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 0],
  [0, -1],
  [-1, -1],
  [-1, 1],
  [1, -1],
];
