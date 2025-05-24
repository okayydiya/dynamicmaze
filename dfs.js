// dfs.js - Fixed DFS Algorithm using unified Cell class
import { Cell } from './cell.js';
import { startTimer, stopTimer, updateInfo } from './mazeInfo.js';


export let grid = [];
export let cols, rows;
export const cellSize = 20;

let stack = [];
export let current;
export let complete = false;

export function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) return -1;
  return i + j * cols;
}

export function generateMaze(p,width, height) {
  startTimer();
  let cnv = p.createCanvas(width, height);
  cnv.parent("canvas-container");
  p.frameRate(60);

  cols = p.floor(p.width / cellSize);
  rows = p.floor(p.height / cellSize);

  // Reset variables
  grid = [];
  stack = [];
  complete = false;
  
  // Initialize grid with unified Cell class
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j, cellSize);
      grid.push(cell);
    }
  }

  current = grid[0];
  current.visited = true;
}

export function mazeDraw(p) {
  p.background(255, 230, 235, 50);
  
  
  // Draw all cells
  for (let cell of grid) {
    cell.show(p);
  }

  // Highlight current cell during generation
  if (current) {
    current.highlight(p);
    
    // DFS algorithm step
    let next = current.checkNeighbors(grid, index);
    if (next) {
      next.visited = true;
      stack.push(current);
      current.removeWalls(next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      // Maze generation is complete
      complete = true;
      current = null;
      stopTimer();
    }
  }
  updateInfo({
    mode: 'generation',
    cols,
    rows,
    algorithm: "DFS",
    complete
  });

}

export function isComplete() {
  return complete;
}