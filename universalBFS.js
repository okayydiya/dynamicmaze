import { sleep, updateCellClass, getNeighbors, reconstructPath, startSolveTimer, getSolveTime } from './pathUtils.js';



export async function universalBFS(start, end, algorithm, abortController) {
  if (abortController.abort) {
    console.log("Solver aborted!");
    return;
  } 

  startSolveTimer(); 
  algorithm.grid.forEach(cell => cell.parent = null);
 

  const queue = [start]; 
  const visited = new Set(); 
  while (queue.length > 0)//main BFS loop.
     { 
    if (abortController.abort) {
      console.log("Solver aborted during run!");
      return;
    }

    const current = queue.shift(); 
        if (visited.has(current)) continue; 
    visited.add(current); 

    updateCellClass(current); 
    
    if (abortController.abort) {
      console.log("Solver aborted before sleep!");
      return;
    }
    
    await sleep(20); //Pauses execution for 20 milliseconds.

    //Checks if the current cell is the goal/end cell.
    if (current === end) {
      const path = reconstructPath(end); 
      for (const cell of path) {
        if (abortController.abort) {
          console.log("Solver aborted while drawing path!");
          return;
        }

        updateCellClass(cell, true);
        await sleep(30); }
      return; 
    }

    //Gets all neighbors of the current cell
    const neighbors = getNeighbors(current, algorithm.grid, algorithm);

    //Loops through each neighbor cell.
    for (const neighbor of neighbors)
       {
      if (!visited.has(neighbor)) {
        neighbor.parent = current; //Sets the neighbor’s .parent to the current cell. This links the neighbor back to current to reconstruct the path later.
        queue.push(neighbor);//Adds the neighbor to the end of the queue to be processed later.
      }
    }
  }
  console.log("No path found!"); }