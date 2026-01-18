/**
 * OpinionScale - Unified opinion scale component
 *
 * Handles: opinion_scale
 */

import type { OpinionScaleProps } from "../types";
import { getModeBehavior } from "../types";

export function OpinionScale({
	field,
	value,
	onChange,
	onNext,
	mode,
}: OpinionScaleProps) {
	const behavior = getModeBehavior(mode);

	const steps = field.properties?.steps || 5;
	const startAtOne = field.properties?.startAtOne !== false;
	const labels = field.properties?.labels || {};
	const start = startAtOne ? 1 : 0;

	const handleSelect = (num: number) => {
		if (!behavior.allowValueChanges) return;
		onChange(num);
		if (behavior.autoAdvance) {
			setTimeout(() => onNext?.(), 300);
		}
	};

	return (
		<div>
			<div className="flex gap-2 justify-center py-2">
				{Array.from({ length: steps }, (_, i) => start + i).map((num) => (
					<button
						key={num}
						type="button"
						onClick={() => handleSelect(num)}
						className={`lf-scale-button ${value === num ? "lf-scale-button-selected" : ""}`}
					>
						{num}
					</button>
				))}
			</div>
			{(labels.left || labels.right) && (
				<div className="flex justify-between text-xs opacity-60 mt-2" style={{ color: "var(--lf-color-question)" }}>
					<span>{labels.left}</span>
					{labels.center && <span>{labels.center}</span>}
					<span>{labels.right}</span>
				</div>
			)}
		</div>
	);
}

export default OpinionScale;
