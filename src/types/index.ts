// ============================================================================
// Landform SDK Types
// ============================================================================

// ============================================================================
// Form Content - Main Structure
// ============================================================================

export interface FormContent {
	schemaVersion: number;
	welcomeScreens: WelcomeScreen[];
	fields: FormField[];
	branching: FieldBranching[];
	logic: LogicRule[];
	variables: FormVariables;
	hiddenFields: HiddenField[];
	/** Custom screens inserted between fields */
	customScreens?: CustomScreen[];
}

// ============================================================================
// Screens
// ============================================================================

export interface WelcomeScreen {
	ref: string;
	title: string;
	properties: {
		description?: string;
		buttonText?: string;
		showButton: boolean;
		/** Subtitle shown below main title (e.g., "5-MINUTE TEST") */
		subtitle?: string;
	};
	attachment?: Attachment;
	layout?: Layout;
	position?: Position;
	/** Multiple images for side content in split layouts */
	sideImages?: Attachment[];
}


// ============================================================================
// Fields
// ============================================================================

export type FieldType =
	| "short_text"
	| "long_text"
	| "email"
	| "phone_number"
	| "number"
	| "date"
	| "dropdown"
	| "multiple_choice"
	| "picture_choice"
	| "ranking"
	| "rating"
	| "opinion_scale"
	| "yes_no"
	| "legal"
	| "file_upload"
	| "payment"
	| "contact_info"
	| "group"
	| "matrix"
	| "statement"
	| "website"
	| "nps"
	| "address"
	| "slider"
	| "signature";

export interface FormFieldBase {
	ref: string;
	type: FieldType;
	title: string;
	description?: string;
	validations: FieldValidations;
	attachment?: Attachment;
	layout?: Layout;
	position?: Position;
}

export interface FieldValidations {
	required?: boolean;
	maxLength?: number;
	minLength?: number;
	minValue?: number;
	maxValue?: number;
	minSelection?: number;
	maxSelection?: number;
}

// Choice-based fields
export interface Choice {
	ref: string;
	label: string;
	attachment?: Attachment;
}

export interface ChoiceFieldProperties {
	choices: Choice[];
	allowMultipleSelection?: boolean;
	allowOtherChoice?: boolean;
	randomize?: boolean;
	verticalAlignment?: boolean;
	showLabels?: boolean;
	supersized?: boolean;
}

export interface MultipleChoiceField extends FormFieldBase {
	type: "multiple_choice";
	properties: ChoiceFieldProperties;
}

export interface PictureChoiceField extends FormFieldBase {
	type: "picture_choice";
	properties: ChoiceFieldProperties;
}

export interface DropdownField extends FormFieldBase {
	type: "dropdown";
	properties: {
		choices: Choice[];
		alphabeticalOrder?: boolean;
	};
}

export interface RankingField extends FormFieldBase {
	type: "ranking";
	properties: {
		choices: Choice[];
	};
}

// Scale-based fields
export interface RatingField extends FormFieldBase {
	type: "rating";
	properties: {
		steps: number;
		shape: "star" | "heart" | "thumbsup" | "trophy" | "crown";
	};
}

export interface OpinionScaleField extends FormFieldBase {
	type: "opinion_scale";
	properties: {
		steps: number;
		startAtOne: boolean;
		labels: {
			left?: string;
			center?: string;
			right?: string;
		};
	};
}

export interface NPSField extends FormFieldBase {
	type: "nps";
	properties: {
		labels: {
			left?: string;
			right?: string;
		};
	};
}

// Text fields
export interface ShortTextField extends FormFieldBase {
	type: "short_text";
	properties: {
		placeholder?: string;
	};
}

export interface LongTextField extends FormFieldBase {
	type: "long_text";
	properties: {
		placeholder?: string;
	};
}

export interface EmailField extends FormFieldBase {
	type: "email";
	properties: {
		placeholder?: string;
	};
}

export interface PhoneNumberField extends FormFieldBase {
	type: "phone_number";
	properties: {
		defaultCountryCode?: string;
	};
}

