import React from "react";
import type { ThankYouScreen as ThankYouScreenType } from "../../types";

export interface ThankYouScreenProps {
	screen: ThankYouScreenType;
	onButtonClick?: () => void;
}

export function ThankYouScreen({ screen, onButtonClick }: ThankYouScreenProps) {
	const { title, properties, attachment } = screen;

	const handleButtonClick = () => {
		if (onButtonClick) {
			onButtonClick();
			return;
		}
		// Default behavior
		switch (properties.buttonMode) {
			case "reload":
				window.location.reload();
				break;
			case "redirect":
				if (properties.redirectUrl) {
					window.location.href = properties.redirectUrl;
				}
				break;
			default:
				break;
		}
	};

	return (
		<div className="text-center" style={{ display: "flex", flexDirection: "column", gap: "var(--lf-spacing-question)" }}>
			{attachment && attachment.type === "image" && (
				<img
					src={attachment.href}
					alt={attachment.properties?.description || ""}
					style={{ maxWidth: "100%", maxHeight: "300px", marginLeft: "auto", marginRight: "auto" }}
				/>
			)}

			<div className="lf-success-icon w-20 h-20 mx-auto flex items-center justify-center">
				<svg
					className="w-10 h-10"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
			</div>

			<h1 className="lf-question-title text-4xl md:text-5xl">
				{title}
			</h1>

			{properties.description && (
				<p className="lf-question-description text-xl">
					{properties.description}
				</p>
			)}

			{properties.showButton && (
				<div>
					<button
						type="button"
						onClick={handleButtonClick}
						className="lf-button px-8 py-4 text-lg"
					>
						{properties.buttonText || "Submit another response"}
					</button>
				</div>
			)}
		</div>
	);
}
