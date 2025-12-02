import React, { useEffect, useRef } from 'react';
import { HexGrid, Layout, Hexagon, Text, Pattern, Path } from 'react-hexgrid';
import { TransformWrapper, TransformComponent, useControls, } from "react-zoom-pan-pinch";
import HexTile from './HexTile';
import OverlayTile from './OverlayTile';
import { TerrainType, terrainColors, terrainList } from './terrain';
import * as d3 from "d3";

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

function generateEnvironment(hexes: Hex[], radius: number) {
    // Goal is to generate terrain over the whole map. Notably, a lot of it should be continuous
    for (const terrain of terrainList) {
        if (terrain == "asteroid" || terrain == "nebula") {
            floodFill(terrain, hexes, radius / 2, 0.4);
        }
        else {
            let num = Math.floor(Math.random() * 10);
            for (let i = 0; i < num; i++) {
                const temp = hexes[Math.floor(Math.random() * hexes.length)];
                if (temp.type === "asteroid" || temp.type === "nebula" || temp.type === "empty") {
                    temp.type = terrain;
                } else {
                    i--;
                }
            }
        }
    }
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
    generateEnvironment(hexes, radius);
    return hexes;
}




type HexMapProps = {
    windowWidth: number;
    windowHeight: number;
};

const HexMap: React.FC<HexMapProps> = ({ windowWidth, windowHeight }) => {
    const radius = 8;
    const baseScale = 50; // smaller = zoom in more
    const hexSize = Math.min(windowWidth, windowHeight) / (radius * baseScale);

    const [selected, setSelected] = React.useState<{ q: number; r: number; s: number } | null>(null);

    // memoize generation so it doesn't regen every render
    const hexes = React.useMemo(() => generateHexMap(radius), [radius]);




    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <HexGrid width={windowWidth} height={windowHeight}>
                <Layout size={{ x: hexSize, y: hexSize }} flat={false} spacing={1.05}>
                    {hexes.map((hex, i) => (
                        <HexTile
                            hexSize={hexSize}
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
                            onClick={() => {
                                console.log(`i'm clicked! My coordinates are (${hex.q}, ${hex.r})`);
                                setSelected((prev) =>
                                    prev &&
                                        prev.q === hex.q &&
                                        prev.r === hex.r &&
                                        prev.s === hex.s
                                        ? null
                                        : { q: hex.q, r: hex.r, s: hex.s }
                                );
                            }}
                        />
                    ))}
                </Layout>
            </HexGrid>
            <HexGrid width={windowWidth} height={windowHeight}>
                <Layout size={{ x: hexSize, y: hexSize }} flat={false} spacing={1.05}>
                    {hexes.map((hex, i) => (
                        <OverlayTile
                            key={`ov-${hex.q}-${hex.r}`}
                            q={hex.q}
                            r={hex.r}
                            s={hex.s}
                            isSelected={false}
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
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '900px',   // pick your fixed size
                    height: '800px',
                    transform: 'translate(-50%, -50%)',
                    border: '3px solid #00ff88',
                    pointerEvents: 'none',  // don’t block clicks on map
                    boxShadow: '0 0 20px rgba(0,255,136,0.5)',
                }}
            />
        </div>
    );
};

export default HexMap;