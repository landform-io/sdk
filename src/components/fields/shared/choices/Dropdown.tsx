/**
 * Dropdown - Unified dropdown component
 *
 * Handles: dropdown
 */

import type { DropdownProps } from "../types";
import { getModeBehavior } from "../types";

export function Dropdown({
	field,
	value,
	onChange,
	onNext,
	mode,
}: DropdownProps) {
	const behavior = getModeBehavior(mode);

	const choices = field.properties?.choices || [];

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (!behavior.allowValueChanges) return;
		onChange(e.target.value);
		if (e.target.value && behavior.autoAdvance) {
			setTimeout(() => onNext?.(), 300);
		}
	};

	return (
		<select
			value={value || ""}
			onChange={handleChange}
			className="lf-input w-full py-3 px-3"
			disabled={!behavior.allowValueChanges}
			autoFocus={behavior.autoFocus}
		>
			<option value="" disabled>Choose an option</option>
			{choices.map((choice) => (
				<option key={choice.ref} value={choice.ref}>
					{choice.label}
				</option>
			))}
		</select>
	);
}

export default Dropdown;
