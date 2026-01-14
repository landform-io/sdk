import React from "react";
import type { WelcomeScreen as WelcomeScreenType } from "../../types";

export interface WelcomeScreenProps {
	screen: WelcomeScreenType;
	onStart: () => void;
}

export function WelcomeScreen({ screen, onStart }: WelcomeScreenProps) {
	const { title, properties, attachment } = screen;

	return (
		<div className="lf-screen">
			{attachment && attachment.type === "image" && (
				<img
					src={attachment.href}
					alt={attachment.properties?.description || ""}
					style={{ maxWidth: "100%", maxHeight: "300px", marginBottom: "2rem" }}
				/>
			)}

			<h1 className="lf-screen-title">{title}</h1>

			{properties.description && (
				<p className="lf-screen-description">{properties.description}</p>
			)}

			{properties.showButton && (
				<button type="button" className="lf-button" onClick={onStart}>
					{properties.buttonText || "Start"}
				</button>
			)}
		</div>
	);
}
