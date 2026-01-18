import type { FormContent, FormField } from "../types";

/**
 * Estimated time in seconds for each field type
 */
const FIELD_TIME_ESTIMATES: Record<string, number> = {
	// Text fields
	short_text: 15,
	long_text: 45,
	email: 12,
	phone_number: 15,
	website: 12,

	// Selection fields
	multiple_choice: 10,
	picture_choice: 12,
	dropdown: 12,
	yes_no: 5,
	ranking: 20,

	// Scale/rating fields
	rating: 8,
	opinion_scale: 8,
	nps: 8,

	// Complex fields
	address: 60,
	contact_info: 45,
	date: 10,
	number: 10,
	slider: 8,
	signature: 30,
	file_upload: 20,
	payment: 60,

	// Display fields (minimal time)
	statement: 5,
	legal: 15,
	group: 0,
	matrix: 30,
};

/**
 * Calculate the estimated time to complete a form in seconds
 */
export function calculateTimeEstimate(content: FormContent): number {
	let totalSeconds = 0;

	for (const field of content.fields) {
		const fieldTime = FIELD_TIME_ESTIMATES[field.type] ?? 15;
		totalSeconds += fieldTime;
	}

	// Add time for welcome screens (reading time)
	totalSeconds += content.welcomeScreens.length * 10;

	return totalSeconds;
}

/**
 * Format seconds into a human-readable time string
 * @returns String like "About 2 min" or "About 30 sec"
 */
export function formatTimeEstimate(seconds: number): string {
	if (seconds < 60) {
		return `About ${Math.round(seconds / 10) * 10} sec`;
	}

	const minutes = Math.round(seconds / 60);
	return `About ${minutes} min`;
}

/**
 * Calculate remaining time based on answered fields
 */
export function calculateRemainingTime(
	content: FormContent,
	answeredFieldRefs: string[],
): number {
	let totalSeconds = 0;

	for (const field of content.fields) {
		// Skip already answered fields
		if (answeredFieldRefs.includes(field.ref)) {
			continue;
		}

		const fieldTime = FIELD_TIME_ESTIMATES[field.type] ?? 15;
		totalSeconds += fieldTime;
	}

	return totalSeconds;
}