export interface WebsiteField extends FormFieldBase {
	type: "website";
	properties: {
		placeholder?: string;
	};
}

// Number and Date fields
export interface NumberField extends FormFieldBase {
	type: "number";
	properties: {
		placeholder?: string;
	};
}

export interface DateField extends FormFieldBase {
	type: "date";
	properties: {
		structure: "DDMMYYYY" | "MMDDYYYY" | "YYYYMMDD";
		separator: "/" | "-" | ".";
	};
}

// Special fields
export interface YesNoField extends FormFieldBase {
	type: "yes_no";
	properties: Record<string, never>;
}

export interface LegalField extends FormFieldBase {
	type: "legal";
	properties: {
		description: string;
	};
}

export interface StatementField extends FormFieldBase {
	type: "statement";
	properties: {
		buttonText: string;
		hideMarks?: boolean;
	};
}

export interface FileUploadField extends FormFieldBase {
	type: "file_upload";
	properties: {
		allowedFileTypes?: string[];
		maxFileSizeMB?: number;
		maxFiles?: number;
	};
}

// Complex fields
export interface ContactInfoField extends FormFieldBase {
	type: "contact_info";
	properties: {
		subfields: {
			firstName: boolean;
			lastName: boolean;
			email: boolean;
			phoneNumber: boolean;
			company: boolean;
		};
	};
}

export interface PaymentField extends FormFieldBase {
	type: "payment";
	properties: {
		currency:
			| "USD"
			| "EUR"
			| "GBP"
			| "CAD"
			| "AUD"
			| "BRL"
			| "CHF"
			| "DKK"
			| "MXN"
			| "NOK"
			| "SEK";
		price: {
			type: "fixed" | "variable";
			value?: number;
			variableRef?: string;
		};
		buttonText?: string;
		emailReceipts?: boolean;
	};
}

export interface GroupField extends FormFieldBase {
	type: "group";
	properties: {
		fields: FormField[];
		buttonText?: string;
	};
}

export interface MatrixField extends FormFieldBase {
	type: "matrix";
	properties: {
		rows: { ref: string; label: string }[];
		columns: { ref: string; label: string }[];
		allowMultiplePerRow?: boolean;
	};
}

export interface AddressField extends FormFieldBase {
	type: "address";
	properties: {
		placeholder?: string;
		showSecondLine?: boolean;
		showCountry?: boolean;
		defaultCountry?: string;
		autocomplete?: boolean;
	};
}

export interface SliderField extends FormFieldBase {
	type: "slider";
	properties: {
		min: number;
		max: number;
		step: number;
		defaultValue?: number;
		showValue?: boolean;
		showMinMaxLabels?: boolean;
		unit?: string;
		unitPosition?: "prefix" | "suffix";
	};
}

export interface SignatureField extends FormFieldBase {
	type: "signature";
	properties: {
		width?: number;
		height?: number;
		strokeColor?: string;
		strokeWidth?: number;
		backgroundColor?: string;
		showClearButton?: boolean;
		showTypedSignature?: boolean;
	};
}

// Union type for all fields
export type FormField =
	| ShortTextField
	| LongTextField
	| EmailField
	| PhoneNumberField
	| NumberField
	| DateField
	| DropdownField
	| MultipleChoiceField
	| PictureChoiceField
	| RankingField
	| RatingField
	| OpinionScaleField
	| NPSField
	| YesNoField
	| LegalField
	| StatementField
	| FileUploadField
	| ContactInfoField
	| PaymentField
	| GroupField
	| MatrixField
	| WebsiteField
	| AddressField
	| SliderField
	| SignatureField;

// ============================================================================
// Branching System
// ============================================================================

export interface SubPage {
	id: string;
	triggerChoiceRefs: string[];
	field: FormField;
}

export interface FieldBranching {
	fieldRef: string;
	subPages: SubPage[];
}

// ============================================================================
// Logic System
// ============================================================================

export interface LogicRule {
	ref: string;
	type: "field" | "hidden";
	actions: LogicAction[];
}

