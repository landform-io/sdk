import React from "react";
import type {
	ShortTextField as ShortTextFieldType,
	LongTextField as LongTextFieldType,
	EmailField as EmailFieldType,
	WebsiteField as WebsiteFieldType,
	FieldAnswer,
} from "../../types";
import { useField } from "../../hooks/useField";
import { QuestionHeader } from "./QuestionHeader";

type TextFieldType =
	| ShortTextFieldType
	| LongTextFieldType
	| EmailFieldType
	| WebsiteFieldType;

export interface TextFieldProps {
	field: TextFieldType;
	value: FieldAnswer | undefined;
	error: string | null;
	onChange: (value: FieldAnswer) => void;
	onNext: () => void;
	showQuestionNumber?: boolean;
	questionNumber?: number;
}

export function TextField({
	field,
	value,
	error,
	onChange,
	onNext,
	showQuestionNumber,
	questionNumber,
}: TextFieldProps) {
	const { getInputProps, getTextareaProps } = useField({
		field,
		value,
		error,
		onChange,
		onNext,
	});

	const isLongText = field.type === "long_text";
	const inputType = field.type === "email" ? "email" : field.type === "website" ? "url" : "text";

	return (
		<div className="lf-field">
			<QuestionHeader
				field={field}
				questionNumber={questionNumber}
				showQuestionNumber={showQuestionNumber}
			/>

			{isLongText ? (
				<textarea
					{...getTextareaProps()}
					className="lf-input"
					rows={4}
					style={{ resize: "vertical", minHeight: "120px" }}
				/>
			) : (
				<input {...getInputProps()} type={inputType} className="lf-input-underline" />
			)}

			{error && (
				<p id={`${field.ref}-error`} className="lf-error">
					{error}
				</p>
			)}
		</div>
	);
}
