import React, { useState, useEffect } from "react";
import { FormProvider, useFormContext } from "./FormProvider";
import { useTheme, useThemeContext } from "../hooks/useTheme";
import { useScreenTransition } from "../hooks/useScreenTransition";
import { CustomScreenRenderer } from "./screens/CustomScreenRenderer";
import { UserTemplateScreen } from "./screens/UserTemplateScreen";
import { FieldRenderer } from "./fields/FieldRenderer";
import { NavigationControls } from "./navigation/NavigationControls";
import { ProgressBar } from "./navigation/ProgressBar";
import { TimeToComplete } from "./navigation/TimeToComplete";
import { CookieConsent } from "./CookieConsent";
import { Captcha } from "./Captcha";
import { Branding } from "./layout/Branding";
import { Header } from "./layout/Header";
import { QuestionTemplateWrapper } from "./layout/QuestionTemplateWrapper";
import { hasCookieConsent } from "../utils/storage";
import { getThemeVariableValue } from "../utils/liquid";
import type { UseFormOptions } from "../hooks/useForm";

export interface FormRendererProps extends UseFormOptions {
	className?: string;
}

export function FormRenderer(props: FormRendererProps) {
	const { className, ...formOptions } = props;

	return (
		<FormProvider {...formOptions}>
			<FormRendererInner
				className={className}
				theme={formOptions.theme}
				turnstileSiteKey={formOptions.turnstileSiteKey}
			/>
		</FormProvider>
	);
}

interface FormRendererInnerProps {
	className?: string;
	theme: UseFormOptions["theme"];
	turnstileSiteKey?: string;
}

