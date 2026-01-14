import React from "react";
import type { FieldAnswer, FormField, FormSettings } from "../../types";
import { MultipleChoice } from "./MultipleChoice";
import { NumberField } from "./NumberField";
import { OpinionScale } from "./OpinionScale";
import { QuestionHeader } from "./QuestionHeader";
import { Rating } from "./Rating";
import { Statement } from "./Statement";
import { TextField } from "./TextField";
import { YesNo } from "./YesNo";

export interface FieldRendererProps {
	field: FormField;
	value: FieldAnswer | undefined;
	error: string | null;
	onChange: (value: FieldAnswer) => void;
	onNext: (pendingValue?: FieldAnswer) => void;
	showQuestionNumber?: boolean;
	questionNumber?: number;
	showKeyHints?: boolean;
	systemMessages?: FormSettings["systemMessages"];
}

export function FieldRenderer({
	field,
	value,
	error,
	onChange,
	onNext,
	showQuestionNumber,
	questionNumber,
	showKeyHints,
	systemMessages,
}: FieldRendererProps) {
	const commonProps = {
		value,
		error,
		onChange,
		onNext,
		showQuestionNumber,
		questionNumber,
	};

	switch (field.type) {
		case "short_text":
		case "long_text":
		case "email":
		case "website":
			return <TextField field={field} {...commonProps} />;

		case "number":
			return <NumberField field={field} {...commonProps} />;

		case "multiple_choice":
			return (
				<MultipleChoice
					field={field}
					{...commonProps}
					showKeyHints={showKeyHints}
					systemMessages={systemMessages}
				/>
			);

		case "rating":
			return <Rating field={field} {...commonProps} />;

		case "opinion_scale":
			return <OpinionScale field={field} {...commonProps} />;

		case "yes_no":
			return (
				<YesNo field={field} {...commonProps} showKeyHints={showKeyHints} />
			);

		case "statement":
			return (
				<Statement
					field={field}
					onNext={onNext}
					showQuestionNumber={showQuestionNumber}
					questionNumber={questionNumber}
				/>
			);

		// For field types not yet implemented, show a basic input
		case "phone_number":
		case "date":
		case "dropdown":
		case "picture_choice":
		case "ranking":
		case "nps":
		case "legal":
		case "file_upload":
		case "contact_info":
		case "payment":
		case "group":
		case "matrix":
		case "address":
		case "slider":
		case "signature":
		default:
			return (
				<div className="lf-field">
					<QuestionHeader
						field={field}
						questionNumber={questionNumber}
						showQuestionNumber={showQuestionNumber}
					/>
					<input
						type="text"
						value={(value as string) || ""}
						onChange={(e) => onChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								onNext();
							}
						}}
						className="lf-input-underline"
						placeholder={`Enter your ${field.type.replace(/_/g, " ")}`}
					/>
					{error && (
						<p id={`${field.ref}-error`} className="lf-error">
							{error}
						</p>
					)}
				</div>
			);
	}
}
