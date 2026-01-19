import type { FormTheme } from "../types";

/**
 * Convert border radius enum to CSS value
 */
export function radiusToCSS(radius: FormTheme["borders"]["radius"]): string {
	switch (radius) {
		case "none":
			return "0";
		case "small":
			return "4px";
		case "medium":
			return "8px";
		case "large":
			return "12px";
		case "full":
			return "9999px";
		default:
			return "0";
	}
}

/**
 * Generate CSS custom properties from theme
 * These variables use the --lf- prefix (Landform)
 */
export function generateThemeCSS(theme: FormTheme): string {
	const t = theme;

	return `
:root {
	/* Colors - Base */
	--lf-color-primary: ${t.colors.primary};
	--lf-color-secondary: ${t.colors.secondary};
	--lf-color-accent: ${t.colors.accent};

	/* Colors - Backgrounds */
	--lf-color-background: ${t.colors.background};
	--lf-color-surface: ${t.colors.surfaceBackground};
	--lf-color-input-bg: ${t.colors.inputBackground};
	--lf-color-input-border: ${t.colors.inputBorder};

	/* Colors - Text */
	--lf-color-question: ${t.colors.questionText};
	--lf-color-answer: ${t.colors.answerText};
	--lf-color-placeholder: ${t.colors.placeholderText};

	/* Colors - Buttons */
	--lf-color-button-bg: ${t.colors.buttonBackground};
	--lf-color-button-text: ${t.colors.buttonText};
	--lf-color-button-hover: ${t.colors.buttonHoverBackground};

	/* Colors - Selection */
	--lf-color-selected-bg: ${t.colors.selectedBackground};
	--lf-color-selected-border: ${t.colors.selectedBorder};

	/* Colors - Feedback */
	--lf-color-error: ${t.colors.errorColor};
	--lf-color-success: ${t.colors.successColor};

	/* Colors - Progress */
	--lf-color-progress-bg: ${t.colors.progressBackground};
	--lf-color-progress-fill: ${t.colors.progressFill};

	/* Typography - Question */
	--lf-font-question: ${t.typography.questionFont.family};
	--lf-font-size-question: ${t.typography.questionFont.size};
	--lf-font-weight-question: ${t.typography.questionFont.weight};
	--lf-line-height-question: ${t.typography.questionFont.lineHeight};
	${t.typography.questionFont.letterSpacing ? `--lf-letter-spacing-question: ${t.typography.questionFont.letterSpacing};` : ""}

	/* Typography - Answer */
	--lf-font-answer: ${t.typography.answerFont.family};
	--lf-font-size-answer: ${t.typography.answerFont.size};
	--lf-font-weight-answer: ${t.typography.answerFont.weight};
	--lf-line-height-answer: ${t.typography.answerFont.lineHeight};
	${t.typography.answerFont.letterSpacing ? `--lf-letter-spacing-answer: ${t.typography.answerFont.letterSpacing};` : ""}

	/* Typography - Button */
	--lf-font-button: ${t.typography.buttonFont.family};
	--lf-font-size-button: ${t.typography.buttonFont.size};
	--lf-font-weight-button: ${t.typography.buttonFont.weight};
	--lf-line-height-button: ${t.typography.buttonFont.lineHeight};

	/* Spacing */
	--lf-spacing-question: ${t.spacing.questionGap};
	--lf-spacing-option: ${t.spacing.optionGap};
	--lf-spacing-container: ${t.spacing.containerPadding};

	/* Borders */
	--lf-border-width: ${t.borders.inputBorderWidth};
	--lf-border-style: ${t.borders.inputBorderStyle};
	--lf-border-radius: ${radiusToCSS(t.borders.radius)};

	/* Animations */
	--lf-transition-duration: ${t.animations.transitionDuration};
	--lf-transition-easing: ${t.animations.transitionEasing};

	/* Screen Transitions */
	--lf-screen-transition-duration: ${t.screenTransitions?.duration || "0.4s"};
	--lf-screen-transition-easing: ${t.screenTransitions?.easing || "cubic-bezier(0.4, 0, 0.2, 1)"};
	--lf-screen-stagger-delay: ${t.screenTransitions?.staggerDelay || "0.05s"};
}
`.trim();
}

/**
 * Generate component-level CSS classes
 */
