import React from 'react';
import { Hexagon, Text } from "react-hexgrid";


type OverlayTileProps = {
    q: number;
    r: number;
    s: number;
    isSelected: boolean;
    onClick: () => void;
}

type Ship = {
    size: number;
    class: string;
    maxShield: number;
    maxHull: number;
    shield: number;
    hull: number;
};

const OverlayTile: React.FC<OverlayTileProps> = ({ q, r, s, isSelected, onClick }) => {
    const [contents, setContents] = React.useState(null);
    return (
        <Hexagon
            q={q}
            r={r}
            s={s}
            onClick={onClick}
            style={{
                strokeWidth: isSelected ? 0.1 : 0.05,
                transition: "stroke 0.1s ease",
                cursor: "pointer",
                fill: 'transparent'
            }}
        >
        </Hexagon>
    );
}
export default OverlayTile;