export interface LogicAction {
	action: "jump" | "add" | "subtract" | "multiply" | "divide" | "set";
	condition: LogicCondition;
	details: LogicActionDetails;
}

export interface LogicCondition {
	op: ConditionOperator;
	vars: LogicVariable[];
}

export type ConditionOperator =
	| "always"
	| "equal"
	| "not_equal"
	| "lower_than"
	| "lower_equal_than"
	| "greater_than"
	| "greater_equal_than"
	| "is"
	| "is_not"
	| "begins_with"
	| "ends_with"
	| "contains"
	| "not_contains"
	| "earlier_than"
	| "later_than"
	| "earlier_than_or_on"
	| "later_than_or_on"
	| "and"
	| "or";

export interface LogicVariable {
	type: "field" | "hidden" | "variable" | "constant" | "choice" | "end";
	value: string | number | boolean;
}

export interface LogicActionDetails {
	to?: {
		type: "field" | "outcome";
		value: string;
	};
	target?: {
		type: "variable";
		value: string;
	};
	value?: {
		type: "constant" | "variable" | "field";
		value: string | number;
	};
}

// ============================================================================
// Variables
// ============================================================================

export interface FormVariables {
	score?: number;
	price?: number;
	custom?: Record<
		string,
		{
			type: "number" | "string";
			defaultValue: number | string;
		}
	>;
}

// ============================================================================
// Hidden Fields
// ============================================================================

export interface HiddenField {
	ref: string;
	type: "hidden";
	defaultValue?: string;
}

// ============================================================================
// Attachments and Layout
// ============================================================================

export interface Attachment {
	type: "image" | "video";
	href: string;
	scale?: number;
	properties?: {
		description?: string;
	};
}

export interface Layout {
	type: "split" | "wallpaper" | "float" | "stack";
	placement?: "left" | "right";
	viewportOverrides?: {
		small?: Layout;
		large?: Layout;
	};
}

export interface Position {
	x: number;
	y: number;
}

// ============================================================================
// Theme
// ============================================================================

export interface FontConfig {
	family: string;
	size: string;
	weight: string;
	lineHeight: string;
	letterSpacing?: string;
}

export interface ThemeColors {
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	surfaceBackground: string;
	inputBackground: string;
	inputBorder: string;
	questionText: string;
	answerText: string;
	placeholderText: string;
	buttonBackground: string;
	buttonText: string;
	buttonHoverBackground: string;
	selectedBackground: string;
	selectedBorder: string;
	errorColor: string;
	successColor: string;
	progressBackground: string;
	progressFill: string;
}

export interface ThemeTypography {
	questionFont: FontConfig;
	answerFont: FontConfig;
	buttonFont: FontConfig;
}

export interface ThemeSpacing {
	questionGap: string;
	optionGap: string;
	containerPadding: string;
}

export interface ThemeBorders {
	inputBorderWidth: string;
	inputBorderStyle: "solid" | "dashed" | "none";
	radius: "none" | "small" | "medium" | "large" | "full";
}

export interface ThemeAnimations {
	transitionDuration: string;
	transitionEasing: string;
	enableAnimations: boolean;
}

// ============================================================================
// Screen Transitions
// ============================================================================

/**
 * Screen transition animation types
 */
export type ScreenTransitionType =
	| "none"
	| "fade"
	| "slide-left"
	| "slide-right"
	| "slide-up"
	| "slide-down"
	| "zoom-in"
	| "zoom-out"
	| "blur-fade";

/**
 * Configuration for screen-to-screen transitions
 */
export interface ThemeScreenTransitions {
	/** Enable/disable screen transitions */
	enabled: boolean;
	/** Transition when moving forward */
	enterTransition: ScreenTransitionType;
	/** Transition when content exits */
	exitTransition: ScreenTransitionType;
	/** Duration of the transition (e.g., "0.4s", "400ms") */
	duration: string;
	/** CSS easing function (e.g., "ease-out", "cubic-bezier(0.4, 0, 0.2, 1)") */
	easing: string;
	/** Whether to stagger child element animations */
	animateChildren?: boolean;
	/** Delay between child animations (e.g., "0.05s") */
	staggerDelay?: string;
	/** Direction-specific transition overrides */
	directionOverrides?: {
		forward?: ScreenTransitionType;
		backward?: ScreenTransitionType;
	};
}

