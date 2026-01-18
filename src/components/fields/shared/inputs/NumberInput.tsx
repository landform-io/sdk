/**
 * NumberInput - Unified number input component
 *
 * Handles: number
 */

import type { NumberInputProps } from "../types";
import { getModeBehavior } from "../types";

export function NumberInput({
	field,
	value,
	onChange,
	mode,
}: NumberInputProps) {
	const behavior = getModeBehavior(mode);

	const placeholder = field.properties?.placeholder || "Type a number...";

	return (
		<input
			type="number"
			value={value ?? ""}
			onChange={(e) => {
				const val = e.target.value;
				onChange(val === "" ? undefined : parseFloat(val));
			}}
			placeholder={placeholder}
			className="lf-input lf-input-underline w-full py-3"
			readOnly={!behavior.allowValueChanges}
			autoFocus={behavior.autoFocus}
		/>
	);
}

export default NumberInput;
