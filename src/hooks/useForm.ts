import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { nanoid } from "nanoid";
import type {
	FormContent,
	FormTheme,
	FormSettings,
	FormField,
	WelcomeScreen,
	ThankYouScreen,
	ResponseAnswers,
	FieldAnswer,
	ScreenItem,
} from "../types";
import { LandformClient } from "../api/client";
import {
	saveProgress,
	loadProgress,
	clearProgress,
	markAsSubmitted,
	hasSubmitted,
} from "../utils/storage";

export interface UseFormOptions {
	projectId: string;
	content: FormContent;
	theme: FormTheme;
	settings: FormSettings;
	baseUrl?: string;
	initialAnswers?: ResponseAnswers;
	turnstileSiteKey?: string;
	onComplete?: (answers: ResponseAnswers) => void;
	onError?: (error: Error) => void;
}

export interface UseFormReturn {
	// State
	currentIndex: number;
	currentItem: ScreenItem | null;
	answers: ResponseAnswers;
	errors: Record<string, string>;
	isStarted: boolean;
	isCompleted: boolean;
	isSubmitting: boolean;
	responseId: string | null;
	sessionId: string;
	isDuplicateSubmission: boolean;
	captchaToken: string | null;
	showCaptcha: boolean;

	// CAPTCHA Actions
	setCaptchaToken: (token: string) => void;

	// Computed
	sequence: ScreenItem[];
	totalFields: number;
	answeredCount: number;
	progress: number;
	canGoBack: boolean;
	canGoNext: boolean;
	isOnWelcome: boolean;
	isOnThankYou: boolean;
	isOnField: boolean;

	// Actions
	start: () => Promise<void>;
	next: (pendingValue?: FieldAnswer) => Promise<void>;
	previous: () => void;
	goTo: (index: number) => void;
	setAnswer: (fieldRef: string, value: FieldAnswer) => void;
	validateCurrent: () => boolean;
	submit: () => Promise<void>;
	reset: () => void;
}

function validateFieldValue(field: FormField, value: FieldAnswer | undefined): boolean {
	if (!field.validations?.required) {
		return true;
	}

	if (value === undefined || value === null || value === "") {
		return false;
	}

	if (Array.isArray(value) && value.length === 0) {
		return false;
	}

	return true;
}

