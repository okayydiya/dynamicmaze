import { sleep, updateCellClass, getNeighbors, reconstructPath, startSolveTimer, getSolveTime } from './pathUtils.js';

//algorithm: contains grid and helper like index(i,j)
//allows stopping the algorithm midway (e.g., user cancels).
export async function universalDFS(start, end, algorithm, abortController) {
  if (abortController.abort) {
    console.log("Solver aborted!");
    return;
  }

  startSolveTimer();

  const stack = [start]; // stack (LIFO — Last In First Out)
  const visited = new Set(); //keeps track of which cells we've seen.
  algorithm.grid.forEach(cell => cell.parent = null); //Reset all cell.parent to null to ensure a clean state.

  while (stack.length > 0) {
    if (abortController.abort) {
      console.log("Solver aborted during run!");
      return;
    }

    const current = stack.pop();//Get the most recently added cell (deepest path).

    if (visited.has(current)) continue; //Avoid processing the same cell more than once.
    visited.add(current);

    current.visited = true;
    updateCellClass(current); //Visually color the current cell (blue tint).
    await sleep(20); //Pause for animation.

    // Early exit if end found
    if (current === end) {
      const path = reconstructPath(end); //If we reach the end, reconstruct and visualize the solution path.
      for (const cell of path) {
        updateCellClass(cell, true); //updateCellClass(cell, true) = red-tinted cell (part of final path).
        await sleep(30);
      }
      return;
    }

    // Get neighbors in natural order (no reverse)
    //Returns neighboring cells where there is no wall between them.
    const neighbors = getNeighbors(current, algorithm.grid, algorithm);
    
    // Process neighbors in standard order
    //If neighbor not yet visited:
    // Set its .parent to the current cell (for path reconstruction).
    // Push it onto the stack to explore deeper.
    neighbors.forEach(neighbor => {
      if (!visited.has(neighbor)) {
        neighbor.parent = current;
        stack.push(neighbor);
      }
    });
  }
  console.log("No path found!"); //If DFS exits the loop without finding the goal, log that there's no path.
}