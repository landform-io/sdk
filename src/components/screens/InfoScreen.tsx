import React from "react";
import type { InfoScreenProperties } from "../../types";

export interface InfoScreenProps {
	properties: InfoScreenProperties;
	onNext: () => void;
}

export function InfoScreen({ properties, onNext }: InfoScreenProps) {
	const {
		title,
		description,
		image,
		imagePosition = "top",
		buttonText = "Continue",
	} = properties;

	const layoutClass = `lf-info-screen-${imagePosition}`;

	return (
		<div className={`lf-screen lf-info-screen ${layoutClass}`}>
			{/* Background image mode */}
			{image && imagePosition === "background" && (
				<>
					<div
						className="lf-info-background"
						style={{
							backgroundImage: `url(${image})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
					/>
					<div className="lf-info-overlay" />
				</>
			)}

			{/* Image on top */}
			{image && imagePosition === "top" && (
				<div className="lf-info-image-container lf-info-image-top">
					<img src={image} alt="" className="lf-info-image" />
				</div>
			)}

			{/* Left/right layout container */}
			{(imagePosition === "left" || imagePosition === "right") && (
				<div className="lf-info-split-layout">
					{/* Image on left */}
					{image && imagePosition === "left" && (
						<div className="lf-info-image-container lf-info-image-left">
							<img src={image} alt="" className="lf-info-image" />
						</div>
					)}

					{/* Content */}
					<div className="lf-info-content">
						<h1 className="lf-screen-title lf-info-title">{title}</h1>
						{description && (
							<p className="lf-screen-description lf-info-description">
								{description}
							</p>
						)}
						<button type="button" className="lf-button" onClick={onNext}>
							{buttonText}
						</button>
					</div>

					{/* Image on right */}
					{image && imagePosition === "right" && (
						<div className="lf-info-image-container lf-info-image-right">
							<img src={image} alt="" className="lf-info-image" />
						</div>
					)}
				</div>
			)}

			{/* Content for top/background layouts */}
			{(imagePosition === "top" || imagePosition === "background" || !image) && (
				<div className="lf-info-content">
					<h1 className="lf-screen-title lf-info-title">{title}</h1>
					{description && (
						<p className="lf-screen-description lf-info-description">
							{description}
						</p>
					)}
					<button type="button" className="lf-button" onClick={onNext}>
						{buttonText}
					</button>
				</div>
			)}
		</div>
	);
}
