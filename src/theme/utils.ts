// ============================================================================
// Color Manipulation Utilities
// ============================================================================

/**
 * Parse hex color to RGB components
 */
export function hexToRgb(
	hex: string,
): { r: number; g: number; b: number } | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
	return (
		"#" +
		[r, g, b]
			.map((x) => {
				const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
				return hex.length === 1 ? "0" + hex : hex;
			})
			.join("")
	);
}

/**
 * Darken a color by a percentage (0-1)
 */
export function darken(color: string, amount: number): string {
	const rgb = hexToRgb(color);
	if (!rgb) return color;

	return rgbToHex(
		rgb.r * (1 - amount),
		rgb.g * (1 - amount),
		rgb.b * (1 - amount),
	);
}

/**
 * Lighten a color by a percentage (0-1)
 */
export function lighten(color: string, amount: number): string {
	const rgb = hexToRgb(color);
	if (!rgb) return color;

	return rgbToHex(
		rgb.r + (255 - rgb.r) * amount,
		rgb.g + (255 - rgb.g) * amount,
		rgb.b + (255 - rgb.b) * amount,
	);
}

/**
 * Adjust opacity of a color, returning rgba string
 */
export function adjustOpacity(color: string, opacity: number): string {
	const rgb = hexToRgb(color);
	if (!rgb) return color;

	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Calculate contrasting text color (black or white)
 */
export function getContrastColor(backgroundColor: string): string {
	const rgb = hexToRgb(backgroundColor);
	if (!rgb) return "#000000";

	// Calculate relative luminance
	const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
	return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
