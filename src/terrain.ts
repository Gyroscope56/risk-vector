// src/types/terrain.ts
export const terrainColors = {
    empty: "#1b1d29",
    asteroid: "#d78424ff",
    planet: "#3069f1",
    nebula: "#7e3ff2",
    warp: "#acb3e0ff",
    research: "#227e2cff",
    hangar: "#cb2e2eff",
    defense: "#777777ff"
};

export type TerrainType = keyof typeof terrainColors;

export const terrainList: TerrainType[] = [
    "empty",
    "asteroid",
    "nebula",
    "warp",
    "research",
    "hangar",
    "defense",
];