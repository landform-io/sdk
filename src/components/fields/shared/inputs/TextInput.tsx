/**
 * TextInput - Unified text input component
 *
 * Handles: short_text, email, website, phone_number
 */

import type { TextInputProps } from "../types";
import { getModeBehavior } from "../types";

export function TextInput({
	field,
	value,
	onChange,
	mode,
}: TextInputProps) {
	const behavior = getModeBehavior(mode);

	const inputType = field.type === "email" ? "email"
		: field.type === "website" ? "url"
		: field.type === "phone_number" ? "tel"
		: "text";

	const placeholder = field.properties?.placeholder
		|| (field.type === "email" ? "name@example.com"
		: field.type === "website" ? "https://example.com"
		: field.type === "phone_number" ? "+1 (555) 000-0000"
		: "Type your answer here...");

	return (
		<input
			type={inputType}
			value={value || ""}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className="lf-input lf-input-underline w-full py-3"
			readOnly={!behavior.allowValueChanges}
			autoFocus={behavior.autoFocus}
		/>
	);
}

export default TextInput;
