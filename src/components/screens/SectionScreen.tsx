import React from "react";
import type { SectionScreenProperties } from "../../types";

export interface SectionScreenProps {
	properties: SectionScreenProperties;
	onNext: () => void;
}

export function SectionScreen({ properties, onNext }: SectionScreenProps) {
	const { title, description, backgroundImage, buttonText = "Continue" } = properties;

	return (
		<div
			className="lf-screen lf-section-screen"
			style={
				backgroundImage
					? {
							backgroundImage: `url(${backgroundImage})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}
					: undefined
			}
		>
			{/* Overlay for readability when background image is present */}
			{backgroundImage && <div className="lf-section-overlay" />}

			<div className="lf-section-content">
				{/* Title */}
				<h1 className="lf-screen-title lf-section-title">{title}</h1>

				{/* Description */}
				{description && (
					<p className="lf-screen-description lf-section-description">
						{description}
					</p>
				)}

				{/* Continue button */}
				<button type="button" className="lf-button" onClick={onNext}>
					{buttonText}
				</button>
			</div>
		</div>
	);
}
