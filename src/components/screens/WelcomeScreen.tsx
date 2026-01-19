import React from "react";
import type { WelcomeScreen as WelcomeScreenType } from "../../types";

export interface WelcomeScreenProps {
	screen: WelcomeScreenType;
	onStart?: () => void;
}

export function WelcomeScreen({ screen, onStart }: WelcomeScreenProps) {
	const { title, properties, attachment } = screen;

	return (
		<div className="text-center" style={{ display: "flex", flexDirection: "column", gap: "var(--lf-spacing-question)" }}>
			{attachment && attachment.type === "image" && (
				<img
					src={attachment.href}
					alt={attachment.properties?.description || ""}
					style={{ maxWidth: "100%", maxHeight: "300px", marginLeft: "auto", marginRight: "auto" }}
				/>
			)}

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
						onClick={onStart}
						className="lf-button px-8 py-4 text-lg"
					>
						{properties.buttonText || "Start"}
					</button>
				</div>
			)}
		</div>
	);
}
