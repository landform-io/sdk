import React from "react";
import type { FieldAnswer, FormField, FormSettings } from "../../types";
import type { FieldMode } from "./shared/types";
import { FieldWrapper } from "./shared/FieldWrapper";

// Import shared components
import { TextInput, TextArea, NumberInput, DateInput } from "./shared/inputs";
import { MultipleChoice, PictureChoice, Dropdown, YesNo, Ranking } from "./shared/choices";
import { Rating, OpinionScale, NPS, Slider } from "./shared/scales";
import { Address, Legal, Statement, Signature, FileUpload } from "./shared/special";

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
	/** Rendering mode - defaults to "live" for SDK */
	mode?: FieldMode;
}

export function FieldRenderer({
	field,
	value,
	error,
	onChange,
	onNext,
	showQuestionNumber,
	questionNumber,
	showKeyHints = true,
	systemMessages,
	mode = "live",
}: FieldRendererProps) {
	const commonProps = {
		field: field as any,
		value: value as any,
		onChange: onChange as any,
		onNext,
		mode,
		showKeyHints,
	};

	const renderField = () => {
		switch (field.type) {
			case "short_text":
			case "email":
			case "website":
			case "phone_number":
				return <TextInput {...commonProps} />;

			case "long_text":
				return <TextArea {...commonProps} />;

			case "number":
				return <NumberInput {...commonProps} />;

			case "date":
				return <DateInput {...commonProps} />;

			case "multiple_choice":
				return <MultipleChoice {...commonProps} />;

			case "picture_choice":
				return <PictureChoice {...commonProps} />;

			case "dropdown":
				return <Dropdown {...commonProps} />;

			case "yes_no":
				return <YesNo {...commonProps} />;

			case "ranking":
				return <Ranking {...commonProps} />;

			case "rating":
				return <Rating {...commonProps} />;

			case "opinion_scale":
				return <OpinionScale {...commonProps} />;

			case "nps":
				return <NPS {...commonProps} />;

			case "slider":
				return <Slider {...commonProps} />;

			case "address":
				return <Address {...commonProps} />;

			case "legal":
				return <Legal {...commonProps} />;

			case "statement":
				return <Statement field={field as any} onNext={onNext} mode={mode} />;

			case "signature":
				return <Signature {...commonProps} />;

			case "file_upload":
				return <FileUpload {...commonProps} />;

			// For field types not yet implemented, show a basic input
			case "contact_info":
			case "payment":
			case "group":
			case "matrix":
			default:
				return (
					<>
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
							className="lf-input lf-input-underline w-full py-3"
							placeholder={`Enter your ${field.type.replace(/_/g, " ")}`}
						/>
					</>
				);
		}
	};

	// Statement doesn't need the wrapper (it's just a continue button)
	if (field.type === "statement") {
		return (
			<div className="lf-field">
				<FieldWrapper
					field={field}
					questionNumber={questionNumber}
					showQuestionNumber={showQuestionNumber}
				>
					{renderField()}
				</FieldWrapper>
				{error && (
					<p id={`${field.ref}-error`} className="lf-error">
						{error}
					</p>
				)}
			</div>
		);
	}

	return (
		<div className="lf-field">
			<FieldWrapper
				field={field}
				questionNumber={questionNumber}
				showQuestionNumber={showQuestionNumber}
			>
				{renderField()}
			</FieldWrapper>
			{error && (
				<p id={`${field.ref}-error`} className="lf-error">
					{error}
				</p>
			)}
		</div>
	);
}
