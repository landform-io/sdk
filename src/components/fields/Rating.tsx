import React, { useState } from "react";
import type { RatingField as RatingFieldType, FieldAnswer } from "../../types";
import { QuestionHeader } from "./QuestionHeader";

export interface RatingProps {
	field: RatingFieldType;
	value: FieldAnswer | undefined;
	error: string | null;
	onChange: (value: FieldAnswer) => void;
	onNext: (pendingValue?: FieldAnswer) => void;
	showQuestionNumber?: boolean;
	questionNumber?: number;
}

const SHAPES = {
	star: (filled: boolean) => (
		<svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
		</svg>
	),
	heart: (filled: boolean) => (
		<svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
		</svg>
	),
	thumbsup: (filled: boolean) => (
		<svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
			<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
		</svg>
	),
	trophy: (filled: boolean) => (
		<svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
			<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
			<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
			<path d="M4 22h16" />
			<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
			<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
			<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
		</svg>
	),
	crown: (filled: boolean) => (
		<svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
			<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
		</svg>
	),
};

export function Rating({
	field,
	value,
	error,
	onChange,
	onNext,
	showQuestionNumber,
	questionNumber,
}: RatingProps) {
	const [hoverValue, setHoverValue] = useState<number | null>(null);
	const { steps, shape } = field.properties;
	const currentValue = (value as number) || 0;
	const displayValue = hoverValue !== null ? hoverValue : currentValue;

	const handleClick = (rating: number) => {
		onChange(rating);
		onNext(rating);
	};

	const ShapeComponent = SHAPES[shape] || SHAPES.star;

	return (
		<div className="lf-field">
			<QuestionHeader
				field={field}
				questionNumber={questionNumber}
				showQuestionNumber={showQuestionNumber}
			/>

			<div
				style={{
					display: "flex",
					gap: "0.5rem",
				}}
				onMouseLeave={() => setHoverValue(null)}
			>
				{Array.from({ length: steps }, (_, i) => i + 1).map((rating) => (
					<button
						key={rating}
						type="button"
						onClick={() => handleClick(rating)}
						onMouseEnter={() => setHoverValue(rating)}
						className={`lf-rating-star ${rating <= displayValue ? "lf-rating-star-active" : ""}`}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							padding: "0.25rem",
							width: "2.5rem",
							height: "2.5rem",
						}}
						aria-label={`Rate ${rating} out of ${steps}`}
					>
						{ShapeComponent(rating <= displayValue)}
					</button>
				))}
			</div>

			{error && (
				<p id={`${field.ref}-error`} className="lf-error">
					{error}
				</p>
			)}
		</div>
	);
}
