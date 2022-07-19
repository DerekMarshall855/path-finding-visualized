import React, { FC } from 'react';
import Cell from './Cell/Cell';


const Grid: FC = () => {
    return (
        <table>
            <tbody>
                {Array.from({ length: 20 }, _ =>
                    <tr>{Array.from({ length: 20 }, _ => <Cell />)}</tr>
                )}
            </tbody>
        </table>
    )
}

export default Grid;
