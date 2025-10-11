import React from 'react';
import { Hexagon, Text } from "react-hexgrid";
import { TerrainType, terrainColors, terrainList } from './terrain';

type HexTileProps = {
    q: number;
    r: number;
    s: number;
    type: TerrainType;
    isSelected: boolean;
    onClick: () => void;
}
/*
const HexTile: React.FC<HexTileProps> = React.memo(({ q, r, s, type, isSelected, onClick }) => {
    const fill = terrainColors[type];
    return (
        <div>
            <Hexagon q={q} r={r} s={s} onClick={onClick}
                style={{
                    fill,
                    border: "0.5px solid",
                    stroke: isSelected ? "#facc15" : "#222",
                    strokeWidth: 0.05,
                    fontSize: "20%",
                    transition: "stroke 0.1s ease",
                    cursor: "pointer",
                }}
            >
                <Text style={{ fill: "#fff", fontSize: "0.1em" }}>
                    {q},{r}
                </Text>
            </Hexagon>
        </div>
    );
});
*/
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