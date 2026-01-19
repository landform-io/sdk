import { useMemo } from "react";
import type { FormContent, ResponseAnswers } from "../types";

export interface UseProgressOptions {
	content: FormContent;
	answers: ResponseAnswers;
	currentIndex: number;
}

export interface ProgressSegment {
	index: number;
	fieldRef: string;
	completed: boolean;
	current: boolean;
}

export interface UseProgressReturn {
	totalFields: number;
	answeredCount: number;
	currentFieldIndex: number;
	percentage: number;
	segments: ProgressSegment[];
}

export function useProgress(options: UseProgressOptions): UseProgressReturn {
	const { content, answers, currentIndex } = options;

	return useMemo(() => {
		const totalFields = content.fields.length;
		const answeredCount = Object.keys(answers).length;

		// Calculate current field index
		const currentFieldIndex = Math.max(0, currentIndex);

		const percentage = totalFields > 0 ? (answeredCount / totalFields) * 100 : 0;

		// Generate segments for segmented progress bar
		const segments: ProgressSegment[] = content.fields.map((field, index) => ({
			index,
			fieldRef: field.ref,
			completed: !!answers[field.ref],
			current: index === currentFieldIndex,
		}));

		return {
			totalFields,
			answeredCount,
			currentFieldIndex,
			percentage,
			segments,
		};
	}, [content, answers, currentIndex]);
}
