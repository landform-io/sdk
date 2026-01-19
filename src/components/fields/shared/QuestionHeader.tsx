/**
 * QuestionHeader - Typeform-style question header component
 *
 * Displays question number badge, title, description, and required indicator
 * Layout: [number badge] Question title
 */

import { useContext } from "react";
import type { FormField } from "../../../types";
import { ThemeContext } from "../../../hooks/useTheme";
import { getThemeVariableValue } from "../../../utils/liquid";

interface QuestionHeaderProps {
	field: FormField;
	questionNumber?: number;
}

export function QuestionHeader({
	field,
	questionNumber,
}: QuestionHeaderProps) {
	// Use context directly instead of useThemeContext to avoid throwing
	const theme = useContext(ThemeContext);

	// Read showQuestionNumber from theme variables (defaults to true)
	// If theme or variables is undefined, default to showing the number
	const showQuestionNumber = getThemeVariableValue(theme?.variables, "showQuestionNumber", true);

	return (
		<div className="lf-question-header">
			<h4 className="lf-question-title">
				{showQuestionNumber && questionNumber && (
					<span className="lf-question-number-badge">{questionNumber}</span>
				)}
				<span className="lf-question-title-text">
					{field.title}
					{field.validations?.required && (
						<span className="lf-required">*</span>
					)}
				</span>
			</h4>
			{field.description && (
				<p className="lf-question-description">{field.description}</p>
			)}
		</div>
	);
}

export default QuestionHeader;
