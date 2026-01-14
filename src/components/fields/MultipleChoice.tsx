import React from "react";
import type { MultipleChoiceField as MultipleChoiceFieldType, FieldAnswer, FormSettings } from "../../types";
import { QuestionHeader } from "./QuestionHeader";
import { useThemeContext } from "../../hooks/useTheme";

export interface MultipleChoiceProps {
	field: MultipleChoiceFieldType;
	value: FieldAnswer | undefined;
	error: string | null;
	onChange: (value: FieldAnswer) => void;
	onNext: (pendingValue?: FieldAnswer) => void;
	showQuestionNumber?: boolean;
	questionNumber?: number;
	showKeyHints?: boolean;
	systemMessages?: FormSettings["systemMessages"];
}

export function MultipleChoice({
	field,
	value,
	error,
	onChange,
	onNext,
	showQuestionNumber,
	questionNumber,
	showKeyHints,
	systemMessages,
}: MultipleChoiceProps) {
	const theme = useThemeContext();
	const selectedValues = (value as string[]) || [];
	const { choices, allowMultipleSelection } = field.properties;

	// Component variants
	const isCardStyle = theme.componentVariants?.choiceStyle === "card";
	const choiceLayout = theme.componentVariants?.choiceLayout || "single-column";
	const choiceIndicator = theme.componentVariants?.choiceIndicator || "checkmark";
	const choiceContainerMaxWidth = theme.componentVariants?.choiceContainerMaxWidth;

	const handleChoiceClick = (choiceRef: string) => {
		if (allowMultipleSelection) {
			const newValues = selectedValues.includes(choiceRef)
				? selectedValues.filter((v) => v !== choiceRef)
				: [...selectedValues, choiceRef];
			onChange(newValues);
		} else {
			const newValue = [choiceRef];
			onChange(newValue);
			onNext(newValue);
		}
	};

	// Handle keyboard shortcuts
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Check if it's a letter key (A-Z)
			const key = e.key.toUpperCase();
			const index = key.charCodeAt(0) - 65; // A = 0, B = 1, etc.

			if (index >= 0 && index < choices.length) {
				handleChoiceClick(choices[index].ref);
			}
		};

		if (showKeyHints) {
			window.addEventListener("keydown", handleKeyDown);
			return () => window.removeEventListener("keydown", handleKeyDown);
		}
	}, [choices, showKeyHints, selectedValues]);

	// Container styles based on layout
	const containerStyle: React.CSSProperties = choiceLayout === "single-column"
		? {
				display: "flex",
				flexDirection: "column",
				gap: "var(--lf-spacing-option)",
			}
		: {
				display: "grid",
				gridTemplateColumns: choiceLayout === "two-column"
					? "repeat(2, 1fr)"
					: "repeat(auto-fit, minmax(160px, 1fr))",
				gap: "var(--lf-spacing-option)",
				maxWidth: choiceContainerMaxWidth || undefined,
				margin: choiceContainerMaxWidth ? "0 auto" : undefined,
			};

	// Render indicator based on type
	const renderIndicator = (isSelected: boolean) => {
		if (choiceIndicator === "none") {
			return null;
		}

		if (choiceIndicator === "arrow") {
			return (
				<span className="lf-choice-indicator">
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
						<circle cx="9" cy="9" r="9" fill={isSelected ? "#111113" : "white"} />
						<path
							d="M8 5.5L11.5 9L8 12.5"
							stroke={isSelected ? "white" : "black"}
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			);
		}

		if (choiceIndicator === "radio") {
			return (
				<span className="lf-choice-indicator">
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
						<circle cx="9" cy="9" r="8" stroke={isSelected ? "var(--lf-color-primary)" : "#E5E7EB"} strokeWidth="2" fill="none" />
						{isSelected && <circle cx="9" cy="9" r="5" fill="var(--lf-color-primary)" />}
					</svg>
				</span>
			);
		}

		// Default: checkmark
		return (
			<span className="lf-choice-indicator">
				{isSelected && (
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				)}
			</span>
		);
	};

	return (
		<div className="lf-field">
			<QuestionHeader
				field={field}
				questionNumber={questionNumber}
				showQuestionNumber={showQuestionNumber}
			/>

			{allowMultipleSelection && (
				<p className="lf-field-hint" style={{ marginBottom: "var(--lf-spacing-option)", opacity: 0.7 }}>
					{systemMessages?.multipleSelectionHint || "Choose as many as you like"}
				</p>
			)}

			<div style={containerStyle}>
				{choices.map((choice, index) => {
					const isSelected = selectedValues.includes(choice.ref);

					// Card style variant
					if (isCardStyle) {
						return (
							<button
								key={choice.ref}
								type="button"
								onClick={() => handleChoiceClick(choice.ref)}
								className={`lf-choice-card ${isSelected ? "lf-choice-card-selected" : ""}`}
							>
								<span style={{ flex: 1 }}>{choice.label}</span>
								{renderIndicator(isSelected)}
							</button>
						);
					}

					// Default style
					return (
						<button
							key={choice.ref}
							type="button"
							onClick={() => handleChoiceClick(choice.ref)}
							className={`lf-choice ${isSelected ? "lf-choice-selected" : ""}`}
						>
							{showKeyHints && (
								<span className="lf-key-hint">
									{String.fromCharCode(65 + index)}
								</span>
							)}
							<span style={{ flex: 1 }}>{choice.label}</span>
							{isSelected && (
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
									style={{ color: "var(--lf-color-primary)" }}
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							)}
						</button>
					);
				})}
			</div>

			{error && (
				<p id={`${field.ref}-error`} className="lf-error">
					{error}
				</p>
			)}
		</div>
	);
}
