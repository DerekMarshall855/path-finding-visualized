import React, { FC } from 'react';
import './Cell.css';

interface CellProps {
    col: number,
    row: number,
    isStart: boolean,
    isEnd: boolean,
    isWall: boolean,
    onMouseDown: any,
    onMouseEnter: any,
    onMouseUp: any
}

const Cell: FC<CellProps> = ({ col, row, isStart, isEnd, isWall, onMouseDown, onMouseEnter, onMouseUp }) => {
    const extraClassName = isEnd ? 'cell-end' : isStart ? 'cell-start' : isWall ? 'cell-wall' : '';
    return (
        <td
            id={`cell-${row}-${col}`}
            className={`cell ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}>
        </td >
    )
}

export default Cell;