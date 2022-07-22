export const dfs = (grid: any, startCell: any, endCell: any) => {
    const visitedCellsInOrder = [];
    const nextCellsStack = [];
    nextCellsStack.push(startCell);
    while (nextCellsStack.length) {
        const currentCell: any = nextCellsStack.pop();

        if (currentCell === endCell) {
            return visitedCellsInOrder;
        }

        if (
            !currentCell.isWall &&
            (currentCell.isStart || !currentCell.isVisited)
        ) {
            currentCell.isVisited = true;
            visitedCellsInOrder.push(currentCell);

            const { col, row } = currentCell;
            let nextCell;
            if (row > 0) {
                nextCell = grid[row - 1][col];
                if (!nextCell.isVisited) {
                    nextCell.previousCell = currentCell;
                    nextCellsStack.push(nextCell);
                }
            }
            if (row < grid.length - 1) {
                nextCell = grid[row + 1][col];
                if (!nextCell.isVisited) {
                    nextCell.previousCell = currentCell;
                    nextCellsStack.push(nextCell);
                }
            }
            if (col > 0) {
                nextCell = grid[row][col - 1];
                if (!nextCell.isVisited) {
                    nextCell.previousCell = currentCell;
                    nextCellsStack.push(nextCell);
                }
            }
            if (col < grid[0].length - 1) {
                nextCell = grid[row][col + 1];
                if (!nextCell.isVisited) {
                    nextCell.previousCell = currentCell;
                    nextCellsStack.push(nextCell);
                }
            }
        }
    }
}