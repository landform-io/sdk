// Main field renderer
export { FieldRenderer } from "./FieldRenderer";
export type { FieldRendererProps } from "./FieldRenderer";

// Shared components - Types (explicit for isolatedModules)
export type {
	FieldMode,
	ModeBehavior,
	FieldContextValue,
	SharedFieldProps,
	TextInputProps,
	TextAreaProps,
	NumberInputProps,
	DateInputProps,
	MultipleChoiceProps,
	PictureChoiceProps,
	DropdownProps,
	YesNoProps,
	RankingProps,
	RatingProps,
	OpinionScaleProps,
	NPSProps,
	SliderProps,
	AddressProps,
	LegalProps,
	StatementProps,
	SignatureProps,
	FileUploadProps,
} from "./shared";

// Shared components - Runtime values
export {
	getModeBehavior,
	FieldContext,
	useFieldContext,
	useFieldMode,
	FieldWrapper,
	TextInput,
	TextArea,
	NumberInput,
	DateInput,
	MultipleChoice,
	PictureChoice,
	Dropdown,
	YesNo,
	Ranking,
	Rating,
	OpinionScale,
	NPS,
	Slider,
	Address,
	Legal,
	Statement,
	Signature,
	FileUpload,
} from "./shared";

// Legacy exports (for backwards compatibility)
export { QuestionHeader } from "./QuestionHeader";
export type { QuestionHeaderProps } from "./QuestionHeader";

export { TextField } from "./TextField";
export type { TextFieldProps } from "./TextField";

export { NumberField } from "./NumberField";
export type { NumberFieldProps } from "./NumberField";
