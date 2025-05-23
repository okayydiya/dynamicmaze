// universalAStar.js
import { sleep, updateCellClass, getNeighbors, reconstructPath, startSolveTimer, getSolveTime } from './pathUtils.js';
import { startTimer, stopTimer, updateInfo } from './mazeInfo.js';

//Manhattan Distance: estimates how far a is from b using grid steps.
function heuristic(a, b) {
  return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}

// universalAStar.js - A* Algorithm implementation
export async function universalAStar(start, end, algorithm, abortController) {
  if (abortController.abort) {
    console.log("Solver aborted!");
    return;
  }

  startTimer('solving');
  
  const openSet = [start]; //frontier nodes (starting with the start node).
  const gScore = new Map(); //maps each cell to cost from start.
  const fScore = new Map(); //maps each cell to gScore + heuristic.

  //All cells initially have infinite cost.
  algorithm.grid.forEach(cell => {
    gScore.set(cell, Infinity);
    fScore.set(cell, Infinity);
    cell.parent = null; //for path tracing.
  });

  gScore.set(start, 0); //Start cell cost = 0.
  fScore.set(start, heuristic(start, end)); //Its estimated total cost = heuristic to end.

  while (openSet.length > 0) {
    if (abortController.abort) {
      console.log("Solver aborted during run!");
      return;
    }

    //Sort openSet by fScore. 
    // Remove and process the best next node.
    openSet.sort((a, b) => fScore.get(a) - fScore.get(b)); 
    const current = openSet.shift();

    current.visited = true;
    updateCellClass(current); //Mark the node as visited visually and logically.
    await sleep(20);

    if (current === end) {
      const path = reconstructPath(end);
      for (const cell of path) {
        updateCellClass(cell, true);
        await sleep(30);
      }
      console.log(`Solve time: ${getSolveTime()}s`);
      return;
    }

    //Get valid neighboring cells (not blocked by walls).
    const neighbors = getNeighbors(current, algorithm.grid, algorithm);
    for (const neighbor of neighbors) {
      const tentativeGScore = gScore.get(current) + 1; //Calculate cost to neighbor as g(current) + 1.

      //If this path is better (shorter), update:
      // parent → to trace path
      // gScore, fScore
      // Add neighbor to openSet if not already present
      if (tentativeGScore < gScore.get(neighbor)) {
        neighbor.parent = current;
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighbor, end));
        
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  console.log("No path found!");
}