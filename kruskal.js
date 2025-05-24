// kruskal.js - Fixed Kruskal's Algorithm using unified Cell class
import { Cell } from './cell.js';
import { startTimer, stopTimer, updateInfo } from './mazeInfo.js';

export let grid = [];
export let cols, rows;
export const cellSize = 20;

let edges = [];
let sets = [];
let currentEdgeIndex = 0;
export let complete = false;

export function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) return -1;
  return i + j * cols;
}

export function generateMaze(p, width, height) {
  startTimer();
  let cnv = p.createCanvas( width, height);
  cnv.parent("canvas-container");
  p.frameRate(60);

  cols = p.floor(p.width / cellSize);
  rows = p.floor(p.height / cellSize);

  // Reset variables
  grid = [];
  edges = [];
  sets = [];
  currentEdgeIndex = 0;
  complete = false;

  // Initialize grid with unified Cell class
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j, cellSize);
      grid.push(cell);
      cell.visited = true; // Mark all cells as visited for rendering
      
      // Each cell starts in its own disjoint set
      sets.push([cell]);
    }
  }

  // Generate all possible edges
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = grid[index(i, j)];
      
      // Add edges to the right and bottom
      if (i < cols - 1) {
        edges.push([cell, grid[index(i + 1, j)]]);
      }
      if (j < rows - 1) {
        edges.push([cell, grid[index(i, j + 1)]]);
      }
    }
  }

  // Shuffle edges randomly
  shuffle(edges, p);
}

export function mazeDraw(p) {
  p.background(255);
  
  // Draw all cells
  for (let cell of grid) {
    cell.show(p);
  }

  // Process edges if we haven't completed maze generation
  if (currentEdgeIndex < edges.length) {
    const [cellA, cellB] = edges[currentEdgeIndex];
    
    // Find the sets containing the two cells
    let setA = findSet(cellA);
    let setB = findSet(cellB);
    
    // If cells are in different sets, connect them and merge sets
    if (setA !== setB) {
      cellA.removeWalls(cellB);
      
      // Highlight the connected cells
      cellA.highlight(p);
      cellB.highlight(p);
      
      // Merge the sets
      unionSets(setA, setB);
    }
    
    currentEdgeIndex++;
  } else {
    // Maze generation is complete
    complete = true;
    stopTimer();
  }
  updateInfo({
  mode: 'generation', // Add this
  cols,
  rows,
  algorithm: "Kruskal's",
  complete
});
}

// Helper function to find which set contains a cell
function findSet(cell) {
  return sets.find(set => set.includes(cell));
}

// Helper function to merge two sets
function unionSets(setA, setB) {
  const newSet = [...setA, ...setB];
  sets = sets.filter(set => set !== setA && set !== setB);
  sets.push(newSet);
}

// Helper function to shuffle an array
function shuffle(array, p) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(p.random(i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function isComplete() {
  return complete;
}