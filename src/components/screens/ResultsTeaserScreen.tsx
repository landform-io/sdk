import React from "react";
import type { ResultsTeaserProperties } from "../../types";

export interface ResultsTeaserScreenProps {
	properties: ResultsTeaserProperties;
	onNext: () => void;
}

export function ResultsTeaserScreen({
	properties,
	onNext,
}: ResultsTeaserScreenProps) {
	const { title, teaserText, buttonText = "See My Results" } = properties;

	return (
		<div className="lf-screen lf-results-teaser-screen">
			{/* Title */}
			<h1 className="lf-screen-title lf-results-teaser-title">{title}</h1>

			{/* Teaser text */}
			{teaserText && (
				<p className="lf-screen-description lf-results-teaser-text">
					{teaserText}
				</p>
			)}

			{/* Continue button */}
			<button type="button" className="lf-button" onClick={onNext}>
				{buttonText}
			</button>
		</div>
	);
}
