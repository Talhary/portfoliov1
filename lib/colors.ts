/**
 * Unified Color Configuration System
 * 
 * Modifying colors in this file will automatically update them across:
 * 1. Tailwind configuration (`tailwind.config.ts`)
 * 2. Global styles & webkit scrollbars (`app/globals.css` via Layout-injected CSS Variables)
 * 3. React components (SVGs, charts, loading spinners, icons)
 */

export const themeColors = {
  primary: "#e49505",
  primaryHover: "#c98304",
  bigCard: "#1e1e1e",
  cardBg: "#32312f",
  cardLightBg: "#32312f",
  cardBg1: "#282828",
  cardBg2: "#222224",
  cardBg3: "#1a1a1c",
  sliderBg: "#353537",
} as const;

/**
 * Helper to convert HEX color string to RGB format (e.g. "228, 149, 5")
 * This is useful for opacity/rgba values in CSS/Inline styles.
 */
export function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0, 0, 0";
}
