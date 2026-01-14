import React, { useEffect, useRef, useState, useCallback } from "react";

declare global {
	interface Window {
		turnstile?: {
			render: (
				container: HTMLElement,
				options: {
					sitekey: string;
					callback: (token: string) => void;
					"error-callback"?: () => void;
					"expired-callback"?: () => void;
					theme?: "light" | "dark" | "auto";
					size?: "normal" | "compact";
				}
			) => string;
			reset: (widgetId: string) => void;
			remove: (widgetId: string) => void;
		};
	}
}

export interface CaptchaProps {
	siteKey: string;
	onVerify: (token: string) => void;
	onError?: () => void;
	onExpired?: () => void;
	theme?: "light" | "dark" | "auto";
	size?: "normal" | "compact";
}

/**
 * Cloudflare Turnstile CAPTCHA component
 */
export function Captcha({
	siteKey,
	onVerify,
	onError,
	onExpired,
	theme = "auto",
	size = "normal",
}: CaptchaProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const initializeTurnstile = useCallback(() => {
		if (!containerRef.current || !window.turnstile) return;

		// Clear any existing widget
		if (widgetIdRef.current) {
			try {
				window.turnstile.remove(widgetIdRef.current);
			} catch (e) {
				// Ignore removal errors
			}
		}

		try {
			widgetIdRef.current = window.turnstile.render(containerRef.current, {
				sitekey: siteKey,
				callback: (token: string) => {
					setIsLoading(false);
					onVerify(token);
				},
				"error-callback": () => {
					setIsLoading(false);
					setError("Verification failed. Please try again.");
					onError?.();
				},
				"expired-callback": () => {
					setError("Verification expired. Please try again.");
					onExpired?.();
				},
				theme,
				size,
			});
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			setError("Failed to initialize CAPTCHA.");
			onError?.();
		}
	}, [siteKey, onVerify, onError, onExpired, theme, size]);

	useEffect(() => {
		// Check if Turnstile is already loaded
		if (window.turnstile) {
			initializeTurnstile();
			return;
		}

		// Load Turnstile script
		const existingScript = document.querySelector(
			'script[src*="challenges.cloudflare.com/turnstile"]'
		);
		if (existingScript) {
			// Script exists, wait for it to load
			existingScript.addEventListener("load", initializeTurnstile);
			return;
		}

		const script = document.createElement("script");
		script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
		script.async = true;
		script.defer = true;
		script.onload = initializeTurnstile;
		script.onerror = () => {
			setIsLoading(false);
			setError("Failed to load CAPTCHA. Please refresh the page.");
			onError?.();
		};
		document.head.appendChild(script);

		return () => {
			// Cleanup widget on unmount
			if (widgetIdRef.current && window.turnstile) {
				try {
					window.turnstile.remove(widgetIdRef.current);
				} catch (e) {
					// Ignore removal errors
				}
			}
		};
	}, [initializeTurnstile, onError]);

	return (
		<div
			className="lf-captcha"
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "0.75rem",
				padding: "1rem 0",
			}}
		>
			{isLoading && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						color: "var(--lf-color-question)",
						opacity: 0.7,
					}}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="animate-spin"
					>
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
							fill="none"
							opacity="0.25"
						/>
						<path d="M4 12a8 8 0 0 1 8-8" opacity="0.75" />
					</svg>
					<span style={{ fontSize: "0.875rem" }}>Loading verification...</span>
				</div>
			)}

			<div ref={containerRef} />

			{error && (
				<p
					style={{
						color: "var(--lf-color-error, #ef4444)",
						fontSize: "0.875rem",
						textAlign: "center",
					}}
				>
					{error}
				</p>
			)}
		</div>
	);
}

export default Captcha;