export function generateComponentStyles(): string {
	return `
/* ============================================================================
   Landform SDK - Component Styles
   ============================================================================ */

/* Form Container */
.lf-form {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: var(--lf-color-background);
	font-family: var(--lf-font-answer);
	color: var(--lf-color-answer);
}

/* Question Container */
.lf-question-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: var(--lf-spacing-container);
	max-width: 720px;
	margin: 0 auto;
	width: 100%;
}

/* Question Title */
.lf-question-title {
	font-family: var(--lf-font-question);
	font-size: var(--lf-font-size-question);
	font-weight: var(--lf-font-weight-question);
	line-height: var(--lf-line-height-question);
	color: var(--lf-color-question);
	margin: 0 0 0.5rem 0;
}

/* Question Description */
.lf-question-description {
	color: var(--lf-color-answer);
	opacity: 0.8;
	margin: 0;
}

/* Required Indicator */
.lf-required {
	color: var(--lf-color-error);
}

/* Success Icon */
.lf-success-icon {
	color: var(--lf-color-success);
	background-color: color-mix(in srgb, var(--lf-color-success) 15%, transparent);
	border-radius: 9999px;
}

/* Input Base */
.lf-input {
	width: 100%;
	padding: 0.75rem 1rem;
	font-family: var(--lf-font-answer);
	font-size: var(--lf-font-size-answer);
	color: var(--lf-color-answer);
	background-color: var(--lf-color-input-bg);
	border: var(--lf-border-width) var(--lf-border-style) var(--lf-color-input-border);
	border-radius: var(--lf-border-radius);
	outline: none;
	transition: border-color var(--lf-transition-duration) var(--lf-transition-easing);
}

.lf-input:focus {
	border-color: var(--lf-color-primary);
}

.lf-input::placeholder {
	color: var(--lf-color-placeholder);
}

/* Input Underline Style */
.lf-input-underline {
	width: 100%;
	padding: 0.75rem 0;
	font-family: var(--lf-font-answer);
	font-size: var(--lf-font-size-answer);
	color: var(--lf-color-answer);
	background-color: transparent;
	border: none;
	border-bottom: var(--lf-border-width) var(--lf-border-style) var(--lf-color-input-border);
	border-radius: 0;
	outline: none;
	transition: border-color var(--lf-transition-duration) var(--lf-transition-easing);
}

.lf-input-underline:focus {
	border-bottom-color: var(--lf-color-primary);
}

.lf-input-underline::placeholder {
	color: var(--lf-color-placeholder);
}

/* Choice Button */
.lf-choice {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
	padding: 1rem 1.25rem;
	font-family: var(--lf-font-answer);
	font-size: var(--lf-font-size-answer);
	color: var(--lf-color-answer);
	background-color: var(--lf-color-surface);
	border: var(--lf-border-width) var(--lf-border-style) var(--lf-color-input-border);
	border-radius: var(--lf-border-radius);
	cursor: pointer;
	transition: all var(--lf-transition-duration) var(--lf-transition-easing);
	text-align: left;
}

.lf-choice:hover {
	border-color: var(--lf-color-primary);
}

.lf-choice-selected {
	background-color: var(--lf-color-selected-bg);
	border-color: var(--lf-color-selected-border);
}

/* Key Hint */
.lf-key-hint {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 1.75rem;
	height: 1.75rem;
	padding: 0 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--lf-color-answer);
	background-color: var(--lf-color-background);
	border: 1px solid var(--lf-color-input-border);
	border-radius: var(--lf-border-radius);
}

.lf-choice-selected .lf-key-hint {
	background-color: var(--lf-color-primary);
	border-color: var(--lf-color-primary);
	color: var(--lf-color-button-text);
}

/* Button */
.lf-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	font-family: var(--lf-font-button);
	font-size: var(--lf-font-size-button);
	font-weight: var(--lf-font-weight-button);
	line-height: var(--lf-line-height-button);
	color: var(--lf-color-button-text);
	background-color: var(--lf-color-button-bg);
	border: none;
	border-radius: var(--lf-border-radius);
	cursor: pointer;
	transition: background-color var(--lf-transition-duration) var(--lf-transition-easing);
}

.lf-button:hover {
	background-color: var(--lf-color-button-hover);
}

.lf-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

/* Progress Bar */
.lf-progress {
	background-color: var(--lf-color-progress-bg);
	overflow: hidden;
}

.lf-progress-fill {
	background-color: var(--lf-color-progress-fill);
	transition: width var(--lf-transition-duration) var(--lf-transition-easing);
}

/* Rating Stars */
.lf-rating-star {
	cursor: pointer;
	color: var(--lf-color-input-border);
	transition: color var(--lf-transition-duration) var(--lf-transition-easing);
}

.lf-rating-star-active {
	color: var(--lf-color-primary);
}

.lf-rating-star:hover {
	color: var(--lf-color-primary);
}

/* Scale Button (Opinion Scale, NPS) */
.lf-scale-button {
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 2.5rem;
	height: 2.5rem;
	padding: 0.5rem;
	font-family: var(--lf-font-answer);
	font-size: var(--lf-font-size-answer);
	color: var(--lf-color-answer);
	background-color: var(--lf-color-surface);
	border: var(--lf-border-width) var(--lf-border-style) var(--lf-color-input-border);
	border-radius: var(--lf-border-radius);
	cursor: pointer;
	transition: all var(--lf-transition-duration) var(--lf-transition-easing);
}

.lf-scale-button:hover {
	border-color: var(--lf-color-primary);
}

.lf-scale-button-selected {
	background-color: var(--lf-color-primary);
	border-color: var(--lf-color-primary);
	color: var(--lf-color-button-text);
}

/* Navigation */
.lf-navigation {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem var(--lf-spacing-container);
	background-color: var(--lf-color-background);
	border-top: 1px solid var(--lf-color-input-border);
}

.lf-navigation-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	font-family: var(--lf-font-button);
	font-size: 0.875rem;
	color: var(--lf-color-answer);
	background-color: transparent;
	border: 1px solid var(--lf-color-input-border);
	border-radius: var(--lf-border-radius);
	cursor: pointer;
	transition: all var(--lf-transition-duration) var(--lf-transition-easing);
}

.lf-navigation-button:hover {
	border-color: var(--lf-color-primary);
	color: var(--lf-color-primary);
}

.lf-navigation-button:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

/* Error Message */
.lf-error {
	color: var(--lf-color-error);
	font-size: 0.875rem;
	margin-top: 0.5rem;
}

/* Branding */
.lf-branding {
	padding: 1rem;
	text-align: center;
	font-size: 0.75rem;
	color: var(--lf-color-placeholder);
}

.lf-branding a {
	color: var(--lf-color-primary);
	text-decoration: none;
}

.lf-branding a:hover {
	text-decoration: underline;
}

/* Picture Choice Grid */
.lf-picture-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	gap: var(--lf-spacing-option);
}

.lf-picture-card {
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background-color: var(--lf-color-surface);
	border: var(--lf-border-width) var(--lf-border-style) var(--lf-color-input-border);
	border-radius: var(--lf-border-radius);
	cursor: pointer;
	transition: all var(--lf-transition-duration) var(--lf-transition-easing);
}

.lf-picture-card:hover {
	border-color: var(--lf-color-primary);
}

.lf-picture-card-selected {
	border-color: var(--lf-color-selected-border);
	background-color: var(--lf-color-selected-bg);
}

.lf-picture-card img {
	width: 100%;
	aspect-ratio: 4/3;
	object-fit: cover;
}

.lf-picture-card-label {
	padding: 0.75rem;
	text-align: center;
	font-size: 0.875rem;
}

/* Thank You Screens */
.lf-screen {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	min-height: 100vh;
	padding: var(--lf-spacing-container);
}

.lf-screen-title {
	font-family: var(--lf-font-question);
	font-size: calc(var(--lf-font-size-question) * 1.25);
	font-weight: var(--lf-font-weight-question);
	color: var(--lf-color-question);
	margin: 0 0 1rem 0;
}

.lf-screen-description {
	font-size: var(--lf-font-size-answer);
	color: var(--lf-color-answer);
	opacity: 0.8;
	margin: 0 0 2rem 0;
	max-width: 480px;
}

/* Slider */
.lf-slider {
	width: 100%;
	height: 8px;
	appearance: none;
	background: var(--lf-color-progress-bg);
	border-radius: var(--lf-border-radius);
	outline: none;
}

.lf-slider::-webkit-slider-thumb {
	appearance: none;
	width: 24px;
	height: 24px;
	background: var(--lf-color-primary);
	border-radius: 50%;
	cursor: pointer;
}

.lf-slider::-moz-range-thumb {
	width: 24px;
	height: 24px;
	background: var(--lf-color-primary);
	border-radius: 50%;
	cursor: pointer;
	border: none;
}

/* Signature Canvas */
.lf-signature-canvas {
	border: var(--lf-border-width) var(--lf-border-style) var(--lf-color-input-border);
	border-radius: var(--lf-border-radius);
	background-color: var(--lf-color-input-bg);
	cursor: crosshair;
}

/* ============================================================================
   Component Variants - Card Style Choices (Quiz Template)
   ============================================================================ */

.lf-choice-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 1rem 1.25rem;
	font-family: var(--lf-font-answer);
	font-size: var(--lf-font-size-answer);
	color: var(--lf-color-answer);
	background-color: var(--lf-color-surface);
	border: none;
	border-radius: var(--lf-border-radius);
	cursor: pointer;
	transition: all var(--lf-transition-duration) var(--lf-transition-easing);
	text-align: left;
}

.lf-choice-card:hover {
	background-color: var(--lf-color-input-bg);
	transform: translateY(-1px);
}

.lf-choice-card-selected {
	background-color: var(--lf-color-selected-bg);
	color: var(--lf-color-button-text);
}

.lf-choice-card-selected:hover {
	background-color: var(--lf-color-selected-bg);
	transform: none;
}

/* Circular indicator for card choices */
.lf-choice-indicator {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	flex-shrink: 0;
	transition: all var(--lf-transition-duration) var(--lf-transition-easing);
}

/* Checkmark indicator style (default) */
.lf-choice-indicator-checkmark {
	border-radius: 50%;
	border: 2px solid var(--lf-color-input-border);
}

.lf-choice-card-selected .lf-choice-indicator-checkmark {
	background-color: var(--lf-color-button-text);
	border-color: var(--lf-color-button-text);
	color: var(--lf-color-selected-bg);
}

/* Arrow indicator style - no border, SVG handles circle */
.lf-choice-indicator svg {
	width: 18px;
	height: 18px;
}

/* ============================================================================
   Component Variants - Bottom Bar Navigation (Quiz Template)
   ============================================================================ */

.lf-navigation-bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 1.5rem var(--lf-spacing-container);
	background-color: var(--lf-color-background);
}

.lf-nav-btn-back {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 1.5rem;
	font-family: var(--lf-font-button);
	font-size: var(--lf-font-size-button);
	font-weight: var(--lf-font-weight-button);
	color: var(--lf-color-answer);
	background-color: var(--lf-color-background);
	border: 1px solid var(--lf-color-input-border);
	border-radius: var(--lf-border-radius);
	cursor: pointer;
	transition: all var(--lf-transition-duration) var(--lf-transition-easing);
}

.lf-nav-btn-back:hover {
	background-color: var(--lf-color-surface);
}

.lf-nav-btn-back:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.lf-nav-btn-next {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 2rem;
	font-family: var(--lf-font-button);
	font-size: var(--lf-font-size-button);
	font-weight: var(--lf-font-weight-button);
	color: var(--lf-color-button-text);
	background-color: var(--lf-color-button-bg);
	border: none;
	border-radius: var(--lf-border-radius);
	cursor: pointer;
	transition: all var(--lf-transition-duration) var(--lf-transition-easing);
}

.lf-nav-btn-next:hover {
	background-color: var(--lf-color-button-hover);
}

.lf-nav-btn-next:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

/* ============================================================================
   Component Variants - Centered Header (Quiz Template)
   ============================================================================ */

.lf-header-centered {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 1.5rem var(--lf-spacing-container);
}

.lf-header-logo {
	max-height: 48px;
	width: auto;
}

.lf-header-brand {
	margin-top: 0.5rem;
	font-size: 0.875rem;
	color: var(--lf-color-placeholder);
}
`.trim();
}

