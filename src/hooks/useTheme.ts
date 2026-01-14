import { useEffect, useMemo, useContext, createContext } from "react";
import type { FormTheme } from "../types";
import type React from "react";
import { generateThemeCSS, generateComponentStyles } from "../theme/generateCSS";
import { injectThemeCSS, isBrowser } from "../theme/injection";

// Theme context for nested components
export const ThemeContext = createContext<FormTheme | null>(null);

export function useThemeContext(): FormTheme {
	const theme = useContext(ThemeContext);
	if (!theme) {
		throw new Error("useThemeContext must be used within a ThemeProvider");
	}
	return theme;
}

export interface UseThemeOptions {
	theme: FormTheme;
	inject?: boolean; // Whether to inject CSS (default: true on client)
}

export interface UseThemeReturn {
	theme: FormTheme;
	cssVariables: string;
	componentStyles: string;
	backgroundStyle: React.CSSProperties;
}

export function useTheme(options: UseThemeOptions): UseThemeReturn {
	const { theme, inject = true } = options;

	// Generate CSS
	const cssVariables = useMemo(() => generateThemeCSS(theme), [theme]);
	const componentStyles = useMemo(() => generateComponentStyles(), []);

	// Inject CSS on client
	useEffect(() => {
		if (inject && isBrowser()) {
			const cleanup = injectThemeCSS(theme);
			return cleanup;
		}
	}, [theme, inject]);

	// Background styles
	const backgroundStyle = useMemo<React.CSSProperties>(() => {
		const bg = theme.background;
		switch (bg.type) {
			case "gradient":
				return { background: bg.value };
			case "image":
				return {
					backgroundImage: `url(${bg.value})`,
					backgroundSize: "cover",
					backgroundPosition: bg.position || "center",
				};
			case "video":
				// Video backgrounds need to be handled differently (with a video element)
				return {};
			default:
				return {};
		}
	}, [theme.background]);

	return {
		theme,
		cssVariables,
		componentStyles,
		backgroundStyle,
	};
}