// ============================================================================
// Layout Templates
// ============================================================================

/**
 * Pre-defined layout templates for form rendering
 */
export type LayoutTemplate =
	| "default"
	| "centered"
	| "left-aligned"
	| "split-left"
	| "split-right"
	| "card-center"
	| "card-bottom";

/**
 * Detailed layout configuration
 */
export interface ThemeLayout {
	/** Base layout template */
	template: LayoutTemplate;
	/** Content alignment within the layout */
	contentAlignment: "top" | "center" | "bottom";
	/** Vertical padding distribution */
	verticalPadding: "none" | "small" | "medium" | "large";
	/** Background configuration for split layouts */
	splitBackground?: {
		/** Which side shows the background */
		side: "left" | "right";
		/** Width percentage (e.g., "40%", "50%") */
		width: string;
		/** Background content */
		content: {
			type: "image" | "gradient" | "color";
			value: string;
		};
		/** Optional overlay color */
		overlay?: string;
	};
	/** Card styling for card layouts */
	cardStyle?: {
		/** Card background color */
		background: string;
		/** Card shadow size */
		shadow: "none" | "small" | "medium" | "large";
		/** Card max width */
		maxWidth: string;
		/** Card padding */
		padding: string;
	};
}

export interface ThemeBackground {
	type: "solid" | "gradient" | "image" | "video";
	value: string;
	overlay?: string;
	position?: string;
}

export interface ThemeProgressBar {
	enabled: boolean;
	style: "bar" | "segmented" | "dots" | "percentage";
	position: "top" | "bottom";
}

export interface ThemeBranding {
	showPoweredBy: boolean;
	brandName?: string;
	logoUrl?: string;
	logoPosition?: "top-left" | "top-right" | "bottom";
	faviconUrl?: string;
}

export interface ThemeCustomJS {
	enabled: boolean;
	code: string;
	executeOn: ("load" | "submit" | "navigation" | "fieldChange")[];
}

/**
 * Component style variants for templates
 * These control the visual structure/layout of form components
 */
export interface ThemeComponentVariants {
	/** Choice/option rendering style */
	choiceStyle?: "default" | "card" | "minimal";
	/** Navigation layout style */
	navigationLayout?: "floating" | "bottom-bar" | "inline";
	/** Header layout style */
	headerLayout?: "none" | "centered-logo" | "left-logo";
	/** Progress style override */
	progressStyle?: "bar" | "dots" | "segments" | "percentage" | "fraction";

	/** Choice layout - single column or grid */
	choiceLayout?: "single-column" | "two-column" | "auto-grid";
	/** Choice indicator icon type */
	choiceIndicator?: "checkmark" | "arrow" | "radio" | "none";
	/** Navigation visibility control */
	navigationVisibility?: "always" | "hidden" | "auto-advance";
	/** Main container max width (e.g., "600px") */
	containerMaxWidth?: string;
	/** Choice container max width (e.g., "375px") */
	choiceContainerMaxWidth?: string;

	/** Page layout template */
	layout?: LayoutTemplate;
	/** Full layout configuration (overrides layout if both set) */
	layoutConfig?: ThemeLayout;
	/** Input field style variant */
	inputStyle?: "default" | "underline" | "filled" | "outlined";
	/** Button style variant */
	buttonStyle?: "solid" | "outline" | "ghost" | "gradient";
	/** Question number display style */
	questionNumberStyle?: "none" | "inline" | "badge" | "circle";
}

// ============================================================================
// Custom Screen Templates - SDK-provided, theme-configurable screens
// ============================================================================

/** Built-in screen template types provided by the SDK */
export type ScreenTemplateType =
	| "milestone"
	| "section"
	| "info"
	| "results-teaser"
	| "cta";

