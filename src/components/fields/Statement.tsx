import React from "react";
import type { StatementField as StatementFieldType } from "../../types";
import { QuestionHeader } from "./QuestionHeader";

export interface StatementProps {
	field: StatementFieldType;
	onNext: () => void;
	showQuestionNumber?: boolean;
	questionNumber?: number;
}

export function Statement({
	field,
	onNext,
	showQuestionNumber,
	questionNumber,
}: StatementProps) {
	return (
		<div className="lf-field">
			<QuestionHeader
				field={field}
				questionNumber={questionNumber}
				showQuestionNumber={showQuestionNumber}
			/>

			<button type="button" className="lf-button" onClick={onNext}>
				{field.properties.buttonText || "Continue"}
			</button>
		</div>
	);
}
