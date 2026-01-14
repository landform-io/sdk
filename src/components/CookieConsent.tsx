import React, { useState, useEffect } from "react";
import { hasCookieConsent, setCookieConsent } from "../utils/storage";

export interface CookieConsentProps {
	onAccept: () => void;
}

export function CookieConsent({ onAccept }: CookieConsentProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Check if consent has already been given
		if (!hasCookieConsent()) {
			setIsVisible(true);
		}
	}, []);

	const handleAccept = () => {
		setCookieConsent(true);
		setIsVisible(false);
		onAccept();
	};

	if (!isVisible) {
		return null;
	}

	return (
		<div
			className="lf-cookie-consent"
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 1000,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "rgba(0, 0, 0, 0.5)",
			}}
		>
			<div
				style={{
					maxWidth: "400px",
					margin: "1rem",
					padding: "1.5rem",
					backgroundColor: "var(--lf-color-surface, #fff)",
					borderRadius: "var(--lf-border-radius, 8px)",
					boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
				}}
			>
				<div
					style={{
						width: "48px",
						height: "48px",
						margin: "0 auto 1rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "color-mix(in srgb, var(--lf-color-primary) 15%, transparent)",
						borderRadius: "50%",
					}}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="var(--lf-color-primary)"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<circle cx="8" cy="9" r="1" fill="currentColor" />
						<circle cx="15" cy="9" r="1" fill="currentColor" />
						<circle cx="9" cy="14" r="1" fill="currentColor" />
						<circle cx="14" cy="14" r="1" fill="currentColor" />
						<circle cx="12" cy="12" r="1" fill="currentColor" />
					</svg>
				</div>

				<h2
					className="lf-question-title"
					style={{
						fontSize: "1.25rem",
						textAlign: "center",
						marginBottom: "0.75rem",
					}}
				>
					Cookie consent
				</h2>

				<p
					className="lf-question-description"
					style={{
						textAlign: "center",
						marginBottom: "1.5rem",
						fontSize: "0.875rem",
						lineHeight: 1.5,
					}}
				>
					This form uses cookies to save your progress and provide a better
					experience. By continuing, you agree to the use of cookies.
				</p>

				<button
					type="button"
					onClick={handleAccept}
					className="lf-button"
					style={{
						width: "100%",
						padding: "0.75rem 1.5rem",
						fontSize: "1rem",
					}}
				>
					Accept and continue
				</button>
			</div>
		</div>
	);
}