/**
 * Generate screen transition keyframes and classes
 */
export function generateTransitionStyles(): string {
	return `
/* ============================================================================
   Screen Transitions
   ============================================================================ */

/* Screen wrapper */
.lf-screen-wrapper {
	position: relative;
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
}

/* Base content state */
.lf-screen-content {
	will-change: transform, opacity;
}

/* Idle state */
.lf-transition-idle {
	opacity: 1;
	transform: none;
}

/* ---- FADE ---- */
.lf-transition-fade.lf-transition-exit {
	animation: lf-fade-out var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

.lf-transition-fade.lf-transition-enter {
	animation: lf-fade-in var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

@keyframes lf-fade-out {
	from { opacity: 1; }
	to { opacity: 0; }
}

@keyframes lf-fade-in {
	from { opacity: 0; }
	to { opacity: 1; }
}

/* ---- SLIDE LEFT ---- */
.lf-transition-slide-left.lf-transition-exit {
	animation: lf-slide-left-out var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

.lf-transition-slide-left.lf-transition-enter {
	animation: lf-slide-left-in var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

@keyframes lf-slide-left-out {
	from { transform: translateX(0); opacity: 1; }
	to { transform: translateX(-30px); opacity: 0; }
}

@keyframes lf-slide-left-in {
	from { transform: translateX(30px); opacity: 0; }
	to { transform: translateX(0); opacity: 1; }
}

/* ---- SLIDE RIGHT ---- */
.lf-transition-slide-right.lf-transition-exit {
	animation: lf-slide-right-out var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

.lf-transition-slide-right.lf-transition-enter {
	animation: lf-slide-right-in var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

@keyframes lf-slide-right-out {
	from { transform: translateX(0); opacity: 1; }
	to { transform: translateX(30px); opacity: 0; }
}

@keyframes lf-slide-right-in {
	from { transform: translateX(-30px); opacity: 0; }
	to { transform: translateX(0); opacity: 1; }
}

/* ---- SLIDE UP ---- */
.lf-transition-slide-up.lf-transition-exit {
	animation: lf-slide-up-out var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

.lf-transition-slide-up.lf-transition-enter {
	animation: lf-slide-up-in var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

@keyframes lf-slide-up-out {
	from { transform: translateY(0); opacity: 1; }
	to { transform: translateY(-20px); opacity: 0; }
}

@keyframes lf-slide-up-in {
	from { transform: translateY(20px); opacity: 0; }
	to { transform: translateY(0); opacity: 1; }
}

/* ---- SLIDE DOWN ---- */
.lf-transition-slide-down.lf-transition-exit {
	animation: lf-slide-down-out var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

.lf-transition-slide-down.lf-transition-enter {
	animation: lf-slide-down-in var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

@keyframes lf-slide-down-out {
	from { transform: translateY(0); opacity: 1; }
	to { transform: translateY(20px); opacity: 0; }
}

@keyframes lf-slide-down-in {
	from { transform: translateY(-20px); opacity: 0; }
	to { transform: translateY(0); opacity: 1; }
}

/* ---- ZOOM IN ---- */
.lf-transition-zoom-in.lf-transition-exit {
	animation: lf-zoom-in-out var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

.lf-transition-zoom-in.lf-transition-enter {
	animation: lf-zoom-in-in var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

@keyframes lf-zoom-in-out {
	from { transform: scale(1); opacity: 1; }
	to { transform: scale(1.05); opacity: 0; }
}

@keyframes lf-zoom-in-in {
	from { transform: scale(0.95); opacity: 0; }
	to { transform: scale(1); opacity: 1; }
}

/* ---- ZOOM OUT ---- */
.lf-transition-zoom-out.lf-transition-exit {
	animation: lf-zoom-out-out var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

.lf-transition-zoom-out.lf-transition-enter {
	animation: lf-zoom-out-in var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

@keyframes lf-zoom-out-out {
	from { transform: scale(1); opacity: 1; }
	to { transform: scale(0.95); opacity: 0; }
}

@keyframes lf-zoom-out-in {
	from { transform: scale(1.05); opacity: 0; }
	to { transform: scale(1); opacity: 1; }
}

/* ---- BLUR FADE ---- */
.lf-transition-blur-fade.lf-transition-exit {
	animation: lf-blur-fade-out var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

.lf-transition-blur-fade.lf-transition-enter {
	animation: lf-blur-fade-in var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

@keyframes lf-blur-fade-out {
	from { filter: blur(0); opacity: 1; }
	to { filter: blur(8px); opacity: 0; }
}

@keyframes lf-blur-fade-in {
	from { filter: blur(8px); opacity: 0; }
	to { filter: blur(0); opacity: 1; }
}

/* ---- STAGGER CHILDREN ---- */
.lf-stagger-children > * {
	opacity: 0;
	animation: lf-stagger-in var(--lf-screen-transition-duration) var(--lf-screen-transition-easing) forwards;
}

.lf-stagger-children > *:nth-child(1) { animation-delay: 0s; }
.lf-stagger-children > *:nth-child(2) { animation-delay: var(--lf-screen-stagger-delay); }
.lf-stagger-children > *:nth-child(3) { animation-delay: calc(var(--lf-screen-stagger-delay) * 2); }
.lf-stagger-children > *:nth-child(4) { animation-delay: calc(var(--lf-screen-stagger-delay) * 3); }
.lf-stagger-children > *:nth-child(5) { animation-delay: calc(var(--lf-screen-stagger-delay) * 4); }
.lf-stagger-children > *:nth-child(6) { animation-delay: calc(var(--lf-screen-stagger-delay) * 5); }

@keyframes lf-stagger-in {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}
`.trim();
}