/** Base interface for all custom screens */
export interface CustomScreen {
	ref: string;
	type: "custom";
	templateType: ScreenTemplateType;
	/** Position in the form (after which field ref, or "start"/"end") */
	position: { after: string } | "start" | "end";
	/** Template-specific properties */
	properties: CustomScreenProperties;
}

/** Union of all template property types */
export type CustomScreenProperties =
	| MilestoneScreenProperties
	| SectionScreenProperties
	| InfoScreenProperties
	| ResultsTeaserProperties
	| CTAScreenProperties;

/** Milestone screen - celebrates progress */
export interface MilestoneScreenProperties {
	templateType: "milestone";
	title: string;
	subtitle?: string;
	/** Show progress percentage */
	showProgress?: boolean;
	/** Custom icon (emoji or image URL) */
	icon?: string;
	/** Auto-advance after delay (ms), or 0 for manual */
	autoAdvanceMs?: number;
	buttonText?: string;
}

/** Section header screen */
export interface SectionScreenProperties {
	templateType: "section";
	title: string;
	description?: string;
	/** Background image */
	backgroundImage?: string;
	buttonText?: string;
}

/** Info screen with image */
export interface InfoScreenProperties {
	templateType: "info";
	title: string;
	description?: string;
	image?: string;
	imagePosition?: "top" | "left" | "right" | "background";
	buttonText?: string;
}

/** Results teaser screen */
export interface ResultsTeaserProperties {
	templateType: "results-teaser";
	title: string;
	/** Template with variable placeholders like {answer_q1} */
	teaserText?: string;
	buttonText?: string;
}

/** CTA interstitial screen */
export interface CTAScreenProperties {
	templateType: "cta";
	title: string;
	description?: string;
	primaryButtonText: string;
	primaryButtonUrl?: string;
	secondaryButtonText?: string;
	/** If true, secondary button continues form */
	secondaryContinuesForm?: boolean;
}

/** Theme configuration for custom screen templates */
export interface ThemeScreenTemplates {
	/** Which template types are enabled for this theme */
	enabled: ScreenTemplateType[];
	/** Default styling overrides per template type */
	defaults?: Partial<
		Record<ScreenTemplateType, Partial<CustomScreenProperties>>
	>;
	/** User-defined custom templates */
	customTemplates?: CustomPageTemplate[];
}

// ============================================================================
// User-Defined Custom Templates
// ============================================================================

/** Field types available for custom template configuration */
export type CustomTemplateFieldType =
	| "text"
	| "textarea"
	| "color"
	| "image"
	| "select"
	| "boolean"
	| "number";

/** Custom template field definition */
export interface CustomTemplateField {
	/** Unique identifier for this field (used in {{fieldId}} placeholders) */
	id: string;
	/** Display label for the field */
	label: string;
	/** Field type */
	type: CustomTemplateFieldType;
	/** Default value for this field */
	defaultValue?: string | boolean | number;
	/** Placeholder text for text inputs */
	placeholder?: string;
	/** Options for select type fields */
	options?: { label: string; value: string }[];
	/** Whether this field is required */
	required?: boolean;
	/** Help text for this field */
	description?: string;
}

/** User-defined custom page template */
export interface CustomPageTemplate {
	/** Unique identifier for this template */
	id: string;
	/** Display name for the template */
	name: string;
	/** Description of what this template is for */
	description?: string;
	/** HTML template with {{fieldId}} variable placeholders */
	html: string;
	/** CSS styles for the template */
	css?: string;
	/** JavaScript code for the template (runs globally, not scoped) */
	js?: string;
	/** Fields that can be configured when using this template */
	fields: CustomTemplateField[];
	/** Preview thumbnail URL */
	thumbnail?: string;
}

/** Screen instance using a user-defined template */
export interface UserDefinedScreen {
	ref: string;
	type: "user-template";
	/** ID of the custom template to use */
	templateId: string;
	/** Position in the form (after which field ref, or "start"/"end") */
	position: { after: string } | "start" | "end";
	/** Field values for this screen instance */
	fieldValues: Record<string, string | boolean | number>;
}

