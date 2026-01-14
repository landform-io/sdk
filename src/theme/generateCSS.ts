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

/* Welcome & Thank You Screens */
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
	border-radius: 50%;
	border: 2px solid var(--lf-color-input-border);
	flex-shrink: 0;
	transition: all var(--lf-transition-duration) var(--lf-transition-easing);
}

.lf-choice-card-selected .lf-choice-indicator {
	background-color: var(--lf-color-button-text);
	border-color: var(--lf-color-button-text);
	color: var(--lf-color-selected-bg);
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
 * Generate inline CSS string for SSR
 * Returns complete CSS that can be embedded in HTML
 */
export function generateThemeStyleTag(theme: FormTheme): string {
	const cssVariables = generateThemeCSS(theme);
	const componentStyles = generateComponentStyles();

	return `${cssVariables}\n\n${componentStyles}`;
}
