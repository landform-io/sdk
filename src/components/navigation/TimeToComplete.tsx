import React, { useMemo } from "react";
import { useFormContext } from "../FormProvider";
import { calculateRemainingTime, formatTimeEstimate } from "../../utils/timeEstimate";

export function TimeToComplete() {
	const { content, settings, answers, isStarted, isCompleted } = useFormContext();

	// Don't show if setting is disabled
	if (!settings.showTimeToComplete) {
		return null;
	}

	// Don't show on completion
	if (isCompleted) {
		return null;
	}

	const answeredFieldRefs = Object.keys(answers);
	const remainingSeconds = useMemo(
		() => calculateRemainingTime(content, answeredFieldRefs),
		[content, answeredFieldRefs]
	);

	// Don't show if no time remaining
	if (remainingSeconds <= 0) {
		return null;
	}

	const timeText = formatTimeEstimate(remainingSeconds);

	return (
		<div
			className="lf-time-estimate"
			style={{
				position: "fixed",
				top: "1rem",
				right: "1rem",
				zIndex: 50,
				display: "flex",
				alignItems: "center",
				gap: "0.5rem",
				padding: "0.5rem 0.75rem",
				fontSize: "0.75rem",
				color: "var(--lf-color-question)",
				opacity: 0.7,
			}}
		>
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="12" cy="12" r="10" />
				<polyline points="12 6 12 12 16 14" />
			</svg>
			<span>{timeText}</span>
		</div>
	);
}