export interface FormTheme {
	id?: string;
	name?: string;
	description?: string;
	author?: string;
	version?: string;
	isPublic?: boolean;
	colors: ThemeColors;
	typography: ThemeTypography;
	spacing: ThemeSpacing;
	borders: ThemeBorders;
	animations: ThemeAnimations;
	background: ThemeBackground;
	progressBar: ThemeProgressBar;
	branding: ThemeBranding;
	customCSS?: string;
	customJS?: ThemeCustomJS;
	componentVariants?: ThemeComponentVariants;
	/** Screen transition configuration */
	screenTransitions?: ThemeScreenTransitions;
	/** Custom screen templates available in this theme */
	screenTemplates?: ThemeScreenTemplates;
}

// ============================================================================
// Settings
// ============================================================================

export interface FormSettings {
	isPublic: boolean;
	showProgressBar: boolean;
	showTimeToComplete: boolean;
	showQuestionNumber: boolean;
	showKeyHintOnChoices: boolean;
	hideNavigation: boolean;
	autosaveProgress: boolean;
	language: string;
	systemMessages?: {
		confirmButtonText?: string;
		pressEnterText?: string;
		multipleSelectionHint?: string;
		dropdownInstruction?: string;
		dropdownInstructionTouch?: string;
		requiredText?: string;
	};
	showCookieConsent: boolean;
	captchaEnabled: boolean;
	duplicatePrevention?: "cookie" | "cookie_ip";
	googleAnalyticsId?: string;
	facebookPixelId?: string;
	googleTagManagerId?: string;
	meta: {
		title?: string;
		description?: string;
		imageUrl?: string;
		allowIndexing: boolean;
	};
	redirectAfterSubmitUrl?: string;
	emailNotifications: {
		enabled: boolean;
		recipients: string[];
		includeAnswers: boolean;
	};
	scheduling?: {
		startsAt?: string;
		endsAt?: string;
		closedMessage?: string;
	};
	responseLimit?: {
		max: number;
		limitReachedMessage?: string;
	};
}

// ============================================================================
// Response Types
// ============================================================================

export type ResponseAnswers = Record<string, FieldAnswer>;

export type FieldAnswer =
	| string
	| number
	| boolean
	| string[]
	| Record<string, boolean>
	| AddressValue
	| SignatureValue
	| ContactInfoAnswer
	| FileUploadAnswer;

export interface AddressValue {
	line1?: string;
	line2?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;
}

export interface SignatureValue {
	type: "drawn" | "typed";
	data: string;
}

export interface ContactInfoAnswer {
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
	company?: string;
}

export interface FileUploadAnswer {
	files: {
		id: string;
		filename: string;
		url: string;
		size: number;
		mimeType: string;
	}[];
}

export interface ResponseOutcome {
	screenRef: string;
	label?: string;
	score?: number;
	variables: Record<string, number | string>;
}

export interface ResponseMetadata {
	userAgent?: string;
	ipAddress?: string;
	referrer?: string;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmTerm?: string;
	utmContent?: string;
	deviceType?: "desktop" | "mobile" | "tablet";
	browser?: string;
	os?: string;
	country?: string;
	city?: string;
}

// ============================================================================
// SDK-Specific Types
// ============================================================================

export interface FormData {
	projectId: string;
	content: FormContent;
	theme: FormTheme;
	settings: FormSettings;
}

export interface FormState {
	responseId: string | null;
	sessionId: string;
	currentIndex: number;
	answers: ResponseAnswers;
	isStarted: boolean;
	isCompleted: boolean;
	isSubmitting: boolean;
	errors: Record<string, string>;
}

export interface FieldState {
	value: FieldAnswer | undefined;
	error: string | null;
	touched: boolean;
	isValid: boolean;
}

export type ScreenItem =
	| { type: "welcome"; screen: WelcomeScreen }
	| { type: "field"; field: FormField; index: number }
	| { type: "custom"; screen: CustomScreen }
	| {
			type: "user-template";
			screen: UserDefinedScreen;
			template: CustomPageTemplate;
	  };
