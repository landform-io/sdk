import React from "react";
import type { NumberField as NumberFieldType, FieldAnswer } from "../../types";
import { useField } from "../../hooks/useField";
import { QuestionHeader } from "./QuestionHeader";

export interface NumberFieldProps {
	field: NumberFieldType;
	value: FieldAnswer | undefined;
	error: string | null;
	onChange: (value: FieldAnswer) => void;
	onNext: () => void;
	showQuestionNumber?: boolean;
	questionNumber?: number;
}

export function NumberField({
	field,
	value,
	error,
	onChange,
	onNext,
	showQuestionNumber,
	questionNumber,
}: NumberFieldProps) {
	const { onKeyDown } = useField({
		field,
		value,
		error,
		onChange,
		onNext,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		if (val === "") {
			onChange("");
		} else {
			const num = parseFloat(val);
			if (!isNaN(num)) {
				onChange(num);
			}
		}
	};

	return (
		<div className="lf-field">
			<QuestionHeader
				field={field}
				questionNumber={questionNumber}
				showQuestionNumber={showQuestionNumber}
			/>

			<input
				type="number"
				value={value !== undefined ? String(value) : ""}
				onChange={handleChange}
				onKeyDown={onKeyDown}
				placeholder={field.properties?.placeholder}
				min={field.validations?.minValue}
				max={field.validations?.maxValue}
				className="lf-input-underline"
				aria-invalid={!!error}
				aria-describedby={error ? `${field.ref}-error` : undefined}
			/>

			{error && (
				<p id={`${field.ref}-error`} className="lf-error">
					{error}
				</p>
			)}
		</div>
	);
}
