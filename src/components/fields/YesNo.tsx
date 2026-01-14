import React from "react";
import type { YesNoField as YesNoFieldType, FieldAnswer } from "../../types";
import { QuestionHeader } from "./QuestionHeader";

export interface YesNoProps {
	field: YesNoFieldType;
	value: FieldAnswer | undefined;
	error: string | null;
	onChange: (value: FieldAnswer) => void;
	onNext: (pendingValue?: FieldAnswer) => void;
	showQuestionNumber?: boolean;
	questionNumber?: number;
	showKeyHints?: boolean;
}

export function YesNo({
	field,
	value,
	error,
	onChange,
	onNext,
	showQuestionNumber,
	questionNumber,
	showKeyHints,
}: YesNoProps) {
	const currentValue = value as boolean | undefined;

	const handleClick = (answer: boolean) => {
		onChange(answer);
		onNext(answer);
	};

	// Handle keyboard shortcuts
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === "y") {
				handleClick(true);
			} else if (e.key.toLowerCase() === "n") {
				handleClick(false);
			}
		};

		if (showKeyHints) {
			window.addEventListener("keydown", handleKeyDown);
			return () => window.removeEventListener("keydown", handleKeyDown);
		}
	}, [showKeyHints]);

	return (
		<div className="lf-field">
			<QuestionHeader
				field={field}
				questionNumber={questionNumber}
				showQuestionNumber={showQuestionNumber}
			/>

			<div
				style={{
					display: "flex",
					gap: "var(--lf-spacing-option)",
				}}
			>
				<button
					type="button"
					onClick={() => handleClick(true)}
					className={`lf-choice ${currentValue === true ? "lf-choice-selected" : ""}`}
					style={{ flex: 1 }}
				>
					{showKeyHints && <span className="lf-key-hint">Y</span>}
					<span>Yes</span>
					{currentValue === true && (
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							style={{ color: "var(--lf-color-primary)", marginLeft: "auto" }}
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
					)}
				</button>

				<button
					type="button"
					onClick={() => handleClick(false)}
					className={`lf-choice ${currentValue === false ? "lf-choice-selected" : ""}`}
					style={{ flex: 1 }}
				>
					{showKeyHints && <span className="lf-key-hint">N</span>}
					<span>No</span>
					{currentValue === false && (
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							style={{ color: "var(--lf-color-primary)", marginLeft: "auto" }}
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
					)}
				</button>
			</div>

			{error && (
				<p id={`${field.ref}-error`} className="lf-error">
					{error}
				</p>
			)}
		</div>
	);
}
