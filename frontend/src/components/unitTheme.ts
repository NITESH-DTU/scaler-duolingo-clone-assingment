export interface UnitTheme {
  main: string; // face colour
  edge: string; // darker 3D bottom edge
  ring: string; // soft ring around the active node
}

// Duolingo cycles a colour per unit.
export const UNIT_THEMES: UnitTheme[] = [
  { main: "#58cc02", edge: "#58a700", ring: "#d7ffb8" }, // green
  { main: "#1cb0f6", edge: "#1899d6", ring: "#ddf4ff" }, // blue
  { main: "#ce82ff", edge: "#a568cc", ring: "#f3e1ff" }, // purple
  { main: "#ff9600", edge: "#cd7900", ring: "#ffe8c4" }, // orange
];

export function getUnitTheme(index: number): UnitTheme {
  return UNIT_THEMES[index % UNIT_THEMES.length];
}
