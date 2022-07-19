import React, { FC, useEffect, useState } from 'react';

interface Cell {
    row: number,
    col: number,
    isStart: boolean,
    isEnd: boolean,
    distance: number,
    distanceToEnd: number,
    isVisited: boolean,
    isWall: boolean,
    previousCell: Cell | null,
    isCell: boolean
}

const Grid: FC = () => {
    //  Set state for grid and cell statuses
    const [grid, setGrid] = useState();
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
    const ROW_COUNT = 25;
    const COL_COUNT = 25;

    useEffect(() => {
        const startGrid = initGrid(30, 30);
        setGrid(startGrid);
    }, [])

    const toggleIsRunning = () => {
        setIsRunning(!isRunning);
    }

    // Grid Setup

    const initGrid = (rows: number, cols: number): Cell[][] => {
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
        } as Cell
    }

    //  Create controls
    //  Allows dragging to create walls
    const handleMouseDown = (row: number, col: number) => {
        if (!isRunning) {
            if (isGridClear()) {
                if (
                    document.getElementById(`node-${row}-${col}`)?.className === 'cell cell-start'
                ) {
                    setMouseDown(true);
                    setIsStartCell(true);
                    setCurrRow(row);
                    setCurrCol(col);
                } else if (
                    document.getElementById(`node-${row}-${col}`)?.className === 'cell cell-finish'
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
    const handleMouseEnter = () => {
        return;
    }

    //  Handles mouse not being pressed anymore
    const handleMouseUp = () => {
        return;
    }

    //  Handles mouse leaving grid
    const handleMouseLeave = () => {

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
    const getNewGrid = () => {
        return;
    }

    //  Removes all color/animation from grid
    const clearGrid = () => {
        return;
    }

    //  Removes walls
    const clearWalls = () => {
        return;
    }

    //  Takes algo, returns nodes in order of visit, animates
    const visualize = () => { }

    //  Handles animation of algo
    const animate = () => { }

    //  Handles animation of shortest path
    const animateShortest = () => { }

    //  Takes list of cells in shortest path, orders them from start to finish
    const getCellsInOrder = () => {

    }

    return (
        <table>
            <tbody>

            </tbody>
        </table>
    )
}

export default Grid;
