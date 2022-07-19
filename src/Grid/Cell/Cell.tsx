import React, { FC, SyntheticEvent, useState } from 'react';




const Cell: FC = () => {
    const [currentColor, setCurrentColor] = useState('white');
    const getCurrentColor = () => {
        currentColor === 'white' ? setCurrentColor('black') : setCurrentColor('white');
    }
    const setStart = (e: any) => {
        e.preventDefault();

    }

    return (
        <td style={{
            width: "4em",
            height: "4em",
            border: "2px solid #ddd",
            backgroundColor: currentColor
        }} onClick={() => getCurrentColor()}
            onContextMenu={setStart}></td>
    )
}

export default Cell;
