import { sleep, updateCellClass, getNeighbors, reconstructPath, startSolveTimer, getSolveTime } from './pathUtils.js';

export async function universalWallFollower(start, end, algorithm, abortController) {
  if (abortController.abort) {
    console.log("Solver aborted!");
    return;
  }
  startSolveTimer();
  const directions = [
    { dx: 0, dy: -1 }, // Up
    { dx: 1, dy: 0 },  // Right
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }  // Left
  ];
  
  let dirIndex = 1; // Start facing right
  let current = start;
  const path = [current];
  
  algorithm.grid.forEach(cell => cell.visited = false);
  current.visited = true;
  updateCellClass(current);
  await sleep(20);

  while (current !== end) {
    if (abortController.abort) {
      console.log("Solver aborted during run!");
      return;
    }
    let moved = false;

    // Check directions in priority: right, front, left, back
    for (let i = 0; i < 4; i++) {
      const tryDir = (dirIndex + 3 - i) % 4; // Right-hand rule
      const wallIndex = directions[tryDir].wallIndex || directions[tryDir].dx === 1 ? 1 : 3;
      
      const ni = current.i + directions[tryDir].dx;
      const nj = current.j + directions[tryDir].dy;
      const neighbor = algorithm.grid[algorithm.index(ni, nj)];

      if (neighbor && !current.walls[tryDir] && !neighbor.visited) {
        current = neighbor;
        current.visited = true;
        path.push(current);
        dirIndex = tryDir;
        moved = true;
        updateCellClass(current);
        await sleep(20);
        break;
      }
    }

    if (!moved) {
      // Backtrack
      if (path.length <= 1) break;
      path.pop();
      current = path[path.length - 1];
      updateCellClass(current);
      await sleep(20);
    }
  }

  if (current === end) {
    // Highlight final path
    for (const cell of path) {
      updateCellClass(cell, true);
      await sleep(30);
    }
    return;
  }
  console.log("No path found!");
}