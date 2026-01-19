import React from "react";
import { useFormContext } from "../FormProvider";
import { useThemeContext } from "../../hooks/useTheme";
import { getThemeVariableValue } from "../../utils/liquid";

export interface NavigationControlsProps {
	onNext?: () => void;
	onPrevious?: () => void;
	/** Disable all navigation (e.g., during transitions) */
	disabled?: boolean;
}

export function NavigationControls({ onNext, onPrevious, disabled = false }: NavigationControlsProps) {
	const { canGoBack, canGoNext, isSubmitting, next, previous, settings } =
		useFormContext();

	// Combined disabled state - from prop or submitting
	const isDisabled = disabled || isSubmitting;
	const theme = useThemeContext();

	// Check navigation visibility - hide if "hidden" or "auto-advance"
	const navVisibility = theme.componentVariants?.navigationVisibility || "always";
	if (navVisibility === "hidden" || navVisibility === "auto-advance") {
		return null;
	}

	const handleNext = () => (onNext ? onNext() : next());
	const handlePrevious = () => (onPrevious ? onPrevious() : previous());

	const confirmText = settings.systemMessages?.confirmButtonText || "OK";
	const enterHint = settings.systemMessages?.pressEnterText || "press Enter";

	// Read showKeyboardHint from theme variables (defaults to true)
	const showKeyboardHint = getThemeVariableValue(theme?.variables, "showKeyboardHint", true);

	const isBottomBar = theme.componentVariants?.navigationLayout === "bottom-bar";

	// Bottom-bar variant (Quiz template style)
	if (isBottomBar) {
		return (
			<div className="lf-navigation-bottom-bar">
				<button
					type="button"
					className="lf-nav-btn-back"
					onClick={handlePrevious}
					disabled={!canGoBack || isDisabled}
					aria-label="Previous question"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					Back
				</button>
				<button
					type="button"
					className="lf-nav-btn-next"
					onClick={handleNext}
					disabled={isDisabled}
					aria-label="Next question"
				>
					Next
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		);
	}

	// Default floating navigation
	return (
		<div className="lf-navigation">
			<button
				type="button"
				className="lf-navigation-button"
				onClick={handlePrevious}
				disabled={!canGoBack || isDisabled}
				aria-label="Previous question"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M15 18l-6-6 6-6" />
				</svg>
			</button>

			<button
				type="button"
				className="lf-button"
				onClick={handleNext}
				disabled={isDisabled}
			>
				{confirmText}
				{showKeyboardHint && (
					<span
						style={{
							opacity: 0.7,
							fontSize: "0.75rem",
							marginLeft: "0.5rem",
						}}
					>
						{enterHint} ↵
					</span>
				)}
			</button>

			<button
				type="button"
				className="lf-navigation-button"
				onClick={handleNext}
				disabled={!canGoNext || isDisabled}
				aria-label="Next question"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M9 18l6-6-6-6" />
				</svg>
			</button>
		</div>
	);
}
