/**
 * NPS - Unified Net Promoter Score component
 *
 * Handles: nps (0-10 scale)
 */

import type { NPSProps } from "../types";
import { getModeBehavior } from "../types";

export function NPS({
	field,
	value,
	onChange,
	onNext,
	mode,
}: NPSProps) {
	const behavior = getModeBehavior(mode);

	const labels = field.properties?.labels || {
		left: "Not at all likely",
		right: "Extremely likely",
	};

	const handleSelect = (num: number) => {
		if (!behavior.allowValueChanges) return;
		onChange(num);
		if (behavior.autoAdvance) {
			setTimeout(() => onNext?.(), 300);
		}
	};

	const getNPSClass = (num: number) => {
		if (num <= 6) return "lf-scale-button-detractor";
		if (num <= 8) return "lf-scale-button-passive";
		return "lf-scale-button-promoter";
	};

	return (
		<div>
			<div className="flex gap-2 justify-center flex-wrap py-2">
				{Array.from({ length: 11 }, (_, i) => i).map((num) => (
					<button
						key={num}
						type="button"
						onClick={() => handleSelect(num)}
						className={`lf-scale-button ${getNPSClass(num)} ${value === num ? "lf-scale-button-selected" : ""}`}
					>
						{num}
					</button>
				))}
			</div>
			<div className="flex justify-between text-xs opacity-60 mt-2" style={{ color: "var(--lf-color-question)" }}>
				<span>{labels.left}</span>
				<span>{labels.right}</span>
			</div>
		</div>
	);
}

export default NPS;
