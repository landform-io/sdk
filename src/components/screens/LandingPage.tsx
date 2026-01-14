import React from "react";
import type {
	WelcomeScreen,
	FormField,
	FormTheme,
	LandingPageTemplate,
	FieldAnswer,
	MultipleChoiceField,
	YesNoField,
} from "../../types";

export interface LandingPageProps {
	screen: WelcomeScreen;
	field?: FormField;
	template: LandingPageTemplate;
	theme: FormTheme;
	value?: FieldAnswer;
	error?: string | null;
	onFieldAnswer: (ref: string, value: FieldAnswer) => void;
	onNext: () => void;
}

export function LandingPage({
	screen,
	field,
	template,
	theme,
	value,
	error,
	onFieldAnswer,
	onNext,
}: LandingPageProps) {
	const { title, properties, sideImages } = screen;
	const { header, sideContent, termsFooter, choiceLayout = "row" } = template;

	// Get images from screen.sideImages or template.sideContent.defaultImages
	const images = sideImages?.length
		? sideImages
		: sideContent?.defaultImages?.map((url) => ({ type: "image" as const, href: url })) || [];

	// Handle choice selection
	const handleChoiceClick = (choiceRef: string) => {
		if (!field) return;
		onFieldAnswer(field.ref, [choiceRef]);
		onNext();
	};

	// Get choice labels for terms template
	const getChoiceLabels = (): string => {
		if (!field) return "";
		if (field.type === "multiple_choice") {
			const mcField = field as MultipleChoiceField;
			return mcField.properties.choices.map((c) => `"${c.label}"`).join(" or ");
		}
		if (field.type === "yes_no") {
			return '"Yes" or "No"';
		}
		return "";
	};

	// Render terms footer with placeholders replaced
	const renderTermsFooter = () => {
		if (!termsFooter?.enabled || !termsFooter.template) return null;

		let text = termsFooter.template;
		const links = termsFooter.links || {};

		// Replace placeholders
		text = text.replace("{choices}", getChoiceLabels());

		const renderLink = (key: string, url: string | undefined, label: string) => {
			if (!url) return label;
			return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="lf-landing-terms-link">${label}</a>`;
		};

		// Build terms HTML
		let termsHtml = text
			.replace("{termsLink}", renderLink("terms", links.terms, "Terms & Conditions"))
			.replace("{privacyLink}", renderLink("privacy", links.privacy, "Privacy Policy"))
			.replace("{subscriptionLink}", renderLink("subscription", links.subscription, "Subscription Terms"))
			.replace("{cookieLink}", renderLink("cookies", links.cookies, "Cookie Policy"));

		return (
			<p
				className="lf-landing-terms"
				dangerouslySetInnerHTML={{ __html: termsHtml }}
			/>
		);
	};

	// Render inline field (simplified for landing page)
	const renderField = () => {
		if (!field) return null;

		if (field.type === "multiple_choice") {
			const mcField = field as MultipleChoiceField;
			const choices = mcField.properties.choices;

			return (
				<div className="lf-landing-field">
					<p className="lf-landing-field-title">{field.title}</p>
					<div
						className={`lf-landing-choices ${choiceLayout === "row" ? "lf-landing-choices-row" : "lf-landing-choices-column"}`}
					>
						{choices.map((choice, index) => (
							<button
								key={choice.ref}
								type="button"
								className="lf-landing-choice-btn"
								onClick={() => handleChoiceClick(choice.ref)}
								style={{
									backgroundColor:
										index === 0
											? "var(--lf-color-primary)"
											: "var(--lf-color-secondary, var(--lf-color-primary))",
								}}
							>
								{choice.label}
							</button>
						))}
					</div>
				</div>
			);
		}

		if (field.type === "yes_no") {
			const ynField = field as YesNoField;
			return (
				<div className="lf-landing-field">
					<p className="lf-landing-field-title">{field.title}</p>
					<div
						className={`lf-landing-choices ${choiceLayout === "row" ? "lf-landing-choices-row" : "lf-landing-choices-column"}`}
					>
						<button
							type="button"
							className="lf-landing-choice-btn"
							onClick={() => {
								onFieldAnswer(field.ref, true);
								onNext();
							}}
							style={{ backgroundColor: "var(--lf-color-primary)" }}
						>
							Yes
						</button>
						<button
							type="button"
							className="lf-landing-choice-btn"
							onClick={() => {
								onFieldAnswer(field.ref, false);
								onNext();
							}}
							style={{
								backgroundColor: "var(--lf-color-secondary, var(--lf-color-primary))",
							}}
						>
							No
						</button>
					</div>
				</div>
			);
		}

		// Fallback for unsupported field types
		return (
			<div className="lf-landing-field">
				<p className="lf-landing-field-title">{field.title}</p>
				<p style={{ opacity: 0.6, fontSize: "0.875rem" }}>
					This field type is not supported on landing pages.
				</p>
			</div>
		);
	};

	// Determine layout class
	const layoutClass =
		template.layout === "split-right"
			? "lf-landing-split-right"
			: template.layout === "split-left"
				? "lf-landing-split-left"
				: "lf-landing-centered";

	return (
		<div className={`lf-landing-page ${layoutClass}`}>
			{/* Header */}
			{header?.enabled && (
				<header className="lf-landing-header">
					<div className="lf-landing-header-left">
						{header.showLogo && theme.branding?.logoUrl && (
							<img
								src={theme.branding.logoUrl}
								alt={theme.branding.brandName || "Logo"}
								className="lf-landing-logo"
							/>
						)}
						{header.showLogo && !theme.branding?.logoUrl && theme.branding?.brandName && (
							<span className="lf-landing-brand">{theme.branding.brandName}</span>
						)}
					</div>
					<div className="lf-landing-header-right">
						{header.links?.map((link, index) => (
							<a
								key={index}
								href={link.url}
								className={`lf-landing-header-link ${link.style === "button" ? "lf-landing-header-link-button" : ""}`}
							>
								{link.label}
							</a>
						))}
					</div>
				</header>
			)}

			{/* Main content */}
			<div className="lf-landing-main">
				{/* Content side */}
				<div className="lf-landing-content">
					<h1 className="lf-landing-title">{title}</h1>

					{properties.subtitle && (
						<p className="lf-landing-subtitle">{properties.subtitle}</p>
					)}

					{properties.description && (
						<p className="lf-landing-description">{properties.description}</p>
					)}

					{/* Inline field */}
					{field && template.mergeFirstField && renderField()}

					{/* Start button (only if no merged field or hideWelcomeButton is false) */}
					{(!template.mergeFirstField || !template.hideWelcomeButton) &&
						properties.showButton && (
							<button
								type="button"
								className="lf-button lf-landing-start-btn"
								onClick={onNext}
							>
								{properties.buttonText || "Start"}
							</button>
						)}

					{/* Terms footer */}
					{renderTermsFooter()}

					{/* Error */}
					{error && <p className="lf-error">{error}</p>}
				</div>

				{/* Images side (for split layouts) */}
				{sideContent?.enabled && images.length > 0 && (
					<div
						className="lf-landing-side"
						style={{
							gap: sideContent.gap || "1rem",
						}}
					>
						{images.map((img, index) => (
							<img
								key={index}
								src={img.href}
								alt={"properties" in img && img.properties?.description ? img.properties.description : `Image ${index + 1}`}
								className="lf-landing-side-image"
								style={{
									borderRadius: sideContent.borderRadius || "16px",
								}}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
