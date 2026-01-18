/**
 * Rating - Unified rating component
 *
 * Handles: rating (stars, hearts, etc.)
 */

import { useState } from "react";
import type { RatingProps } from "../types";
import { getModeBehavior } from "../types";

const SHAPES: Record<string, string> = {
	star: "★",
	heart: "♥",
	thumbsup: "👍",
	trophy: "🏆",
	crown: "👑",
};

export function Rating({
	field,
	value,
	onChange,
	onNext,
	mode,
}: RatingProps) {
	const behavior = getModeBehavior(mode);
	const [hovered, setHovered] = useState<number | null>(null);

	const steps = field.properties?.steps || 5;
	const shape = field.properties?.shape || "star";

	const handleSelect = (rating: number) => {
		if (!behavior.allowValueChanges) return;
		onChange(rating);
		if (behavior.autoAdvance) {
			setTimeout(() => onNext?.(), 300);
		}
	};

	return (
		<div className="flex gap-2 justify-center py-2">
			{Array.from({ length: steps }, (_, i) => i + 1).map((rating) => {
				const isFilled = hovered !== null ? rating <= hovered : rating <= (value || 0);
				return (
					<button
						key={rating}
						type="button"
						onClick={() => handleSelect(rating)}
						onMouseEnter={() => behavior.allowValueChanges && setHovered(rating)}
						onMouseLeave={() => setHovered(null)}
						className={`lf-rating-star ${isFilled ? "lf-rating-star-filled" : "lf-rating-star-empty"}`}
					>
						{SHAPES[shape]}
					</button>
				);
			})}
		</div>
	);
}

export default Rating;
