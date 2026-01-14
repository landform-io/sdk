import React from "react";
import type { FormField } from "../../types";

export interface QuestionHeaderProps {
	field: FormField;
	questionNumber?: number;
	showQuestionNumber?: boolean;
}

export function QuestionHeader({
	field,
	questionNumber,
	showQuestionNumber,
}: QuestionHeaderProps) {
	return (
		<div style={{ marginBottom: "var(--lf-spacing-question)" }}>
			{showQuestionNumber && questionNumber !== undefined && (
				<span
					className="lf-question-description"
					style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}
				>
					{questionNumber}
				</span>
			)}
			<h2 className="lf-question-title">
				{field.title}
				{field.validations?.required && (
					<span className="lf-required" style={{ marginLeft: "0.25rem" }}>
						*
					</span>
				)}
			</h2>
			{field.description && (
				<p
					className="lf-question-description"
					style={{ marginTop: "0.5rem", fontSize: "1rem" }}
				>
					{field.description}
				</p>
			)}
		</div>
	);
}
