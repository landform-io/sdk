import type {
	ResponseAnswers,
	ResponseMetadata,
	ResponseOutcome,
} from "../types";

export interface LandformClientConfig {
	baseUrl?: string;
	projectId: string;
	onError?: (error: Error) => void;
}

export interface StartResponseParams {
	sessionId?: string;
	metadata?: ResponseMetadata;
	hiddenFields?: Record<string, string>;
}

export interface StartResponseResult {
	id: string;
	sessionId: string;
}

export interface UpdateAnswersParams {
	responseId: string;
	sessionId: string;
	answers: ResponseAnswers;
	lastFieldRef?: string;
	calculatedValues?: Record<string, number>;
}

export interface CompleteResponseParams {
	responseId: string;
	sessionId: string;
	answers?: ResponseAnswers;
	outcome?: ResponseOutcome;
	calculatedValues?: Record<string, number>;
	captchaToken?: string;
}

export interface TrackEventParams {
	event: "view" | "start";
	sessionId?: string;
}

export class LandformClient {
	private baseUrl: string;
	private projectId: string;
	private onError?: (error: Error) => void;

	constructor(config: LandformClientConfig) {
		this.baseUrl = config.baseUrl || "";
		this.projectId = config.projectId;
		this.onError = config.onError;
	}

	async startResponse(
		params: StartResponseParams = {},
	): Promise<StartResponseResult> {
		try {
			const response = await fetch(`${this.baseUrl}/api/responses`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					projectId: this.projectId,
					sessionId: params.sessionId,
					metadata: params.metadata,
					hiddenFields: params.hiddenFields,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Failed to start response: ${response.status} ${errorText}`,
				);
			}

			return response.json();
		} catch (error) {
			this.onError?.(error as Error);
			throw error;
		}
	}

	async updateAnswers(params: UpdateAnswersParams): Promise<void> {
		try {
			const response = await fetch(
				`${this.baseUrl}/api/responses/${params.responseId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						"x-session-id": params.sessionId,
					},
					body: JSON.stringify({
						answers: params.answers,
						lastFieldRef: params.lastFieldRef,
						calculatedValues: params.calculatedValues,
					}),
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Failed to update answers: ${response.status} ${errorText}`,
				);
			}
		} catch (error) {
			this.onError?.(error as Error);
			throw error;
		}
	}

	async completeResponse(params: CompleteResponseParams): Promise<void> {
		try {
			const response = await fetch(
				`${this.baseUrl}/api/responses/${params.responseId}/complete`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-session-id": params.sessionId,
					},
					body: JSON.stringify({
						answers: params.answers,
						outcome: params.outcome,
						calculatedValues: params.calculatedValues,
						captchaToken: params.captchaToken,
					}),
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Failed to complete response: ${response.status} ${errorText}`,
				);
			}
		} catch (error) {
			this.onError?.(error as Error);
			throw error;
		}
	}

	async trackEvent(params: TrackEventParams): Promise<void> {
		try {
			const response = await fetch(`${this.baseUrl}/api/analytics/track`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					projectId: this.projectId,
					event: params.event,
					sessionId: params.sessionId,
				}),
			});

			if (!response.ok) {
				// Silently fail for tracking - don't interrupt user experience
				console.warn(`Analytics tracking failed: ${response.status}`);
			}
		} catch (error) {
			// Silently fail for tracking - don't interrupt user experience
			console.warn("Analytics tracking failed:", error);
		}
	}
}

export function createClient(config: LandformClientConfig): LandformClient {
	return new LandformClient(config);
}
