import { sleep, updateCellClass, getNeighbors, reconstructPath, startSolveTimer, getSolveTime } from './pathUtils.js';

export async function universalDijkstra(start, end, algorithm, abortController) {
  if (abortController.abort) {
    console.log("Solver aborted!");
    return;
  }
  // Initialize distances and parents
  startSolveTimer();

  const distances = new Map(); //Stores shortest distance from start to every cell.

  //All distances start as Infinity (unknown), except start, which is 0
  algorithm.grid.forEach(cell => {
    distances.set(cell, Infinity);
    cell.parent = null; //.parent is cleared for path reconstruction later.
  });
  distances.set(start, 0);

  const priorityQueue = [{ cell: start, distance: 0 }]; //stores cells to explore, ordered by smallest known distance.
  const visited = new Set(); //Keeps track of already processed nodes to avoid cycles.

  while (priorityQueue.length > 0) {
    if (abortController.abort) {
      console.log("Solver aborted during run!");
      return;
    }

    // Sort queue to simulate priority queue
    //Extract the cell with the smallest distance (shift()).
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const { cell: current } = priorityQueue.shift();

    if (visited.has(current)) continue; //If already visited, skip. Else, mark as visited.
    visited.add(current);

    // Visualization update
    updateCellClass(current);
    await sleep(20);

    // Early exit if end found
    if (current === end) {
      const path = reconstructPath(end);
      for (const cell of path) {
        updateCellClass(cell, true);
        await sleep(30);
      }
      return;
    }

    // Process neighbors
    //For each neighbor:    
    // Skip if already visited.
    // Assume equal edge weight = 1.
    // If new distance is shorter:
    // Update it.
    // Set the parent to current (for path tracing).
    // Add it to the queue for future processing.
    const neighbors = getNeighbors(current, algorithm.grid, algorithm);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const newDistance = distances.get(current) + 1; // All edges weight = 1
        
        if (newDistance < distances.get(neighbor)) {
          distances.set(neighbor, newDistance);
          neighbor.parent = current;
          priorityQueue.push({ cell: neighbor, distance: newDistance });
        }
      }
    }
  }
  console.log("No path found!");
}