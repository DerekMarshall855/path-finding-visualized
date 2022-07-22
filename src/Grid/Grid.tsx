import { FC, useEffect, useState } from 'react';
import Cell from './Cell/Cell';
import { AStar } from '../SearchAlgorithms/aStar';
import { dijkstra } from '../SearchAlgorithms/djkstra';
import { dfs } from '../SearchAlgorithms/dfs';
import { bfs } from '../SearchAlgorithms/bfs';

interface CellType {
    row: number,
    col: number,
    isStart: boolean,
    isEnd: boolean,
    distance: number,
    distanceToEnd: number,
    isVisited: boolean,
    isWall: boolean,
    previousCell: CellType | null,
    isCell: boolean
}

const tempGrid: CellType[][] = [];

const Grid: FC = () => {
    //  Set state for grid and cell statuses
    const [grid, setGrid] = useState(tempGrid);
    const [startRow, setStartRow] = useState(5);
    const [startCol, setStartCol] = useState(5);
    const [endRow, setEndRow] = useState(5);
    const [endCol, setEndCol] = useState(15);
    const [mouseDown, setMouseDown] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isStartCell, setIsStartCell] = useState(false);
    const [isEndCell, setIsEndCell] = useState(false);
    const [isWallCell, setIsWallCell] = useState(false);
    const [currRow, setCurrRow] = useState(0);
    const [currCol, setCurrCol] = useState(0);
    const [startCellRow, setStartCellRow] = useState(5);
    const [endCellRow, setEndCellRow] = useState(5);
    const [startCellCol, setStartCellCol] = useState(5);
    const [endCellCol, setEndCellCol] = useState(15);
    const [isDesktopView, setIsDesktopView] = useState(true);
    const ROW_COUNT = 25;
    const COL_COUNT = 25;
    const MOBILE_ROW_COUNT = 10;
    const MOBILE_COL_COUNT = 20;

    useEffect(() => {
        const startGrid = initGrid();
        setGrid(startGrid);
    }, [])

    const toggleIsRunning = () => {
        setIsRunning(!isRunning);
    }

    // Grid Setup

    const initGrid = (rows: number = ROW_COUNT, cols: number = COL_COUNT): CellType[][] => {
        const startGrid = [];
        for (let row = 0; row < rows; row++) {
            const currentRow = [];
            for (let col = 0; col < cols; col++) {
                currentRow.push(createCell(row, col))
            }
            startGrid.push(currentRow);
        }
        return startGrid;
    }

    const toggleView = () => {
        if (!isRunning) {
            clearGrid();
            clearWalls();
            const desktopView = !isDesktopView;
            let newGrid;
            if (desktopView) {
                newGrid = initGrid();
                setIsDesktopView(desktopView);
                setGrid(newGrid);
            } else {
                if (
                    startCellRow > MOBILE_ROW_COUNT ||
                    endCellRow > MOBILE_ROW_COUNT ||
                    endCellCol > MOBILE_COL_COUNT ||
                    startCellCol > MOBILE_COL_COUNT
                ) {
                    alert('Start & End Cells Must Be within 10 Rows x 20 Columns');
                } else {
                    newGrid = initGrid(
                        MOBILE_ROW_COUNT,
                        MOBILE_COL_COUNT,
                    );
                    setIsDesktopView(desktopView);
                    setGrid(newGrid);
                }
            }
        }
    }

    const createCell = (row: number, col: number) => {
        return {
            row: row,
            col: col,
            isStart:
                row === startRow && col === startCol,
            isEnd:
                row === endRow && col === endCol,
            distance: Infinity,
            distanceToEnd:
                Math.abs(endRow - row) + Math.abs(endCol - col),
            isVisited: false,
            isWall: false,
            previousCell: null,
            isCell: true
        } as CellType
    }

    //  Create controls
    //  Allows dragging to create walls
    const handleMouseDown = (row: number, col: number) => {
        if (!isRunning) {
            if (isGridClear()) {
                if (
                    document.getElementById(`cell-${row}-${col}`)?.className === 'cell cell-start'
                ) {
                    setMouseDown(true);
                    setIsStartCell(true);
                    setCurrRow(row);
                    setCurrCol(col);
                } else if (
                    document.getElementById(`cell-${row}-${col}`)?.className === 'cell cell-end'
                ) {
                    setMouseDown(true);
                    setIsStartCell(true);
                    setCurrRow(row);
                    setCurrCol(col);
                } else {
                    const newGrid = getNewGrid(grid, row, col);
                    setGrid(newGrid);
                    setMouseDown(true);
                    setIsWallCell(true);
                    setCurrRow(row);
                    setCurrCol(col);
                }
            } else {
                clearGrid();
            }
        }
    }

    //  Handles mouse entering cell
    const handleMouseEnter = (row: number, col: number) => {
        if (!isRunning) {
            if (mouseDown) {
                const cellClassName = document.getElementById(`cell-${row}-${col}`)
                    ?.className;
                if (isStartCell) {
                    if (cellClassName !== 'cell cell-wall') {
                        const prevStartCell = grid[currRow][
                            currCol
                        ];
                        prevStartCell.isStart = false;
                        document.getElementById(
                            `cell-${currRow}-${currCol}`
                        )!.className = 'cell';

                        setCurrRow(row);
                        setCurrCol(col);
                        const currStartCell = grid[row][col];
                        currStartCell.isStart = true;
                        document.getElementById(`cell-${row}-${col}`)!.className =
                            'cell cell-start';
                    }
                    setStartRow(row);
                    setStartCol(col);
                } else if (isEndCell) {
                    if (cellClassName !== 'cell cell-wall') {
                        const prevEndCell = grid[currRow][
                            currCol
                        ];
                        prevEndCell.isEnd = false;
                        document.getElementById(
                            `cell-${currRow}-${currCol}`,
                        )!.className = 'cell';

                        setCurrRow(row);
                        setCurrCol(col);
                        const currEndCell = grid[row][col];
                        currEndCell.isEnd = true;
                        document.getElementById(`cell-${row}-${col}`)!.className =
                            'cell cell-end';
                    }
                    setEndRow(row);
                    setEndCol(col);
                } else if (isWallCell) {
                    const newGrid = getNewGrid(grid, row, col);
                    setGrid(newGrid)
                }
            }
        }
    }

    //  Handles mouse not being pressed anymore
    const handleMouseUp = (row: number, col: number) => {
        if (!isRunning) {
            setMouseDown(false);
            if (isStartCell) {
                const startCell: any = !isStartCell;
                setIsStartCell(startCell);
                setStartCellRow(row);
                setStartCellCol(col);
            } else if (isEndCell) {
                const endCell: any = !isEndCell;
                setIsEndCell(endCell);
                setEndCellRow(row);
                setEndCellCol(col);
            }
            initGrid();
        }
    }

    //  Handles mouse leaving grid
    const handleMouseLeave = () => {
        if (isStartCell) {
            const startCell = !isStartCell;
            setIsStartCell(startCell);
        } else if (isEndCell) {
            const endCell = !isEndCell;
            setIsEndCell(endCell);
        } else if (isWallCell) {
            const wallCell = !isWallCell;
            setIsWallCell(wallCell);
            initGrid();
        }
        setMouseDown(false);
    }

    const isGridClear = (): boolean => {
        for (const row of grid) {
            for (const cell of row) {
                const cellClassName = document.getElementById(
                    `cell-${cell.row}-${cell.col}`
                )?.className;
                if (
                    cellClassName === 'cell cell-visited' ||
                    cellClassName === 'cell cell-shortest-path'
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    //  Gets new grid with walls
    const getNewGrid = (grid: CellType[][], row: number, col: number) => {
        const newGrid = grid.slice();
        const cell = newGrid[row][col];
        if (!cell.isStart && !cell.isEnd && cell.isCell) {
            const newCell = {
                ...cell,
                isWall: !cell.isWall,
            };
            newGrid[row][col] = newCell;
        }
        return newGrid;
    }

    //  Removes all color/animation from grid
    const clearGrid = () => {
        if (!isRunning) {
            const newGrid = grid.slice();
            for (const row of newGrid) {
                for (const cell of row) {
                    let cellClassName = document.getElementById(
                        `cell-${cell.row}-${cell.col}`,
                    )?.className;
                    if (
                        cellClassName !== 'cell cell-start' &&
                        cellClassName !== 'cell cell-end' &&
                        cellClassName !== 'cell cell-wall'
                    ) {
                        document.getElementById(`cell-${cell.row}-${cell.col}`)!.className =
                            'cell';
                        cell.isVisited = false;
                        cell.distance = Infinity;
                        cell.distanceToEnd =
                            Math.abs(endCellRow - cell.row) +
                            Math.abs(endCellCol - cell.col);
                    }
                    if (cellClassName === 'cell cell-end') {
                        cell.isVisited = false;
                        cell.distance = Infinity;
                        cell.distanceToEnd = 0;
                    }
                    if (cellClassName === 'cell cell-start') {
                        cell.isVisited = false;
                        cell.distance = Infinity;
                        cell.distanceToEnd =
                            Math.abs(endCellRow - cell.row) +
                            Math.abs(endCellCol - cell.col);
                        cell.isStart = true;
                        cell.isWall = false;
                        cell.previousCell = null;
                        cell.isCell = true;
                    }
                }
            }
        }
    }

    //  Removes walls
    const clearWalls = () => {
        const newGrid = grid.slice();
        for (const row of newGrid) {
            for (const cell of row) {
                let cellClassName = document.getElementById(`cell-${cell.row}-${cell.col}`)?.className;
                if (cellClassName === 'cell cell-wall') {
                    document.getElementById(`cell-${cell.row}-${cell.col}`)!.className = 'cell';
                    cell.isWall = false;
                }
            }
        }
    }

    //  Takes algo, returns cells in order of visit, animates
    const visualize = (algorithm: string) => {
        if (!isRunning) {
            clearGrid();
            toggleIsRunning();
            const startCell = grid[startCellRow][startCellCol];
            const endCell = grid[endCellRow][endCellCol];
            let visitedCellsInOrder;
            switch (algorithm) {
                case 'AStar':
                    visitedCellsInOrder = AStar(grid, startCell, endCell);
                    break;
                case 'Dijkstra':
                    visitedCellsInOrder = dijkstra(grid, startCell, endCell);
                    break;
                case 'BFS':
                    visitedCellsInOrder = bfs(grid, startCell, endCell);
                    break;
                case 'DFS':
                    visitedCellsInOrder = dfs(grid, startCell, endCell);
                    break;
                default:
                    break;
            }
            const cellsInOrder = getCellsInOrder(endCell);
            cellsInOrder.push('end');
            animate(visitedCellsInOrder, cellsInOrder);
        }
    }

    //  Handles animation of algo
    const animate = (visitedCellsInOrder: any, cellsInPathOrdered: any) => {
        for (let i = 0; i <= visitedCellsInOrder.length; i++) {
            if (i === visitedCellsInOrder.length) {
                setTimeout(() => {
                    animateShortest(cellsInPathOrdered);
                }, i * 5);
                return;
            }
            setTimeout(() => {
                const cell = visitedCellsInOrder[i];
                const cellClassName = document.getElementById(
                    `cell-${cell.row}-${cell.col}`,
                )?.className;
                if (
                    cellClassName !== 'cell cell-start' &&
                    cellClassName !== 'cell cell-end'
                ) {
                    document.getElementById(`cell-${cell.row}-${cell.col}`)!.className =
                        'cell cell-visited';
                }
            }, i * 5);
        }
    }

    //  Handles animation of shortest path
    const animateShortest = (cellsInShortestPathOrder: any) => {
        for (let i = 0; i < cellsInShortestPathOrder.length; i++) {
            if (cellsInShortestPathOrder[i] === 'end') {
                setTimeout(() => {
                    toggleIsRunning();
                }, i * 5);
            } else {
                setTimeout(() => {
                    const cell = cellsInShortestPathOrder[i];
                    const cellClassName = document.getElementById(
                        `cell-${cell.row}-${cell.col}`,
                    )?.className;
                    if (
                        cellClassName !== 'cell cell-start' &&
                        cellClassName !== 'cell cell-end'
                    ) {
                        document.getElementById(`cell-${cell.row}-${cell.col}`)!.className =
                            'cell cell-shortest-path';
                    }
                }, i * 15);
            }
        }
    }

    //  Takes list of cells in shortest path, orders them from start to end
    const getCellsInOrder = (endCell: any) => {
        const cellsInShortestPathOrder = [];
        let currCell = endCell;
        while (currCell != null) {
            cellsInShortestPathOrder.unshift(currCell);
            currCell = currCell.previousCell;
        }
        return cellsInShortestPathOrder
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
                <a className="navbar-brand" href="/">
                    <b>Path Finding Vizualized</b>
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="http://www.github.com/derekmarshall855/path-finding-visualized">
                                {' '}
                                Link to code{' '}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://github.com/derekmarshall855">
                                My Other Projects
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://derekmarshall.net">
                                Portfolio
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <table
                className="grid-container"
                onMouseLeave={() => handleMouseLeave()}>
                <tbody className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <tr key={rowIdx}>
                                {row.map((cell, cellIdx) => {
                                    const { row, col, isEnd, isStart, isWall } = cell;
                                    return (
                                        <Cell
                                            key={cellIdx}
                                            col={col}
                                            isEnd={isEnd}
                                            isStart={isStart}
                                            isWall={isWall}
                                            onMouseDown={(row: number, col: number) =>
                                                handleMouseDown(row, col)
                                            }
                                            onMouseEnter={(row: number, col: number) =>
                                                handleMouseEnter(row, col)
                                            }
                                            onMouseUp={() => handleMouseUp(row, col)}
                                            row={row}></Cell>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button
                type="button"
                className="btn btn-danger"
                onClick={() => clearGrid()}>
                Clear Grid
            </button>
            <button
                type="button"
                className="btn btn-warning"
                onClick={() => clearWalls()}>
                Clear Walls
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => visualize('Dijkstra')}>
                Dijkstra's
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => visualize('AStar')}>
                A*
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => visualize('BFS')}>
                Bread First Search
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => visualize('DFS')}>
                Depth First Search
            </button>
            {isDesktopView ? (
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => toggleView()}>
                    Mobile View
                </button>
            ) : (
                <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => toggleView()}>
                    Desktop View
                </button>
            )}
        </div>
    );
}

export default Grid;
