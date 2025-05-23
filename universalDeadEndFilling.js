import { sleep, updateCellClass, getNeighbors, reconstructPath } from './pathUtils.js';
import { startTimer, stopTimer, updateInfo } from './mazeInfo.js';

export async function universalDeadEndFilling(start,end,algorithm,abortController) {
    if(abortController.abort){
        console.log("Solver aborted!");
        return;
    }

    startTimer('solving');

    algorithm.grid.forEach(cell => {
        cell.visited = false;
        cell.parent=null;
    });

    let found_deadend=true;

    while(found_deadend){
        if (abortController.abort) {
            console.log("Solver aborted during run!");
            return;
        }

        found_deadend=false;

        for(const cell of algorithm.grid){
            if(cell==start || cell==end || cell.visited)
                continue;
            else{
                const neighbors = getNeighbors(cell, algorithm.grid, algorithm).filter(n => !n.visited);
                if(neighbors.length<=1){
                    cell.visited=true;
                    updateCellClass(cell);
                    await sleep(20);
                    found_deadend=true;
                }
            }
        }
        
    }

    let current=start;
    const queue=[start];
    const visited=new Set();

    while(queue.length>0){
        if(abortController.abort){
            console.log("Solver aborted!");
            return;
        }

        current = queue.shift();
        if (visited.has(current)) continue;
        visited.add(current);

        if(current===end){
            const path=reconstructPath(end);
            for(const cell of path){
                updateCellClass(cell,true);
                await sleep(30);
            }

            stopTimer('solving');
            updateInfo({
                mode: 'solving',
                cols: algorithm.cols,
                rows: algorithm.rows,
                algorithm: "Dead-End Filling",
                pathFound: true
            });
            return;
        }

        const neighbors = getNeighbors(current, algorithm.grid, algorithm).filter(n => !n.visited);
        for(const neighbor of neighbors){
            if(!visited.has(neighbor)){
                neighbor.parent=current;
                queue.push(neighbor);
            }
        }

    }

    stopTimer('solving');
    updateInfo({
        mode: 'solving',
        cols: algorithm.cols,
        rows: algorithm.rows,
        algorithm: "Dead-End Filling",
        pathFound: false
    });
    console.log("No path found");
}