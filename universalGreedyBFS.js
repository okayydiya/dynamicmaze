import { sleep, updateCellClass, getNeighbors, reconstructPath, startSolveTimer, getSolveTime } from './pathUtils.js';

function heuristic(a, b) {
  // Manhattan distance
  return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}

export async function universalGreedyBFS(start, end, algorithm, abortController) {
  if (abortController.abort) {
    console.log("Solver aborted!");
    return;
  }
  startSolveTimer();

  const openSet = [start]; //priority list of cells to explore (sorted later).
  const openSetSet = new Set([`${start.i},${start.j}`]); // quick lookup (constant time) to avoid duplicates.
  const visited = new Set(); //stores visited cells.

  // Reset parents
  algorithm.grid.forEach(cell => cell.parent = null);

  while (openSet.length > 0) {
    if (abortController.abort) {
      console.log("Solver aborted during run!");
      return;
    }

    // Sort openSet based on heuristic to end
    //Picks the cell closest to the goal (shift() gets the best one).
    //Deletes it from the quick-access set.
    openSet.sort((a, b) => heuristic(a, end) - heuristic(b, end));
    const current = openSet.shift();
    const currentKey = `${current.i},${current.j}`; //Converts the current node’s coordinates to a string key, like "2,3"
    //This key is used for checking membership in Sets like visited and openSetSet, because objects themselves can't be directly compared in sets/maps unless stringified.
    openSetSet.delete(currentKey);//Removes this node's key from openSetSet, which is a Set version of openSet used for fast lookups.Since we’re now visiting this node, it’s no longer in the frontier.

    if (visited.has(currentKey)) continue; //Skip if already visited Otherwise, mark it as visited.
    visited.add(currentKey);

    current.visited = true;
    updateCellClass(current); //Marks it visually as visited and adds a delay for animation.
    await sleep(20);

    if (current === end) {
      const path = reconstructPath(end);
      for (const cell of path) {
        updateCellClass(cell, true);
        await sleep(30);
      }
      console.log(`Path found in ${getSolveTime()}s`);
      return;
    }

    //Gets valid neighbors (i.e. not blocked by walls).
    // For each neighbor:
    // If not visited and not already in openSet:
    // Set its parent to the current cell
    // Add it to openSet and openSetSet
    const neighbors = getNeighbors(current, algorithm.grid, algorithm);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.i},${neighbor.j}`; //comparing object references directly (like Set.has(neighbor)) won’t work unless they are stringified — this avoids duplicates in tracking.
      if (!visited.has(neighborKey) && !openSetSet.has(neighborKey)) {
        neighbor.parent = current;
        openSet.push(neighbor);
        openSetSet.add(neighborKey);
      }
    }
  }

  console.log("No path found!");
}