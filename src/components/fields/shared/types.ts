/**
 * Shared types for unified field components
 *
 * These types enable field components to work across multiple contexts:
 * - Editor: Read-only preview in the canvas
 * - Preview: Interactive preview for testing
 * - Live: Production form submission
 */

import type {
	AddressValue,
	Choice,
	FieldAnswer,
	FormField,
	SignatureValue,
} from "../../../types";

/**
 * Field rendering mode
 * - "editor": Read-only preview in canvas (no interactions, no auto-advance)
 * - "preview": Interactive preview for testing (interactions enabled, no API calls)
 * - "live": Production form submission (full functionality)
 */
export type FieldMode = "editor" | "preview" | "live";

/**
 * Mode behavior configuration
 */
export interface ModeBehavior {
	/** Whether value changes are allowed */
	allowValueChanges: boolean;
	/** Whether to auto-advance on selection */
	autoAdvance: boolean;
	/** Whether keyboard shortcuts are enabled */
	keyboardShortcuts: boolean;
	/** Whether to auto-focus inputs */
	autoFocus: boolean;
	/** Whether to show keyboard hints (can be overridden by showKeyHints prop) */
	defaultShowKeyHints: boolean;
}

/**
 * Get behavior configuration for a given mode
 */
export function getModeBehavior(mode: FieldMode): ModeBehavior {
	switch (mode) {
		case "editor":
			return {
				allowValueChanges: true,
				autoAdvance: false,
				keyboardShortcuts: false,
				autoFocus: false,
				defaultShowKeyHints: true,
			};
		case "preview":
			return {
				allowValueChanges: true,
				autoAdvance: true,
				keyboardShortcuts: true,
				autoFocus: true,
				defaultShowKeyHints: true,
			};
		case "live":
			return {
				allowValueChanges: true,
				autoAdvance: true,
				keyboardShortcuts: true,
				autoFocus: true,
				defaultShowKeyHints: true,
			};
	}
}

/**
 * Base props shared by all field components
 */
export interface SharedFieldProps<T = FieldAnswer> {
	/** The field configuration */
	field: FormField;
	/** Current value of the field */
	value: T;
	/** Callback when value changes */
	onChange: (value: T) => void;
	/** Callback to advance to next question (for auto-advance fields) */
	onNext?: () => void;
	/** Rendering mode */
	mode: FieldMode;
	/** Override: whether to show keyboard hints on choices */
	showKeyHints?: boolean;
}

/**
 * Props for text input fields (short_text, email, website, phone_number)
 */
export interface TextInputProps extends SharedFieldProps<string> {
	field: FormField & {
		type: "short_text" | "email" | "website" | "phone_number";
		properties?: { placeholder?: string };
	};
}

/**
 * Props for text area (long_text)
 */
export interface TextAreaProps extends SharedFieldProps<string> {
	field: FormField & {
		type: "long_text";
		properties?: { placeholder?: string };
	};
}

/**
 * Props for number input
 */
export interface NumberInputProps extends SharedFieldProps<number | undefined> {
	field: FormField & {
		type: "number";
		properties?: { placeholder?: string };
	};
}

/**
 * Props for date input
 */
export interface DateInputProps extends SharedFieldProps<string> {
	field: FormField & {
		type: "date";
		properties?: {
			structure?: "DDMMYYYY" | "MMDDYYYY" | "YYYYMMDD";
			separator?: "/" | "-" | ".";
		};
	};
}

/**
 * Props for multiple choice
 */
export interface MultipleChoiceProps
	extends SharedFieldProps<string | string[]> {
	field: FormField & {
		type: "multiple_choice";
		properties: {
			choices: Choice[];
			allowMultipleSelection?: boolean;
			allowOtherChoice?: boolean;
			randomize?: boolean;
		};
	};
}

/**
 * Props for picture choice
 */
export interface PictureChoiceProps
	extends SharedFieldProps<string | string[]> {
	field: FormField & {
		type: "picture_choice";
		properties: {
			choices: (Choice & {
				attachment?: {
					type: "image" | "video";
					href: string;
					properties?: { description?: string };
				};
			})[];
			allowMultipleSelection?: boolean;
			supersized?: boolean;
			showLabels?: boolean;
		};
	};
}

/**
 * Props for dropdown
 */
export interface DropdownProps extends SharedFieldProps<string> {
	field: FormField & {
		type: "dropdown";
		properties: {
			choices: Choice[];
			alphabeticalOrder?: boolean;
		};
	};
}

/**
 * Props for yes/no
 */
export interface YesNoProps extends SharedFieldProps<boolean | undefined> {
	field: FormField & {
		type: "yes_no";
	};
}

/**
 * Props for ranking
 */
export interface RankingProps extends SharedFieldProps<string[]> {
	field: FormField & {
		type: "ranking";
		properties: {
			choices: Choice[];
		};
	};
}

/**
 * Props for rating
 */
export interface RatingProps extends SharedFieldProps<number | undefined> {
	field: FormField & {
		type: "rating";
		properties: {
			steps: number;
			shape: "star" | "heart" | "thumbsup" | "trophy" | "crown";
		};
	};
}

/**
 * Props for opinion scale
 */
export interface OpinionScaleProps
	extends SharedFieldProps<number | undefined> {
	field: FormField & {
		type: "opinion_scale";
		properties: {
			steps: number;
			startAtOne: boolean;
			labels: {
				left?: string;
				center?: string;
				right?: string;
			};
		};
	};
}

/**
 * Props for NPS
 */
export interface NPSProps extends SharedFieldProps<number | undefined> {
	field: FormField & {
		type: "nps";
		properties?: {
			labels?: {
				left?: string;
				right?: string;
			};
		};
	};
}

/**
 * Props for slider
 */
export interface SliderProps extends SharedFieldProps<number | undefined> {
	field: FormField & {
		type: "slider";
		properties: {
			min: number;
			max: number;
			step: number;
			defaultValue?: number;
			showValue?: boolean;
			showMinMaxLabels?: boolean;
			unit?: string;
			unitPosition?: "prefix" | "suffix";
			labels?: {
				left?: string;
				right?: string;
			};
		};
	};
}

/**
 * Props for address
 */
export interface AddressProps
	extends SharedFieldProps<AddressValue | undefined> {
	field: FormField & {
		type: "address";
		properties?: {
			placeholder?: string;
			showSecondLine?: boolean;
			showCountry?: boolean;
			defaultCountry?: string;
		};
	};
}

/**
 * Props for legal
 */
export interface LegalProps extends SharedFieldProps<boolean | undefined> {
	field: FormField & {
		type: "legal";
		properties?: {
			description?: string;
		};
	};
}

/**
 * Props for statement
 */
export interface StatementProps
	extends Omit<SharedFieldProps, "value" | "onChange"> {
	field: FormField & {
		type: "statement";
		properties?: {
			buttonText?: string;
			hideMarks?: boolean;
		};
	};
}

/**
 * Props for signature
 */
export interface SignatureProps
	extends SharedFieldProps<SignatureValue | undefined> {
	field: FormField & {
		type: "signature";
		properties?: {
			width?: number;
			height?: number;
			strokeColor?: string;
			strokeWidth?: number;
			backgroundColor?: string;
			showClearButton?: boolean;
			showTypedSignature?: boolean;
		};
	};
}

/**
 * Props for file upload
 */
export interface FileUploadProps
	extends SharedFieldProps<FieldAnswer | undefined> {
	field: FormField & {
		type: "file_upload";
		properties?: {
			allowedFileTypes?: string[];
			maxFileSizeMB?: number;
			maxFiles?: number;
		};
	};
}
