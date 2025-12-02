import React from 'react';
import { Hexagon, Text } from "react-hexgrid";
import { TerrainType, terrainColors, terrainList } from './terrain';

type HexTileProps = {
    hexSize: number;
    q: number;
    r: number;
    s: number;
    type: TerrainType;
    isSelected: boolean;
    onClick: () => void;
}
const HexTile: React.FC<HexTileProps> = React.memo(
    ({ q, r, s, type, isSelected, onClick }) => {
        const fill = terrainColors[type];

        return (
            <Hexagon
                q={q}
                r={r}
                s={s}
                onClick={onClick}
                style={{
                    fill,
                    stroke: isSelected ? "#facc15" : "#222",
                    strokeWidth: isSelected ? 0.1 : 0.05,
                    transition: "stroke 0.1s ease",
                    cursor: "pointer",
                }}
            >
                <Text style={{ fill: "#fff", fontSize: "0.05em", }}>
                    {q},{r}
                </Text>
            </Hexagon>
        );
    },
    (prev, next) =>
        prev.isSelected === next.isSelected &&
        prev.type === next.type &&
        prev.q === next.q &&
        prev.r === next.r &&
        prev.s === next.s
);

export default HexTile;