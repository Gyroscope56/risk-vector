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


function generateHexMap(radius: number) {
    const hexes: Hex[] = [];
    for (let q = -radius; q <= radius; q++) {
        for (let r = -radius; r <= radius; r++) {
            let s = Math.abs(q + r);
            if (s <= radius) {
                const type = terrainList[Math.floor(Math.random() * terrainList.length)];
                hexes.push({ q, r, s, type });
            }
        }
    }
    return hexes;
}



type Hex = {
    q: number;
    r: number;
    s: number;
    type: TerrainType;
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