import React from "react";
import { useThemeContext } from "../../hooks/useTheme";

export function Header() {
	const theme = useThemeContext();

	const headerLayout = theme.componentVariants?.headerLayout;

	// No header if layout is "none" or undefined
	if (!headerLayout || headerLayout === "none") {
		return null;
	}

	const brandName = theme.branding?.brandName;
	const logoUrl = theme.branding?.logoUrl;

	// Centered logo layout (Quiz template style)
	if (headerLayout === "centered-logo") {
		return (
			<header className="lf-header-centered">
				{logoUrl && (
					<img
						src={logoUrl}
						alt={brandName || "Logo"}
						className="lf-header-logo"
					/>
				)}
				{brandName && !logoUrl && (
					<span className="lf-header-brand" style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--lf-color-question)" }}>
						{brandName}
					</span>
				)}
			</header>
		);
	}

	// Left-aligned logo layout
	if (headerLayout === "left-logo") {
		return (
			<header className="lf-header-left" style={{
				display: "flex",
				alignItems: "center",
				padding: "1rem var(--lf-spacing-container)",
				gap: "0.75rem",
			}}>
				{logoUrl && (
					<img
						src={logoUrl}
						alt={brandName || "Logo"}
						className="lf-header-logo"
					/>
				)}
				{brandName && (
					<span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--lf-color-question)" }}>
						{brandName}
					</span>
				)}
			</header>
		);
	}

	return null;
}
