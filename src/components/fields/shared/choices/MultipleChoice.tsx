/**
 * MultipleChoice - Unified multiple choice component
 *
 * Handles: multiple_choice
 */

import type { MultipleChoiceProps } from "../types";
import { getModeBehavior } from "../types";

export function MultipleChoice({
	field,
	value,
	onChange,
	onNext,
	mode,
	showKeyHints = true,
}: MultipleChoiceProps) {
	const behavior = getModeBehavior(mode);

	const choices = field.properties?.choices || [];
	const allowMultiple = field.properties?.allowMultipleSelection;
	const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

	const handleSelect = (choiceRef: string) => {
		if (!behavior.allowValueChanges) return;

		if (allowMultiple) {
			const newValue = selectedValues.includes(choiceRef)
				? selectedValues.filter((v) => v !== choiceRef)
				: [...selectedValues, choiceRef];
			onChange(newValue);
		} else {
			onChange(choiceRef);
			if (behavior.autoAdvance) {
				setTimeout(() => onNext?.(), 300);
			}
		}
	};

	return (
		<div className="lf-options">
			{choices.map((choice, index) => {
				const isSelected = selectedValues.includes(choice.ref);
				return (
					<button
						key={choice.ref}
						type="button"
						onClick={() => handleSelect(choice.ref)}
						className={`lf-choice ${isSelected ? "lf-choice-selected" : ""}`}
					>
						{showKeyHints && (
							<span className="lf-key-hint">{String.fromCharCode(65 + index)}</span>
						)}
						<span>{choice.label}</span>
						{isSelected && (
							<svg
								className="ml-auto w-5 h-5"
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
				);
			})}
		</div>
	);
}

export default MultipleChoice;
