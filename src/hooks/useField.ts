import { useCallback, useMemo } from "react";
import type { FormField, FieldAnswer } from "../types";

export interface UseFieldOptions {
	field: FormField;
	value: FieldAnswer | undefined;
	error: string | null;
	onChange: (value: FieldAnswer) => void;
	onNext?: () => void;
}

export interface UseFieldReturn {
	// Field info
	ref: string;
	type: FormField["type"];
	title: string;
	description?: string;
	required: boolean;

	// State
	value: FieldAnswer | undefined;
	error: string | null;
	isEmpty: boolean;

	// Handlers
	onChange: (value: FieldAnswer) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;

	// Helpers
	getInputProps: () => {
		value: string;
		onChange: (
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>
		) => void;
		onKeyDown: (e: React.KeyboardEvent) => void;
		placeholder?: string;
		"aria-invalid": boolean;
		"aria-describedby"?: string;
	};

	getTextareaProps: () => {
		value: string;
		onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
		placeholder?: string;
		"aria-invalid": boolean;
		"aria-describedby"?: string;
	};
}

export function useField(options: UseFieldOptions): UseFieldReturn {
	const { field, value, error, onChange, onNext } = options;

	const isEmpty =
		value === undefined ||
		value === "" ||
		(Array.isArray(value) && value.length === 0);

	// Handle keyboard navigation
	const onKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey && field.type !== "long_text") {
				e.preventDefault();
				onNext?.();
			}
		},
		[field.type, onNext]
	);

	// Get placeholder from field properties
	const placeholder = useMemo(() => {
		if ("properties" in field && field.properties) {
			const props = field.properties as Record<string, unknown>;
			if ("placeholder" in props) {
				return props.placeholder as string | undefined;
			}
		}
		return undefined;
	}, [field]);

	// Generic input props helper
	const getInputProps = useCallback(() => {
		return {
			value: (value as string) || "",
			onChange: (
				e: React.ChangeEvent<
					HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
				>
			) => {
				onChange(e.target.value);
			},
			onKeyDown,
			placeholder,
			"aria-invalid": !!error,
			"aria-describedby": error ? `${field.ref}-error` : undefined,
		};
	}, [value, onChange, onKeyDown, field.ref, error, placeholder]);

	// Textarea props helper (without onKeyDown to allow Enter for newlines)
	const getTextareaProps = useCallback(() => {
		return {
			value: (value as string) || "",
			onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
				onChange(e.target.value);
			},
			placeholder,
			"aria-invalid": !!error,
			"aria-describedby": error ? `${field.ref}-error` : undefined,
		};
	}, [value, onChange, field.ref, error, placeholder]);

	return {
		// Field info
		ref: field.ref,
		type: field.type,
		title: field.title,
		description: field.description,
		required: field.validations?.required || false,

		// State
		value,
		error,
		isEmpty,

		// Handlers
		onChange,
		onKeyDown,

		// Helpers
		getInputProps,
		getTextareaProps,
	};
}
