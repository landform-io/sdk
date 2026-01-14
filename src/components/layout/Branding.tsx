import React from "react";
import { useThemeContext } from "../../hooks/useTheme";

export function Branding() {
	const theme = useThemeContext();

	if (!theme.branding.showPoweredBy) {
		return null;
	}

	return (
		<div className="lf-branding">
			Powered by{" "}
			<a href="https://landform.io" target="_blank" rel="noopener noreferrer">
				Landform
			</a>
		</div>
	);
}