/**
 * Generate layout template styles
 */
export function generateLayoutStyles(): string {
	return `
/* ============================================================================
   Layout Templates
   ============================================================================ */

/* ---- DEFAULT LAYOUT ---- */
.lf-layout-default {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.lf-layout-default .lf-question-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: var(--lf-spacing-container);
	max-width: 720px;
	margin: 0 auto;
	width: 100%;
}

/* ---- CENTERED LAYOUT ---- */
.lf-layout-centered {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.lf-layout-centered .lf-question-container {
	max-width: 600px;
	padding: var(--lf-spacing-container);
	text-align: center;
}

/* ---- LEFT ALIGNED LAYOUT ---- */
.lf-layout-left-aligned {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.lf-layout-left-aligned .lf-question-container {
	max-width: 720px;
	padding: var(--lf-spacing-container);
	padding-left: 10%;
}

@media (max-width: 768px) {
	.lf-layout-left-aligned .lf-question-container {
		padding-left: var(--lf-spacing-container);
	}
}

/* ---- SPLIT LAYOUTS ---- */
.lf-layout-split-left,
.lf-layout-split-right {
	min-height: 100vh;
	display: grid;
	grid-template-columns: 1fr 1fr;
}

@media (max-width: 768px) {
	.lf-layout-split-left,
	.lf-layout-split-right {
		grid-template-columns: 1fr;
	}

	.lf-split-background {
		display: none;
	}
}

.lf-split-background {
	background-size: cover;
	background-position: center;
}

.lf-layout-split-left .lf-split-background {
	order: 1;
}

.lf-layout-split-left .lf-split-content {
	order: 2;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: var(--lf-spacing-container);
}

.lf-layout-split-right .lf-split-background {
	order: 2;
}

.lf-layout-split-right .lf-split-content {
	order: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: var(--lf-spacing-container);
}

/* ---- CARD CENTER LAYOUT ---- */
.lf-layout-card-center {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: var(--lf-spacing-container);
}

.lf-layout-card-center .lf-card {
	background-color: var(--lf-color-surface);
	border-radius: var(--lf-border-radius);
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
	padding: 2.5rem;
	max-width: 480px;
	width: 100%;
}

/* ---- CARD BOTTOM LAYOUT ---- */
.lf-layout-card-bottom {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.lf-layout-card-bottom .lf-card {
	background-color: var(--lf-color-surface);
	border-radius: var(--lf-border-radius) var(--lf-border-radius) 0 0;
	box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1);
	padding: 2rem var(--lf-spacing-container);
	max-width: 100%;
}
`.trim();
}

