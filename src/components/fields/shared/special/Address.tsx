/**
 * Address - Unified address component
 *
 * Handles: address (with multiple lines, city, state, zip, country)
 */

import type { AddressValue } from "../../../../types";
import type { AddressProps } from "../types";
import { getModeBehavior } from "../types";

export function Address({
	field,
	value,
	onChange,
	mode,
}: AddressProps) {
	const behavior = getModeBehavior(mode);

	const showSecondLine = field.properties?.showSecondLine ?? true;
	const showCountry = field.properties?.showCountry ?? false;
	const defaultCountry = field.properties?.defaultCountry;
	const placeholder = field.properties?.placeholder || "Street address";

	const addr = value || {};

	const updateField = (key: keyof AddressValue, val: string) => {
		if (!behavior.allowValueChanges) return;
		onChange({ ...addr, [key]: val });
	};

	return (
		<div className="space-y-3">
			<input
				type="text"
				placeholder={placeholder}
				value={addr.line1 || ""}
				onChange={(e) => updateField("line1", e.target.value)}
				className="lf-input w-full py-3 px-3"
				readOnly={!behavior.allowValueChanges}
				autoFocus={behavior.autoFocus}
			/>
			{showSecondLine && (
				<input
					type="text"
					placeholder="Apartment, suite, etc. (optional)"
					value={addr.line2 || ""}
					onChange={(e) => updateField("line2", e.target.value)}
					className="lf-input w-full py-3 px-3"
					readOnly={!behavior.allowValueChanges}
				/>
			)}
			<div className="flex gap-3">
				<input
					type="text"
					placeholder="City"
					value={addr.city || ""}
					onChange={(e) => updateField("city", e.target.value)}
					className="lf-input flex-1 py-3 px-3"
					readOnly={!behavior.allowValueChanges}
				/>
				<input
					type="text"
					placeholder="State"
					value={addr.state || ""}
					onChange={(e) => updateField("state", e.target.value)}
					className="lf-input w-24 py-3 px-3"
					readOnly={!behavior.allowValueChanges}
				/>
				<input
					type="text"
					placeholder="ZIP"
					value={addr.postalCode || ""}
					onChange={(e) => updateField("postalCode", e.target.value)}
					className="lf-input w-28 py-3 px-3"
					readOnly={!behavior.allowValueChanges}
				/>
			</div>
			{showCountry && (
				<input
					type="text"
					placeholder="Country"
					value={addr.country || defaultCountry || ""}
					onChange={(e) => updateField("country", e.target.value)}
					className="lf-input w-full py-3 px-3"
					readOnly={!behavior.allowValueChanges}
				/>
			)}
		</div>
	);
}

export default Address;
