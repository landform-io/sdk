import React, { useEffect } from "react";
import type { MilestoneScreenProperties } from "../../types";

export interface MilestoneScreenProps {
	properties: MilestoneScreenProperties;
	progress?: number;
	onNext: () => void;
}

export function MilestoneScreen({
	properties,
	progress,
	onNext,
}: MilestoneScreenProps) {
	const {
		title,
		subtitle,
		showProgress,
		icon,
		autoAdvanceMs,
		buttonText = "Continue",
	} = properties;

	// Auto-advance after delay if configured
	useEffect(() => {
		if (autoAdvanceMs && autoAdvanceMs > 0) {
			const timer = setTimeout(() => {
				onNext();
			}, autoAdvanceMs);
			return () => clearTimeout(timer);
		}
	}, [autoAdvanceMs, onNext]);

	// Determine if icon is an emoji or image URL
	const isImageUrl = icon && (icon.startsWith("http") || icon.startsWith("/"));

	return (
		<div className="lf-screen lf-milestone-screen">
			{/* Icon */}
			{icon && (
				<div className="lf-milestone-icon">
					{isImageUrl ? (
						<img src={icon} alt="" className="lf-milestone-icon-image" />
					) : (
						<span className="lf-milestone-icon-emoji">{icon}</span>
					)}
				</div>
			)}

			{/* Title */}
			<h1 className="lf-screen-title lf-milestone-title">{title}</h1>

			{/* Subtitle */}
			{subtitle && (
				<p className="lf-screen-description lf-milestone-subtitle">{subtitle}</p>
			)}

			{/* Progress indicator */}
			{showProgress && typeof progress === "number" && (
				<div className="lf-milestone-progress">
					<div className="lf-milestone-progress-bar">
						<div
							className="lf-milestone-progress-fill"
							style={{ width: `${Math.round(progress * 100)}%` }}
						/>
					</div>
					<span className="lf-milestone-progress-text">
						{Math.round(progress * 100)}% complete
					</span>
				</div>
			)}

			{/* Continue button (only if not auto-advancing) */}
			{(!autoAdvanceMs || autoAdvanceMs === 0) && (
				<button type="button" className="lf-button" onClick={onNext}>
					{buttonText}
				</button>
			)}

			{/* Auto-advance indicator */}
			{autoAdvanceMs && autoAdvanceMs > 0 && (
				<p className="lf-milestone-auto-advance">
					Continuing automatically...
				</p>
			)}
		</div>
	);
}
