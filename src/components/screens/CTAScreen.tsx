import React from "react";
import type { CTAScreenProperties } from "../../types";

export interface CTAScreenProps {
	properties: CTAScreenProperties;
	onNext: () => void;
	onNavigate?: (url: string) => void;
}

export function CTAScreen({ properties, onNext, onNavigate }: CTAScreenProps) {
	const {
		title,
		description,
		primaryButtonText,
		primaryButtonUrl,
		secondaryButtonText,
		secondaryContinuesForm,
	} = properties;

	const handlePrimaryClick = () => {
		if (primaryButtonUrl) {
			if (onNavigate) {
				onNavigate(primaryButtonUrl);
			} else {
				window.open(primaryButtonUrl, "_blank", "noopener,noreferrer");
			}
		} else {
			onNext();
		}
	};

	const handleSecondaryClick = () => {
		if (secondaryContinuesForm) {
			onNext();
		}
	};

	return (
		<div className="lf-screen lf-cta-screen">
			{/* Title */}
			<h1 className="lf-screen-title lf-cta-title">{title}</h1>

			{/* Description */}
			{description && (
				<p className="lf-screen-description lf-cta-description">{description}</p>
			)}

			{/* Buttons */}
			<div className="lf-cta-buttons">
				<button
					type="button"
					className="lf-button lf-cta-primary-button"
					onClick={handlePrimaryClick}
				>
					{primaryButtonText}
				</button>

				{secondaryButtonText && (
					<button
						type="button"
						className="lf-button lf-button-secondary lf-cta-secondary-button"
						onClick={handleSecondaryClick}
					>
						{secondaryButtonText}
					</button>
				)}
			</div>
		</div>
	);
}
