// utils/helpers.js

export const GRID_SIZE = 10;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

export function generateApples() {
  return Array.from({ length: TOTAL_CELLS }, () => Math.floor(Math.random() * 9) + 1);
}

export function sumSelected(values, indices) {
  return indices.reduce((acc, idx) => acc + values[idx], 0);
}
