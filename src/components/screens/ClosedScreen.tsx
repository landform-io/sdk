import React from "react";

export interface ClosedScreenProps {
	title?: string;
	message?: string;
	type?: "scheduled" | "limit" | "closed";
}

export function ClosedScreen({
	title,
	message,
	type = "closed",
}: ClosedScreenProps) {
	const defaultTitle =
		type === "scheduled"
			? "Form not available"
			: type === "limit"
			? "Response limit reached"
			: "Form closed";

	const defaultMessage =
		type === "scheduled"
			? "This form is not currently accepting responses."
			: type === "limit"
			? "This form has reached its maximum number of responses."
			: "This form is no longer accepting responses.";

	const iconPath =
		type === "limit" ? (
			// Bar chart icon for limit reached
			<>
				<line x1="18" y1="20" x2="18" y2="10" />
				<line x1="12" y1="20" x2="12" y2="4" />
				<line x1="6" y1="20" x2="6" y2="14" />
			</>
		) : type === "scheduled" ? (
			// Clock icon for scheduling
			<>
				<circle cx="12" cy="12" r="10" />
				<polyline points="12 6 12 12 16 14" />
			</>
		) : (
			// Lock icon for closed
			<>
				<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
				<path d="M7 11V7a5 5 0 0 1 10 0v4" />
			</>
		);

	return (
		<div className="lf-form">
			<div className="lf-question-container">
				<div className="lf-screen" style={{ textAlign: "center" }}>
					<div
						style={{
							width: "80px",
							height: "80px",
							margin: "0 auto 1.5rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "color-mix(in srgb, var(--lf-color-primary, #6366f1) 15%, transparent)",
							borderRadius: "50%",
						}}
					>
						<svg
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--lf-color-primary, #6366f1)"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							{iconPath}
						</svg>
					</div>
					<h1
						className="lf-question-title"
						style={{
							fontSize: "2rem",
							marginBottom: "0.75rem",
							color: "var(--lf-color-question, #1f2937)",
						}}
					>
						{title || defaultTitle}
					</h1>
					<p
						className="lf-question-description"
						style={{
							fontSize: "1.125rem",
							color: "var(--lf-color-question, #1f2937)",
							opacity: 0.7,
						}}
					>
						{message || defaultMessage}
					</p>
				</div>
			</div>
		</div>
	);
}
