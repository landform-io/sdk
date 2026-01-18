/**
 * Legal - Unified legal/terms acceptance component
 *
 * Handles: legal
 */

import type { LegalProps } from "../types";
import { getModeBehavior } from "../types";

export function Legal({
	field,
	value,
	onChange,
	onNext,
	mode,
}: LegalProps) {
	const behavior = getModeBehavior(mode);

	const description = field.properties?.description || field.description;
	const isChecked = value === true;

	const handleClick = () => {
		if (!behavior.allowValueChanges) return;
		const newValue = !isChecked;
		onChange(newValue);
		if (newValue && behavior.autoAdvance) {
			setTimeout(() => onNext?.(), 300);
		}
	};

	return (
		<div>
			{description && (
				<div
					className="p-4 text-sm max-h-32 overflow-y-auto mb-4"
					style={{ backgroundColor: "var(--lf-color-surface)", color: "var(--lf-color-answer)" }}
				>
					{description}
				</div>
			)}
			<button
				type="button"
				onClick={handleClick}
				className={`lf-choice w-full justify-center py-4 ${isChecked ? "lf-choice-selected" : ""}`}
			>
				<span className="text-lg">I accept</span>
				{isChecked && (
					<svg
						className="ml-2 w-5 h-5"
						style={{ color: "var(--lf-color-primary)" }}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={3}
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				)}
			</button>
		</div>
	);
}

export default Legal;
