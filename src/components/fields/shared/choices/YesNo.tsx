/**
 * YesNo - Unified yes/no component
 *
 * Handles: yes_no
 */

import type { YesNoProps } from "../types";
import { getModeBehavior } from "../types";

export function YesNo({
	field,
	value,
	onChange,
	onNext,
	mode,
	showKeyHints = true,
}: YesNoProps) {
	const behavior = getModeBehavior(mode);

	const handleSelect = (selected: boolean) => {
		if (!behavior.allowValueChanges) return;
		onChange(selected);
		if (behavior.autoAdvance) {
			setTimeout(() => onNext?.(), 300);
		}
	};

	return (
		<div className="flex gap-4">
			<button
				type="button"
				onClick={() => handleSelect(true)}
				className={`lf-choice flex-1 justify-center ${value === true ? "lf-choice-selected" : ""}`}
			>
				{showKeyHints && <span className="lf-key-hint">Y</span>}
				<span>Yes</span>
			</button>
			<button
				type="button"
				onClick={() => handleSelect(false)}
				className={`lf-choice flex-1 justify-center ${value === false ? "lf-choice-selected" : ""}`}
			>
				{showKeyHints && <span className="lf-key-hint">N</span>}
				<span>No</span>
			</button>
		</div>
	);
}

export default YesNo;
