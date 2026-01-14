import React from "react";
import { useFormContext } from "../FormProvider";
import { useProgress } from "../../hooks/useProgress";
import { useThemeContext } from "../../hooks/useTheme";

export function ProgressBar() {
	const { content, answers, currentIndex, settings } = useFormContext();
	const theme = useThemeContext();
	const { percentage, segments } = useProgress({ content, answers, currentIndex });

	// Check both settings.showProgressBar AND theme.progressBar.enabled
	if (!settings.showProgressBar || !theme.progressBar.enabled) {
		return null;
	}

	const position = theme.progressBar.position === "bottom" ? "bottom" : "top";
	const positionStyle: React.CSSProperties = {
		position: "fixed",
		left: 0,
		right: 0,
		[position]: 0,
		zIndex: 100,
	};

	if (theme.progressBar.style === "segmented") {
		return (
			<div
				style={{
					...positionStyle,
					display: "flex",
					gap: "4px",
					padding: "8px 16px",
				}}
			>
				{segments.map((segment) => (
					<div
						key={segment.index}
						style={{
							flex: 1,
							height: "4px",
							backgroundColor: segment.completed
								? "var(--lf-color-progress-fill)"
								: "var(--lf-color-progress-bg)",
							transition: "background-color var(--lf-transition-duration) var(--lf-transition-easing)",
						}}
					/>
				))}
			</div>
		);
	}

	if (theme.progressBar.style === "percentage") {
		return (
			<div
				style={{
					...positionStyle,
					padding: "8px 16px",
					textAlign: "center",
					fontSize: "0.875rem",
					fontWeight: 500,
					color: "var(--lf-color-question)",
				}}
			>
				{Math.round(percentage)}%
			</div>
		);
	}

	if (theme.progressBar.style === "dots") {
		return (
			<div
				style={{
					...positionStyle,
					display: "flex",
					justifyContent: "center",
					gap: "8px",
					padding: "8px 16px",
				}}
			>
				{segments.map((segment) => (
					<div
						key={segment.index}
						style={{
							width: segment.current ? "12px" : "8px",
							height: segment.current ? "12px" : "8px",
							borderRadius: "50%",
							backgroundColor: segment.completed || segment.current
								? "var(--lf-color-progress-fill)"
								: "var(--lf-color-progress-bg)",
							transition: "all var(--lf-transition-duration) var(--lf-transition-easing)",
						}}
					/>
				))}
			</div>
		);
	}

	// Default bar style
	return (
		<div style={{ ...positionStyle, padding: "8px 16px" }}>
			<div
				className="lf-progress"
				style={{ height: "4px", borderRadius: "2px" }}
			>
				<div
					className="lf-progress-fill"
					style={{
						width: `${percentage}%`,
						height: "100%",
						borderRadius: "2px",
					}}
				/>
			</div>
		</div>
	);
}