export function useForm(options: UseFormOptions): UseFormReturn {
	const {
		projectId,
		content,
		settings,
		baseUrl = "",
		initialAnswers = {},
		onComplete,
		onError,
	} = options;

	// Core state
	const [responseId, setResponseId] = useState<string | null>(null);
	const [sessionId] = useState(() => nanoid());
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<ResponseAnswers>(initialAnswers);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isStarted, setIsStarted] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDuplicateSubmission, setIsDuplicateSubmission] = useState(false);
	const [captchaToken, setCaptchaToken] = useState<string | null>(null);
	const [showCaptcha, setShowCaptcha] = useState(false);

	// API client
	const client = useMemo(
		() => new LandformClient({ baseUrl, projectId, onError }),
		[baseUrl, projectId, onError]
	);

	// Track if view event has been sent (prevent duplicates on re-renders)
	const hasTrackedView = useRef(false);
	const hasLoadedProgress = useRef(false);
	const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Track view on mount
	useEffect(() => {
		if (!hasTrackedView.current) {
			hasTrackedView.current = true;
			client.trackEvent({ event: "view", sessionId });
		}
	}, [client, sessionId]);

	// Check for duplicate submission on mount
	useEffect(() => {
		if (settings.duplicatePrevention && hasSubmitted(projectId)) {
			setIsDuplicateSubmission(true);
		}
	}, [projectId, settings.duplicatePrevention]);

	// Load autosaved progress on mount
	useEffect(() => {
		if (hasLoadedProgress.current || !settings.autosaveProgress) return;
		hasLoadedProgress.current = true;

		const savedProgress = loadProgress(projectId);
		if (savedProgress) {
			setAnswers(savedProgress.answers);
			setCurrentIndex(savedProgress.currentIndex);
			if (savedProgress.responseId) {
				setResponseId(savedProgress.responseId);
				setIsStarted(true);
			}
		}
	}, [projectId, settings.autosaveProgress]);

	// Autosave progress when answers or currentIndex change
	useEffect(() => {
		if (!settings.autosaveProgress || isCompleted) return;

		// Debounce autosave
		if (autosaveTimeoutRef.current) {
			clearTimeout(autosaveTimeoutRef.current);
		}

		autosaveTimeoutRef.current = setTimeout(() => {
			saveProgress(projectId, answers, currentIndex, responseId);
		}, 500);

		return () => {
			if (autosaveTimeoutRef.current) {
				clearTimeout(autosaveTimeoutRef.current);
			}
		};
	}, [projectId, answers, currentIndex, responseId, settings.autosaveProgress, isCompleted]);

	// Build sequence of screens/fields
	const sequence = useMemo<ScreenItem[]>(() => {
		const items: ScreenItem[] = [];

		for (const screen of content.welcomeScreens) {
			items.push({ type: "welcome", screen });
		}

		content.fields.forEach((field, index) => {
			items.push({ type: "field", field, index });
		});

		for (const screen of content.thankYouScreens) {
			items.push({ type: "thankYou", screen });
		}

		return items;
	}, [content]);

	// Current item
	const currentItem = sequence[currentIndex] || null;

	// Computed values
	const totalFields = content.fields.length;
	const answeredCount = Object.keys(answers).length;
	const progress = totalFields > 0 ? (answeredCount / totalFields) * 100 : 0;
	const firstFieldIndex = content.welcomeScreens.length;
	const lastFieldIndex = firstFieldIndex + content.fields.length - 1;
	const canGoBack = currentIndex > firstFieldIndex;
	const canGoNext = currentIndex < sequence.length - 1;
	const isOnWelcome = currentItem?.type === "welcome";
	const isOnThankYou = currentItem?.type === "thankYou";
	const isOnField = currentItem?.type === "field";

	// Start response
	const start = useCallback(async () => {
		try {
			const result = await client.startResponse({ sessionId });
			setResponseId(result.id);
			setIsStarted(true);

			// Track start event
			client.trackEvent({ event: "start", sessionId });

			// Move past welcome screen if on one
			if (currentItem?.type === "welcome") {
				setCurrentIndex((prev) => prev + 1);
			}
		} catch (error) {
			onError?.(error as Error);
		}
	}, [client, sessionId, currentItem, onError]);

	// Validate current field (pendingValue allows validating before state updates)
	const validateCurrentWithValue = useCallback((pendingValue?: FieldAnswer): boolean => {
		if (currentItem?.type !== "field") return true;

		const field = currentItem.field;
		// Use pending value if provided, otherwise use state
		const value = pendingValue !== undefined ? pendingValue : answers[field.ref];
		const isValid = validateFieldValue(field, value);

		if (!isValid) {
			const requiredText =
				settings.systemMessages?.requiredText || "This field is required";
			setErrors((prev) => ({
				...prev,
				[field.ref]: requiredText,
			}));
		}

		return isValid;
	}, [currentItem, answers, settings.systemMessages?.requiredText]);

	const validateCurrent = useCallback((): boolean => {
		return validateCurrentWithValue();
	}, [validateCurrentWithValue]);

	// Submit response
	const submit = useCallback(async () => {
		if (!responseId) return;

		// If CAPTCHA is enabled but no token, show CAPTCHA first
		if (settings.captchaEnabled && !captchaToken) {
			setShowCaptcha(true);
			return;
		}

		setIsSubmitting(true);
		try {
			await client.completeResponse({
				responseId,
				sessionId,
				answers,
				captchaToken: captchaToken || undefined,
			});
			setIsCompleted(true);
			setCurrentIndex(sequence.length - 1); // Go to thank you screen

			// Clear autosaved progress and mark as submitted for duplicate prevention
			clearProgress(projectId);
			if (settings.duplicatePrevention) {
				markAsSubmitted(projectId);
			}

			onComplete?.(answers);
		} catch (error) {
			onError?.(error as Error);
		} finally {
			setIsSubmitting(false);
			setShowCaptcha(false);
		}
	}, [responseId, sessionId, answers, captchaToken, client, sequence.length, projectId, settings.captchaEnabled, settings.duplicatePrevention, onComplete, onError]);

	// Navigate next (pendingValue allows validation before state updates)
	const next = useCallback(async (pendingValue?: FieldAnswer) => {
		// Validate current field if applicable
		if (currentItem?.type === "field") {
			const isValid = validateCurrentWithValue(pendingValue);
			if (!isValid) {
				return;
			}

			// Check if last field - complete the response (this should await)
			if (currentIndex === lastFieldIndex) {
				// For final submission, merge pending value
				if (pendingValue !== undefined) {
					setAnswers((prev) => ({ ...prev, [currentItem.field.ref]: pendingValue }));
				}
				await submit();
				return;
			}

			// Merge pending value with answers for API call
			const answersToSave = pendingValue !== undefined
				? { ...answers, [currentItem.field.ref]: pendingValue }
				: answers;

			// Save answer in background (don't await - keeps UI responsive)
			if (responseId) {
				client.updateAnswers({
					responseId,
					sessionId,
					answers: answersToSave,
					lastFieldRef: currentItem.field.ref,
				}).catch((error) => {
					onError?.(error as Error);
				});
			}
		}

		setCurrentIndex((prev) => Math.min(prev + 1, sequence.length - 1));
	}, [
		currentItem,
		currentIndex,
		lastFieldIndex,
		sequence.length,
		responseId,
		sessionId,
		answers,
		client,
		onError,
		validateCurrentWithValue,
		submit,
	]);

	// Navigate previous
	const previous = useCallback(() => {
		setCurrentIndex((prev) => Math.max(prev - 1, firstFieldIndex));
	}, [firstFieldIndex]);

	// Go to specific index
	const goTo = useCallback(
		(index: number) => {
			if (index >= 0 && index < sequence.length) {
				setCurrentIndex(index);
			}
		},
		[sequence.length]
	);

	// Set answer
	const setAnswer = useCallback((fieldRef: string, value: FieldAnswer) => {
		setAnswers((prev) => ({ ...prev, [fieldRef]: value }));
		// Clear error when user provides input
		setErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[fieldRef];
			return newErrors;
		});
	}, []);

	// Reset form
	const reset = useCallback(() => {
		setResponseId(null);
		setCurrentIndex(0);
		setAnswers(initialAnswers);
		setErrors({});
		setIsStarted(false);
		setIsCompleted(false);
		setIsSubmitting(false);
	}, [initialAnswers]);

	// Auto-start if no welcome screens
	useEffect(() => {
		if (content.welcomeScreens.length === 0 && !isStarted) {
			start();
		}
	}, [content.welcomeScreens.length, isStarted, start]);

	return {
		// State
		currentIndex,
		currentItem,
		answers,
		errors,
		isStarted,
		isCompleted,
		isSubmitting,
		responseId,
		sessionId,
		isDuplicateSubmission,
		captchaToken,
		showCaptcha,

		// Computed
		sequence,
		totalFields,
		answeredCount,
		progress,
		canGoBack,
		canGoNext,
		isOnWelcome,
		isOnThankYou,
		isOnField,

		// Actions
		start,
		next,
		previous,
		goTo,
		setAnswer,
		validateCurrent,
		submit,
		reset,
		setCaptchaToken,
	};
}
