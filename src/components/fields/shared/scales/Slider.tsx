/**
 * Slider - Unified slider component
 *
 * Handles: slider
 */

import type { SliderProps } from "../types";
import { getModeBehavior } from "../types";

export function Slider({
	field,
	value,
	onChange,
	mode,
}: SliderProps) {
	const behavior = getModeBehavior(mode);

	const min = field.properties?.min ?? 0;
	const max = field.properties?.max ?? 100;
	const step = field.properties?.step ?? 1;
	const showValue = field.properties?.showValue ?? true;
	const showMinMaxLabels = field.properties?.showMinMaxLabels ?? true;
	const unit = field.properties?.unit || "";
	const unitPosition = field.properties?.unitPosition || "suffix";
	const labels = field.properties?.labels || {};

	const currentValue = value ?? field.properties?.defaultValue ?? Math.round((min + max) / 2);
	const progress = ((currentValue - min) / (max - min)) * 100;

	const formatValue = (val: number) => {
		if (!unit) return String(val);
		return unitPosition === "prefix" ? `${unit}${val}` : `${val}${unit}`;
	};

	return (
		<div className="py-4">
			{showValue && (
				<div className="text-center mb-4">
					<span className="lf-question-title text-4xl font-bold">
						{formatValue(currentValue)}
					</span>
				</div>
			)}
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={currentValue}
				onChange={(e) => behavior.allowValueChanges && onChange(Number(e.target.value))}
				className="lf-slider w-full"
				style={{ "--slider-progress": `${progress}%` } as React.CSSProperties}
				disabled={!behavior.allowValueChanges}
			/>
			{showMinMaxLabels && (
				<div className="flex justify-between items-center text-xs mt-2" style={{ color: "var(--lf-color-question)" }}>
					<span className="opacity-60">{labels.left || formatValue(min)}</span>
					{!showValue && (
						<span className="font-medium" style={{ color: "var(--lf-color-primary)" }}>{formatValue(currentValue)}</span>
					)}
					<span className="opacity-60">{labels.right || formatValue(max)}</span>
				</div>
			)}
		</div>
	);
}

export default Slider;
