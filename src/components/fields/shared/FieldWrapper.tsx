/**
 * FieldWrapper - Unified field wrapper component
 *
 * Provides consistent layout and spacing for all field types
 */

import type { ReactNode } from "react";
import type { FormField } from "../../../types";
import { QuestionHeader } from "./QuestionHeader";

interface FieldWrapperProps {
	field: FormField;
	questionNumber?: number;
	showQuestionNumber?: boolean;
	children: ReactNode;
}

export function FieldWrapper({
	field,
	questionNumber,
	showQuestionNumber = false,
	children,
}: FieldWrapperProps) {
	return (
		<div className="lf-question">
			<QuestionHeader
				field={field}
				questionNumber={questionNumber}
				showQuestionNumber={showQuestionNumber}
			/>
			{children}
		</div>
	);
}

export default FieldWrapper;