/**
 * Generate input and button variant styles
 */
export function generateVariantStyles(): string {
	return `
/* ============================================================================
   Input Style Variants
   ============================================================================ */

/* ---- UNDERLINE INPUT ---- */
.lf-input-style-underline .lf-input {
	background: transparent;
	border: none;
	border-bottom: 2px solid var(--lf-color-input-border);
	border-radius: 0;
	padding-left: 0;
	padding-right: 0;
}

.lf-input-style-underline .lf-input:focus {
	border-bottom-color: var(--lf-color-primary);
}

/* ---- FILLED INPUT ---- */
.lf-input-style-filled .lf-input {
	background: var(--lf-color-surface);
	border: none;
	border-bottom: 2px solid transparent;
}

.lf-input-style-filled .lf-input:focus {
	border-bottom-color: var(--lf-color-primary);
}

/* ---- OUTLINED INPUT ---- */
.lf-input-style-outlined .lf-input {
	background: transparent;
	border: 2px solid var(--lf-color-input-border);
}

.lf-input-style-outlined .lf-input:focus {
	border-color: var(--lf-color-primary);
}

/* ============================================================================
   Button Style Variants
   ============================================================================ */

/* ---- SOLID BUTTON (default) ---- */
.lf-button-style-solid .lf-button {
	background: var(--lf-color-button-bg);
	color: var(--lf-color-button-text);
	border: none;
}

/* ---- OUTLINE BUTTON ---- */
.lf-button-style-outline .lf-button {
	background: transparent;
	color: var(--lf-color-primary);
	border: 2px solid var(--lf-color-primary);
}

.lf-button-style-outline .lf-button:hover {
	background: var(--lf-color-primary);
	color: var(--lf-color-button-text);
}

/* ---- GHOST BUTTON ---- */
.lf-button-style-ghost .lf-button {
	background: transparent;
	color: var(--lf-color-primary);
	border: none;
}

.lf-button-style-ghost .lf-button:hover {
	background: var(--lf-color-surface);
}

/* ---- GRADIENT BUTTON ---- */
.lf-button-style-gradient .lf-button {
	background: linear-gradient(135deg, var(--lf-color-primary), var(--lf-color-secondary));
	color: var(--lf-color-button-text);
	border: none;
}

.lf-button-style-gradient .lf-button:hover {
	filter: brightness(1.1);
}

/* ============================================================================
   Question Number Styles
   ============================================================================ */

.lf-question-number-inline {
	display: inline;
	margin-right: 0.5rem;
	opacity: 0.6;
}

.lf-question-number-badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 2rem;
	margin-right: 0.75rem;
	background: var(--lf-color-surface);
	border-radius: var(--lf-border-radius);
	font-size: 0.875rem;
	font-weight: 600;
}

.lf-question-number-circle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	margin-right: 0.75rem;
	background: var(--lf-color-primary);
	color: var(--lf-color-button-text);
	border-radius: 50%;
	font-size: 1rem;
	font-weight: 700;
}
`.trim();
}

