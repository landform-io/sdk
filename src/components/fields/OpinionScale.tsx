import React from "react";
import type { OpinionScaleField as OpinionScaleFieldType, FieldAnswer } from "../../types";
import { QuestionHeader } from "./QuestionHeader";

export interface OpinionScaleProps {
	field: OpinionScaleFieldType;
	value: FieldAnswer | undefined;
	error: string | null;
	onChange: (value: FieldAnswer) => void;
	onNext: (pendingValue?: FieldAnswer) => void;
	showQuestionNumber?: boolean;
	questionNumber?: number;
}

export function OpinionScale({
	field,
	value,
	error,
	onChange,
	onNext,
	showQuestionNumber,
	questionNumber,
}: OpinionScaleProps) {
	const { steps, startAtOne, labels } = field.properties;
	const currentValue = value as number | undefined;

	const startValue = startAtOne ? 1 : 0;
	const endValue = startAtOne ? steps : steps - 1;

	const handleClick = (rating: number) => {
		onChange(rating);
		onNext(rating);
	};

	return (
		<div className="lf-field">
			<QuestionHeader
				field={field}
				questionNumber={questionNumber}
				showQuestionNumber={showQuestionNumber}
			/>

			<div>
				<div
					style={{
						display: "flex",
						gap: "0.5rem",
						flexWrap: "wrap",
					}}
				>
					{Array.from({ length: steps }, (_, i) => startValue + i).map((num) => (
						<button
							key={num}
							type="button"
							onClick={() => handleClick(num)}
							className={`lf-scale-button ${currentValue === num ? "lf-scale-button-selected" : ""}`}
						>
							{num}
						</button>
					))}
				</div>

				{(labels.left || labels.right) && (
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: "0.75rem",
							fontSize: "0.875rem",
							color: "var(--lf-color-placeholder)",
						}}
					>
						<span>{labels.left}</span>
						{labels.center && <span>{labels.center}</span>}
						<span>{labels.right}</span>
					</div>
				)}
			</div>

			{error && (
				<p id={`${field.ref}-error`} className="lf-error">
					{error}
				</p>
			)}
		</div>
	);
}
