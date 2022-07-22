import { getAllCells, distanceSort, updateVisited } from "./helpers/helper"

export const AStar = (grid: any, startCell: any, endCell: any) => {
    const visitedCellsInOrder = [];
    startCell.distance = 0;
    const unvisitedCells = getAllCells(grid); // Q: different from using grid or slice of grid???
    while (unvisitedCells.length) {
        distanceSort(unvisitedCells);
        const closestCell = unvisitedCells.shift();
        // If we encounter a wall, we skip it.
        if (!closestCell.isWall) {
            // If the closest cell is at a distance of infinity,
            // we must be trapped and should stop.
            if (closestCell.distance === Infinity) return visitedCellsInOrder;
            closestCell.isVisited = true;
            visitedCellsInOrder.push(closestCell);
            if (closestCell === endCell) return visitedCellsInOrder;
            updateVisited(closestCell, grid);
        }
    }
}