/**
 * Generate custom screen template styles
 * For milestone, section, info, results-teaser, and CTA screens
 */
export function generateCustomScreenStyles(): string {
	return `
/* ============================================================================
   Custom Screen Templates
   ============================================================================ */

/* ---- Base Custom Screen ---- */
.lf-custom-screen {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	min-height: 100vh;
	padding: var(--lf-spacing-container);
}

/* ---- Milestone Screen ---- */
.lf-milestone-screen {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	min-height: 100vh;
	padding: var(--lf-spacing-container);
}

.lf-milestone-icon {
	margin-bottom: 1.5rem;
}

.lf-milestone-icon-emoji {
	font-size: 4rem;
	line-height: 1;
}

.lf-milestone-icon-image {
	width: 80px;
	height: 80px;
	object-fit: contain;
}

.lf-milestone-title {
	font-family: var(--lf-font-question);
	font-size: calc(var(--lf-font-size-question) * 1.25);
	font-weight: var(--lf-font-weight-question);
	color: var(--lf-color-question);
	margin: 0 0 0.75rem;
}

.lf-milestone-subtitle {
	font-size: var(--lf-font-size-answer);
	color: var(--lf-color-answer);
	opacity: 0.8;
	margin: 0 0 1.5rem;
	max-width: 400px;
}

.lf-milestone-progress {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 2rem;
	width: 100%;
	max-width: 300px;
}

.lf-milestone-progress-bar {
	width: 100%;
	height: 8px;
	background: var(--lf-color-progress-bg);
	border-radius: var(--lf-border-radius);
	overflow: hidden;
}

.lf-milestone-progress-fill {
	height: 100%;
	background: var(--lf-color-progress-fill);
	transition: width 0.5s ease-out;
}

.lf-milestone-progress-text {
	font-size: 0.875rem;
	color: var(--lf-color-answer);
	opacity: 0.7;
}

.lf-milestone-auto-advance {
	font-size: 0.875rem;
	color: var(--lf-color-answer);
	opacity: 0.6;
	margin-top: 1.5rem;
	animation: lf-pulse 1.5s ease-in-out infinite;
}

@keyframes lf-pulse {
	0%, 100% { opacity: 0.4; }
	50% { opacity: 0.8; }
}

/* ---- Section Screen ---- */
.lf-section-screen {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	min-height: 100vh;
	padding: var(--lf-spacing-container);
	position: relative;
}

.lf-section-overlay {
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 1;
}

.lf-section-content {
	position: relative;
	z-index: 2;
	max-width: 600px;
}

.lf-section-title {
	font-family: var(--lf-font-question);
	font-size: calc(var(--lf-font-size-question) * 1.5);
	font-weight: var(--lf-font-weight-question);
	color: var(--lf-color-question);
	margin: 0 0 1rem;
}

.lf-section-screen[style*="background-image"] .lf-section-title {
	color: white;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.lf-section-description {
	font-size: 1.125rem;
	color: var(--lf-color-answer);
	opacity: 0.9;
	margin: 0 0 2rem;
	line-height: 1.6;
}

.lf-section-screen[style*="background-image"] .lf-section-description {
	color: white;
	opacity: 0.9;
}

/* ---- Info Screen ---- */
.lf-info-screen {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.lf-info-screen-top {
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: var(--lf-spacing-container);
}

.lf-info-screen-background {
	position: relative;
}

.lf-info-background {
	position: absolute;
	inset: 0;
	z-index: 1;
}

.lf-info-overlay {
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 2;
}

.lf-info-screen-background .lf-info-content {
	position: relative;
	z-index: 3;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	min-height: 100vh;
	padding: var(--lf-spacing-container);
}

.lf-info-screen-background .lf-info-title,
.lf-info-screen-background .lf-info-description {
	color: white;
}

.lf-info-split-layout {
	display: flex;
	flex: 1;
	min-height: 100vh;
}

.lf-info-screen-left .lf-info-split-layout {
	flex-direction: row;
}

.lf-info-screen-right .lf-info-split-layout {
	flex-direction: row-reverse;
}

.lf-info-image-container {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.lf-info-image-top {
	max-height: 300px;
	margin-bottom: 2rem;
}

.lf-info-image-left,
.lf-info-image-right {
	max-width: 50%;
}

.lf-info-image {
	max-width: 100%;
	max-height: 100%;
	object-fit: cover;
}

.lf-info-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: var(--lf-spacing-container);
	max-width: 600px;
	margin: 0 auto;
}

.lf-info-title {
	font-family: var(--lf-font-question);
	font-size: calc(var(--lf-font-size-question) * 1.25);
	font-weight: var(--lf-font-weight-question);
	color: var(--lf-color-question);
	margin: 0 0 1rem;
}

.lf-info-description {
	font-size: var(--lf-font-size-answer);
	color: var(--lf-color-answer);
	opacity: 0.9;
	margin: 0 0 2rem;
	line-height: 1.6;
}

@media (max-width: 768px) {
	.lf-info-split-layout {
		flex-direction: column !important;
	}

	.lf-info-image-left,
	.lf-info-image-right {
		max-width: 100%;
		max-height: 250px;
	}
}

/* ---- Results Teaser Screen ---- */
.lf-results-teaser-screen {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	min-height: 100vh;
	padding: var(--lf-spacing-container);
}

.lf-results-teaser-title {
	font-family: var(--lf-font-question);
	font-size: calc(var(--lf-font-size-question) * 1.25);
	font-weight: var(--lf-font-weight-question);
	color: var(--lf-color-question);
	margin: 0 0 1rem;
}

.lf-results-teaser-text {
	font-size: 1.125rem;
	color: var(--lf-color-answer);
	opacity: 0.9;
	margin: 0 0 2rem;
	line-height: 1.6;
	max-width: 500px;
}

/* ---- CTA Screen ---- */
.lf-cta-screen {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	min-height: 100vh;
	padding: var(--lf-spacing-container);
}

.lf-cta-title {
	font-family: var(--lf-font-question);
	font-size: calc(var(--lf-font-size-question) * 1.25);
	font-weight: var(--lf-font-weight-question);
	color: var(--lf-color-question);
	margin: 0 0 1rem;
}

.lf-cta-description {
	font-size: 1.125rem;
	color: var(--lf-color-answer);
	opacity: 0.9;
	margin: 0 0 2rem;
	line-height: 1.6;
	max-width: 500px;
}

.lf-cta-buttons {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.lf-cta-primary-button {
	min-width: 200px;
}

.lf-cta-secondary-button {
	background: transparent;
	color: var(--lf-color-answer);
	border: 1px solid var(--lf-color-input-border);
}

.lf-cta-secondary-button:hover {
	background: var(--lf-color-surface);
	border-color: var(--lf-color-primary);
}

/* ---- Button Secondary Variant ---- */
.lf-button-secondary {
	background: transparent;
	color: var(--lf-color-answer);
	border: 1px solid var(--lf-color-input-border);
}

.lf-button-secondary:hover {
	background: var(--lf-color-surface);
	border-color: var(--lf-color-primary);
}
`.trim();
}

/**
 * Generate inline CSS string for SSR
 * Returns complete CSS that can be embedded in HTML
 */
export function generateThemeStyleTag(theme: FormTheme): string {
	const cssVariables = generateThemeCSS(theme);
	const componentStyles = generateComponentStyles();
	const transitionStyles = generateTransitionStyles();
	const layoutStyles = generateLayoutStyles();
	const variantStyles = generateVariantStyles();
	const customScreenStyles = generateCustomScreenStyles();

	return `${cssVariables}\n\n${componentStyles}\n\n${transitionStyles}\n\n${layoutStyles}\n\n${variantStyles}\n\n${customScreenStyles}`;
}
