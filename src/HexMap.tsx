import React from 'react';
import { HexGrid, Layout, Hexagon, Text, Pattern, Path } from 'react-hexgrid';
import { TransformWrapper, TransformComponent, useControls, } from "react-zoom-pan-pinch";
import HexTile from './HexTile';
import { TerrainType, terrainColors, terrainList } from './terrain';


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


type Hex = {
    q: number;
    r: number;
    s: number;
    type: TerrainType;
}

const HEX_DIRECTIONS = [
    { q: 0, r: -1 },
    { q: 1, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
    { q: 1, r: 0 },
    { q: 1, r: -1 }
];

function getNeighbors(hex: Hex, hexMap: Hex[]): Hex[] {
    return HEX_DIRECTIONS.map((dir) => {
        const neighbor = {
            q: hex.q + dir.q,
            r: hex.r + dir.r
        };
        return hexMap.find(h => h.q == neighbor.q && h.r == neighbor.r);
    }).filter(Boolean) as Hex[];
}

function generateEnvironment(hexes: Hex[]) {
    // Goal is to generate terrain over the whole map. Notably, a lot of it should be continuous
    for (const terrain of terrainList) {
        if (terrain == "asteroid" || terrain == "nebula") {
            floodFill(terrain, hexes, 10, 0.4);
        }
        else {

        }
    }
    /*
    const temp = hexes.find(h => h.q == 0 && h.r == 0);
    if (temp == undefined) {
        return;
    }
    console.log(getNeighbors(temp, hexes))
    */
}

function floodFill(terrain: TerrainType, hexes: Hex[], iterations: number, spreadChance: number) {
    let start = hexes[Math.floor(Math.random() * hexes.length)];
    let frontier = [start];
    const visited = new Set<string>([`${start.q},${start.r}`]);
    let attempts = 0;
    for (let i = 0; i < iterations; i++) {
        if (frontier.length == 1 && frontier[0] == start) {
            // Check if start is too close to something.
            const sNeighbors = getNeighbors(start, hexes);
            if (sNeighbors.some((sn) => sn.type !== "empty" && sn.type !== terrain) && attempts < 10) {
                start = hexes[Math.floor(Math.random() * hexes.length)];
                frontier = [start];
                attempts++;
                i--;
                continue;
            }
            if (attempts >= 10) {
                return;
            }
            start.type = terrain;
        }
        const newFrontier: Hex[] = [];
        for (const hex of frontier) {
            const neighbors = getNeighbors(hex, hexes);
            for (const n of neighbors) {
                if (visited.has(`${n.q},${n.r}`)) continue;

                // Too close check
                const nNeighbors = getNeighbors(n, hexes);
                if (nNeighbors.some((nn) =>
                    nn.type !== "empty" &&
                    nn.type !== terrain
                )) {
                    continue;
                }
                if (Math.random() <= spreadChance && n.type == "empty") {
                    n.type = terrain;
                    newFrontier.push(n);
                    visited.add(`${n.q},${n.r}`);
                }
            }
        }
        frontier = newFrontier;
        if (frontier.length == 0) break;
    }
}

function generateHexMap(radius: number) {
    const hexes: Hex[] = [];
    for (let q = -radius; q <= radius; q++) {
        for (let r = -radius; r <= radius; r++) {
            let s = Math.abs(q + r);
            // Generation of type
            const type = terrainList[0];
            if (s <= radius) {
                hexes.push({ q, r, s, type });
            }
        }
    }
    generateEnvironment(hexes);
    return hexes;
}




type HexMapProps = {
    windowWidth: number;
    windowHeight: number;
};

const HexMap: React.FC<HexMapProps> = ({ windowWidth, windowHeight }) => {
    const radius = 20;
    const [selected, setSelected] = React.useState<{ q: number; r: number; s: number } | null>(null);

    // memoize generation so it doesn't regen every render
    const hexes = React.useMemo(() => generateHexMap(radius), [radius]);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            <TransformWrapper minScale={0.5} maxScale={5} wheel={{ step: 0.1 }}>
                <TransformComponent>
                    <HexGrid width={windowWidth} height={windowHeight}>
                        <Layout size={{ x: 1, y: 1 }} flat={false} spacing={1.05} origin={{ x: 0, y: 0 }}>
                            {hexes.map((hex, i) => (
                                <HexTile
                                    key={i}
                                    q={hex.q}
                                    r={hex.r}
                                    s={hex.s}
                                    type={hex.type}
                                    isSelected={
                                        !!selected &&
                                        selected.q === hex.q &&
                                        selected.r === hex.r &&
                                        selected.s === hex.s
                                    }
                                    onClick={() =>
                                        setSelected((prev) =>
                                            prev &&
                                                prev.q === hex.q &&
                                                prev.r === hex.r &&
                                                prev.s === hex.s
                                                ? null
                                                : { q: hex.q, r: hex.r, s: hex.s }
                                        )
                                    }
                                />
                            ))}
                        </Layout>
                    </HexGrid>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
};


export default HexMap;