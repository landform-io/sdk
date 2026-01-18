/**
 * QuestionHeader - Unified question header component
 *
 * Displays question title, description, and required indicator
 */

import type { FormField } from "../../../types";

interface QuestionHeaderProps {
	field: FormField;
	questionNumber?: number;
	showQuestionNumber?: boolean;
}

export function QuestionHeader({
	field,
	questionNumber,
	showQuestionNumber = false,
}: QuestionHeaderProps) {
	const questionTitle = showQuestionNumber && questionNumber
		? `${questionNumber} → ${field.title}`
		: field.title;

	return (
		<div>
			{showQuestionNumber && questionNumber && (
				<span className="lf-question-description text-sm font-medium">
					{questionNumber}
				</span>
			)}
			<h4 className="lf-question-title">
				{questionTitle}
				{field.validations?.required && (
					<span className="lf-required inline ml-1">*</span>
				)}
			</h4>
			{field.description && (
				<p className="lf-question-description mt-2">{field.description}</p>
			)}
		</div>
	);
}

export default QuestionHeader;
