import type { FormTheme } from "../types";
import { generateThemeStyleTag } from "./generateCSS";

const STYLE_ID = "lf-form-theme-variables";
const CUSTOM_STYLE_ID = "lf-form-custom-css";

/**
 * SSR-safe check if we're in browser
 */
export function isBrowser(): boolean {
	return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Inject theme CSS into document head (client-side only)
 * Returns a cleanup function
 */
export function injectThemeCSS(theme: FormTheme): () => void {
	if (!isBrowser()) {
		return () => {}; // No-op for SSR
	}

	let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

	if (!styleEl) {
		styleEl = document.createElement("style");
		styleEl.id = STYLE_ID;
		document.head.appendChild(styleEl);
	}

	styleEl.textContent = generateThemeStyleTag(theme);

	// Handle custom CSS
	if (theme.customCSS) {
		let customStyleEl = document.getElementById(
			CUSTOM_STYLE_ID,
		) as HTMLStyleElement | null;
		if (!customStyleEl) {
			customStyleEl = document.createElement("style");
			customStyleEl.id = CUSTOM_STYLE_ID;
			document.head.appendChild(customStyleEl);
		}
		customStyleEl.textContent = theme.customCSS;
	}

	// Return cleanup function
	return () => {
		const el = document.getElementById(STYLE_ID);
		if (el) el.remove();
		const customEl = document.getElementById(CUSTOM_STYLE_ID);
		if (customEl) customEl.remove();
	};
}

/**
 * Get theme CSS as a string for SSR injection
 */
export function getThemeCSSForSSR(theme: FormTheme): string {
	return generateThemeStyleTag(theme);
}
