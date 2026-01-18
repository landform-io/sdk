/**
 * Shared Field Components
 *
 * Unified field components that work across:
 * - Editor preview (mode="editor")
 * - Interactive preview (mode="preview")
 * - Production form (mode="live")
 */

// Types (explicit type exports for isolatedModules compatibility)
export type {
	FieldMode,
	ModeBehavior,
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
} from "./types";

// Runtime function from types
export { getModeBehavior } from "./types";

// Context exports
export type { FieldContextValue } from "./context";
export { FieldContext, useFieldContext, useFieldMode } from "./context";

// Utilities
export { QuestionHeader } from "./QuestionHeader";
export { FieldWrapper } from "./FieldWrapper";

// Input fields
export { TextInput } from "./inputs/TextInput";
export { TextArea } from "./inputs/TextArea";
export { NumberInput } from "./inputs/NumberInput";
export { DateInput } from "./inputs/DateInput";

// Choice fields
export { MultipleChoice } from "./choices/MultipleChoice";
export { PictureChoice } from "./choices/PictureChoice";
export { Dropdown } from "./choices/Dropdown";
export { YesNo } from "./choices/YesNo";
export { Ranking } from "./choices/Ranking";

// Scale fields
export { Rating } from "./scales/Rating";
export { OpinionScale } from "./scales/OpinionScale";
export { NPS } from "./scales/NPS";
export { Slider } from "./scales/Slider";

// Special fields
export { Address } from "./special/Address";
export { Legal } from "./special/Legal";
export { Statement } from "./special/Statement";
export { Signature } from "./special/Signature";
export { FileUpload } from "./special/FileUpload";
