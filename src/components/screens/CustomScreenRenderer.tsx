import React from "react";
import type { CustomScreen, FormTheme } from "../../types";
import { MilestoneScreen } from "./MilestoneScreen";
import { SectionScreen } from "./SectionScreen";
import { InfoScreen } from "./InfoScreen";
import { ResultsTeaserScreen } from "./ResultsTeaserScreen";
import { CTAScreen } from "./CTAScreen";

export interface CustomScreenRendererProps {
	screen: CustomScreen;
	theme: FormTheme;
	progress?: number;
	onNext: () => void;
	onNavigate?: (url: string) => void;
}

export function CustomScreenRenderer({
	screen,
	theme,
	progress,
	onNext,
	onNavigate,
}: CustomScreenRendererProps) {
	const { templateType, properties } = screen;

	switch (templateType) {
		case "milestone":
			if (properties.templateType === "milestone") {
				return (
					<MilestoneScreen
						properties={properties}
						progress={progress}
						onNext={onNext}
					/>
				);
			}
			break;
		case "section":
			if (properties.templateType === "section") {
				return <SectionScreen properties={properties} onNext={onNext} />;
			}
			break;
		case "info":
			if (properties.templateType === "info") {
				return <InfoScreen properties={properties} onNext={onNext} />;
			}
			break;
		case "results-teaser":
			if (properties.templateType === "results-teaser") {
				return <ResultsTeaserScreen properties={properties} onNext={onNext} />;
			}
			break;
		case "cta":
			if (properties.templateType === "cta") {
				return (
					<CTAScreen
						properties={properties}
						onNext={onNext}
						onNavigate={onNavigate}
					/>
				);
			}
			break;
	}

	// Fallback for unknown template types
	return (
		<div className="lf-screen lf-custom-screen">
			<p>Unknown screen template: {templateType}</p>
			<button type="button" className="lf-button" onClick={onNext}>
				Continue
			</button>
		</div>
	);
}
