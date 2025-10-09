import React from 'react';
import { HexGrid, Layout, Hexagon, Text, Pattern, Path } from 'react-hexgrid';
import { TransformWrapper, TransformComponent, useControls, } from "react-zoom-pan-pinch";

const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div className="tools">
            <button onClick={() => zoomIn()}>+</button>
            <button onClick={() => zoomOut()}>-</button>
            <button onClick={() => resetTransform()}>x</button>
        </div>
    );
};


function generateHexMap(radius: number) {
    const hexes: Hex[] = [];
    for (let q = -radius; q <= radius; q++) {
        for (let r = -radius; r <= radius; r++) {
            let s = Math.abs(q + r);
            if (s <= radius) {
                const type = terrainList[Math.floor(Math.random() * terrainList.length)] as terrainTypes;
                hexes.push({ q, r, s, type });
            }
        }
    }
    return hexes;
}

const terrainColors = {
    empty: "#1b1d29",
    asteroid: "#d78424ff",
    planet: "#3069f1",
    nebula: "#7e3ff2",
    warp: "#acb3e0ff",
    research: "#227e2cff",
    hangar: "#cb2e2eff",
    defense: "#777777ff"
};

// More to be added eventually
type terrainTypes = "empty" | "asteroid" | "nebula" | "warp" | "research" | "hangar" | "defense";
const terrainList = ["empty", "asteroid", "nebula", "warp", "research", "hangar", "defense"];

type Hex = {
    q: number;
    r: number;
    s: number;
    type: terrainTypes;
}

const HexMap: React.FC = () => {
    const radius = 20;
    const [selected, setSelected] = React.useState<{ q: number; r: number; s: number } | null>(null);

    // memoize generation so it doesn't regen every render
    const hexes = React.useMemo(() => generateHexMap(radius), [radius]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <TransformWrapper
                initialScale={4}
                minScale={1}
                maxScale={5}
                wheel={{ step: 0.1 }}
            >
                <TransformComponent>
                    <HexGrid viewBox="-200 -200 400 400">
                        <Layout size={{ x: 2.5, y: 2.5 }} flat={false} spacing={1.05} origin={{ x: 0, y: 0 }}>
                            {hexes.map((hex, i) => {
                                const isSelected =
                                    selected &&
                                    selected.q === hex.q &&
                                    selected.r === hex.r &&
                                    selected.s === hex.s;
                                const key = `${hex.q},${hex.r}`;
                                const fill = terrainColors[hex.type]; // safe: hex.type is TerrainType
                                return (
                                    <Hexagon
                                        key={i}
                                        q={hex.q}
                                        r={hex.r}
                                        s={hex.s}
                                        onClick={() => setSelected((prev) => {
                                            if (prev && prev.q == hex.q && prev.r == hex.r && prev.s == hex.s) {
                                                return null;
                                            }
                                            return { q: hex.q, r: hex.r, s: hex.s };
                                        })}
                                        style={{
                                            fill,
                                            border: "0.5px solid",
                                            stroke: isSelected ? "#facc15" : "#222",
                                            strokeWidth: 0.1,
                                            transition: "stroke 0.1s ease",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Text style={{ fill: "#fff", fontSize: "0.1em" }}>
                                            {hex.q},{hex.r}
                                        </Text>
                                    </Hexagon>
                                );
                            })}
                        </Layout>
                    </HexGrid>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
};

export default HexMap;