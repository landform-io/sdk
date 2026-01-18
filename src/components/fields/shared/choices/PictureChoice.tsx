/**
 * PictureChoice - Unified picture choice component
 *
 * Handles: picture_choice
 */

import type { PictureChoiceProps } from "../types";
import { getModeBehavior } from "../types";

export function PictureChoice({
	field,
	value,
	onChange,
	onNext,
	mode,
}: PictureChoiceProps) {
	const behavior = getModeBehavior(mode);

	const choices = field.properties?.choices || [];
	const allowMultiple = field.properties?.allowMultipleSelection;
	const showLabels = field.properties?.showLabels !== false;
	const supersized = field.properties?.supersized;
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
		<div className={`lf-picture-grid ${supersized ? "lf-picture-supersized" : ""}`}>
			{choices.map((choice) => {
				const isSelected = selectedValues.includes(choice.ref);
				const hasImage = choice.attachment?.type === "image" && choice.attachment.href;

				return (
					<button
						key={choice.ref}
						type="button"
						onClick={() => handleSelect(choice.ref)}
						className={`lf-picture-card ${isSelected ? "selected" : ""}`}
					>
						{hasImage ? (
							<img
								src={choice.attachment!.href}
								alt={choice.attachment?.properties?.description || choice.label}
								className="lf-picture-image"
							/>
						) : (
							<div className="lf-picture-placeholder">
								<svg className="w-12 h-12 opacity-30" fill="currentColor" viewBox="0 0 24 24">
									<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
								</svg>
							</div>
						)}
						<div className="lf-picture-overlay" />
						{showLabels && (
							<div className="lf-picture-label">
								<span>{choice.label}</span>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
									<circle cx="12" cy="12" r="10" />
									<polyline points="12 8 16 12 12 16" />
									<line x1="8" y1="12" x2="16" y2="12" />
								</svg>
							</div>
						)}
					</button>
				);
			})}
		</div>
	);
}

export default PictureChoice;
