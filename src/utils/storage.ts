import type { ResponseAnswers } from "../types";

const AUTOSAVE_PREFIX = "lf-autosave-";
const SUBMITTED_PREFIX = "lf-submitted-";
const COOKIE_CONSENT_KEY = "lf-cookie-consent";

interface AutosaveData {
	answers: ResponseAnswers;
	currentIndex: number;
	responseId: string | null;
	timestamp: number;
}

/**
 * Save form progress to localStorage
 */
export function saveProgress(
	projectId: string,
	answers: ResponseAnswers,
	currentIndex: number,
	responseId: string | null
): void {
	if (typeof window === "undefined") return;

	try {
		const data: AutosaveData = {
			answers,
			currentIndex,
			responseId,
			timestamp: Date.now(),
		};
		localStorage.setItem(AUTOSAVE_PREFIX + projectId, JSON.stringify(data));
	} catch (error) {
		console.error("Error saving form progress:", error);
	}
}

/**
 * Load form progress from localStorage
 * Returns null if no saved progress or if progress is older than 7 days
 */
export function loadProgress(projectId: string): AutosaveData | null {
	if (typeof window === "undefined") return null;

	try {
		const stored = localStorage.getItem(AUTOSAVE_PREFIX + projectId);
		if (!stored) return null;

		const data: AutosaveData = JSON.parse(stored);

		// Expire after 7 days
		const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
		if (Date.now() - data.timestamp > maxAge) {
			clearProgress(projectId);
			return null;
		}

		return data;
	} catch (error) {
		console.error("Error loading form progress:", error);
		return null;
	}
}

/**
 * Clear saved form progress
 */
export function clearProgress(projectId: string): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem(AUTOSAVE_PREFIX + projectId);
	} catch (error) {
		console.error("Error clearing form progress:", error);
	}
}

/**
 * Mark a form as submitted (for duplicate prevention)
 */
export function markAsSubmitted(projectId: string): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem(SUBMITTED_PREFIX + projectId, String(Date.now()));
	} catch (error) {
		console.error("Error marking form as submitted:", error);
	}
}

/**
 * Check if a form has already been submitted
 */
export function hasSubmitted(projectId: string): boolean {
	if (typeof window === "undefined") return false;

	try {
		return localStorage.getItem(SUBMITTED_PREFIX + projectId) !== null;
	} catch (error) {
		console.error("Error checking submission status:", error);
		return false;
	}
}

/**
 * Check if user has given cookie consent
 */
export function hasCookieConsent(): boolean {
	if (typeof window === "undefined") return false;

	try {
		return localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
	} catch (error) {
		console.error("Error checking cookie consent:", error);
		return false;
	}
}

/**
 * Set cookie consent
 */
export function setCookieConsent(consented: boolean): void {
	if (typeof window === "undefined") return;

	try {
		if (consented) {
			localStorage.setItem(COOKIE_CONSENT_KEY, "true");
		} else {
			localStorage.removeItem(COOKIE_CONSENT_KEY);
		}
	} catch (error) {
		console.error("Error setting cookie consent:", error);
	}
}
