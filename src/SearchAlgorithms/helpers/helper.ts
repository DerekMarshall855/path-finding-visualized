//  Lazily make everything any
export const getAllCells = (grid: any) => {
    const cells = [];
    for (const row of grid) {
        for (const cell of row) {
            cells.push(cell);
        }
    }
    return cells;
}

export const distanceSort = (unvisitedCells: any) => {
    unvisitedCells.sort((cellA: any, cellB: any) => cellA.distance - cellB.distance);
}

export const updateVisited = (cell: any, grid: any) => {
    const unvisitedNeighbors = getNeighbors(cell, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = cell.distance + 1 + neighbor.distanceToEnd;
        neighbor.previousCell = cell;
    }
}

const getNeighbors = (cell: any, grid: any) => {
    const neighbors = [];
    const { col, row } = cell;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}