function FormRendererInner({ className, theme, turnstileSiteKey }: FormRendererInnerProps) {
	const {
		currentItem,
		currentIndex,
		settings,
		isStarted,
		isCompleted,
		isDuplicateSubmission,
		showCaptcha,
		setCaptchaToken,
		submit,
		next,
		previous,
		answers,
		errors,
		setAnswer,
		progress,
		content,
		canGoBack,
		canGoNext,
	} = useFormContext();

	// Get theme from context (which has default variables injected by FormProvider)
	const themeFromContext = useThemeContext();
	const { backgroundStyle } = useTheme({ theme: themeFromContext });

	// Read display settings from theme variables (with fallback defaults)
	const showNavigationArrows = getThemeVariableValue(themeFromContext?.variables, "showNavigationArrows", true);
	const showKeyHintOnChoices = getThemeVariableValue(themeFromContext?.variables, "showKeyHintOnChoices", true);

	// Screen transitions
	const { transitionClass, isTransitioning, transitionStyle, shouldStagger } =
		useScreenTransition({
			transitions: themeFromContext?.screenTransitions,
			currentIndex,
		});

	// Get layout class from component variants
	const layoutClass = themeFromContext?.componentVariants?.layout
		? `lf-layout-${themeFromContext.componentVariants.layout}`
		: "lf-layout-default";

	// Get input/button style classes
	const inputStyleClass = themeFromContext?.componentVariants?.inputStyle
		? `lf-input-style-${themeFromContext.componentVariants.inputStyle}`
		: "";
	const buttonStyleClass = themeFromContext?.componentVariants?.buttonStyle
		? `lf-button-style-${themeFromContext.componentVariants.buttonStyle}`
		: "";

	// Cookie consent state
	const [showCookieConsent, setShowCookieConsent] = useState(false);
	const [hasConsent, setHasConsent] = useState(true);

	useEffect(() => {
		if (settings.showCookieConsent && !hasCookieConsent()) {
			setShowCookieConsent(true);
			setHasConsent(false);
		}
	}, [settings.showCookieConsent]);

	const handleCookieConsentAccept = () => {
		setShowCookieConsent(false);
		setHasConsent(true);
	};

	// Show duplicate submission message
	if (isDuplicateSubmission) {
		return (
			<div className={`lf-form ${className || ""}`} style={backgroundStyle}>
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
								backgroundColor: "var(--lf-color-primary)",
								opacity: 0.1,
								borderRadius: "50%",
							}}
						>
							<svg
								width="40"
								height="40"
								viewBox="0 0 24 24"
								fill="none"
								stroke="var(--lf-color-primary)"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
								<polyline points="22 4 12 14.01 9 11.01" />
							</svg>
						</div>
						<h1 className="lf-question-title" style={{ marginBottom: "0.75rem" }}>
							You&apos;ve already submitted
						</h1>
						<p className="lf-question-description">
							You have already submitted a response to this form.
						</p>
					</div>
				</div>
				<Branding />
			</div>
		);
	}

	if (!currentItem) {
		return (
			<div className={`lf-form ${className || ""}`}>
				<div className="lf-screen">Loading...</div>
			</div>
		);
	}

	// Combine all classes for the form container
	const formClasses = [
		"lf-form",
		layoutClass,
		inputStyleClass,
		buttonStyleClass,
		className || "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={formClasses} style={backgroundStyle}>
			{/* Cookie Consent Banner */}
			{showCookieConsent && (
				<CookieConsent onAccept={handleCookieConsentAccept} />
			)}

			{/* CAPTCHA Modal */}
			{showCaptcha && turnstileSiteKey && (
				<div
					className="lf-captcha-modal"
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
							textAlign: "center",
						}}
					>
						<h2
							className="lf-question-title"
							style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}
						>
							Please verify you&apos;re human
						</h2>
						<p
							className="lf-question-description"
							style={{ marginBottom: "1rem", fontSize: "0.875rem", opacity: 0.7 }}
						>
							Complete the verification below to submit your response.
						</p>
						<Captcha
							siteKey={turnstileSiteKey}
							onVerify={(token) => {
								setCaptchaToken(token);
								submit();
							}}
						/>
					</div>
				</div>
			)}

			{/* Progress Bar */}
			{isStarted && !isCompleted && <ProgressBar />}

			{/* Header */}
			{isStarted && !isCompleted && <Header />}

			{/* Time to Complete */}
			<TimeToComplete />

			{/* Screen Wrapper with Transitions */}
			<div
				className={`lf-screen-wrapper ${transitionClass}`}
				style={transitionStyle}
			>
				{/* Main Content */}
				<div
					className={`lf-question-container lf-screen-content ${shouldStagger ? "lf-stagger-children" : ""}`}
					style={{
						...(themeFromContext?.componentVariants?.containerMaxWidth && {
							maxWidth: themeFromContext.componentVariants.containerMaxWidth,
						}),
						...(!hasConsent && { opacity: 0.3, pointerEvents: "none" }),
					}}
				>
					{currentItem.type === "field" && (
						themeFromContext?.questionPageTemplate ? (
							<QuestionTemplateWrapper
								template={themeFromContext.questionPageTemplate}
								onNext={next}
								onBack={previous}
								variables={themeFromContext.variables}
								runtimeContext={{
									progress,
									questionNumber: currentItem.index + 1,
									totalQuestions: content.fields.length,
									canGoBack,
									canGoNext,
									fieldType: currentItem.field.type,
									isRequired: currentItem.field.validations?.required ?? false,
								}}
							>
								<FieldRenderer
									field={currentItem.field}
									value={answers[currentItem.field.ref]}
									error={errors[currentItem.field.ref] || null}
									onChange={(value) => setAnswer(currentItem.field.ref, value)}
									onNext={next}
									questionNumber={currentItem.index + 1}
									showKeyHints={showKeyHintOnChoices}
									systemMessages={settings.systemMessages}
								/>
							</QuestionTemplateWrapper>
						) : (
							<FieldRenderer
								field={currentItem.field}
								value={answers[currentItem.field.ref]}
								error={errors[currentItem.field.ref] || null}
								onChange={(value) => setAnswer(currentItem.field.ref, value)}
								onNext={next}
								questionNumber={currentItem.index + 1}
								showKeyHints={showKeyHintOnChoices}
								systemMessages={settings.systemMessages}
							/>
						)
					)}

					{currentItem.type === "custom" && (
						<CustomScreenRenderer
							screen={currentItem.screen}
							theme={themeFromContext}
							progress={progress / 100}
							onNext={next}
						/>
					)}

					{currentItem.type === "user-template" && (
						<UserTemplateScreen
							screen={currentItem.screen}
							template={currentItem.template}
							onNext={next}
							onBack={previous}
							variables={themeFromContext?.variables}
							runtimeContext={{
								progress,
								questionNumber: currentIndex + 1,
								totalQuestions: content.fields.length,
								canGoBack,
								canGoNext,
							}}
						/>
					)}
				</div>
			</div>

			{/* Navigation - disabled during transitions, hidden when using custom question template */}
			{showNavigationArrows && isStarted && currentItem.type === "field" && !themeFromContext?.questionPageTemplate && (
				<NavigationControls disabled={isTransitioning} />
			)}

			{/* Branding */}
			<Branding />
		</div>
	);
}
