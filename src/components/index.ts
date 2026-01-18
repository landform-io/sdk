// Main components
export { FormRenderer } from "./FormRenderer";
export type { FormRendererProps } from "./FormRenderer";

export { FormProvider, useFormContext } from "./FormProvider";
export type { FormProviderProps, FormContextValue } from "./FormProvider";

// Layout
export { FormContainer, QuestionContainer, Branding } from "./layout";
export type { FormContainerProps, QuestionContainerProps } from "./layout";

// Screens
export {
	WelcomeScreen,
	ThankYouScreen,
	ClosedScreen,
	LandingPage,
	CustomScreenRenderer,
	MilestoneScreen,
	SectionScreen,
	InfoScreen,
	ResultsTeaserScreen,
	CTAScreen,
	UserTemplateScreen,
} from "./screens";
export type {
	WelcomeScreenProps,
	ThankYouScreenProps,
	ClosedScreenProps,
	LandingPageProps,
	CustomScreenRendererProps,
	MilestoneScreenProps,
	SectionScreenProps,
	InfoScreenProps,
	ResultsTeaserScreenProps,
	CTAScreenProps,
	UserTemplateScreenProps,
} from "./screens";

// Navigation
export { ProgressBar, NavigationControls, TimeToComplete } from "./navigation";
export type { NavigationControlsProps } from "./navigation";

// Cookie Consent
export { CookieConsent } from "./CookieConsent";
export type { CookieConsentProps } from "./CookieConsent";

// Fields - Main renderer
export { FieldRenderer } from "./fields";
export type { FieldRendererProps } from "./fields";

// Fields - Legacy exports (for backwards compatibility)
export { QuestionHeader, TextField, NumberField } from "./fields";
export type { QuestionHeaderProps, TextFieldProps, NumberFieldProps } from "./fields";

// Fields - Shared components (unified across editor, preview, and live modes)
export {
	// Functions
	getModeBehavior,
	// Context
	FieldContext,
	useFieldContext,
	useFieldMode,
	// Utilities
	FieldWrapper,
	// Input fields
	TextInput,
	TextArea,
	NumberInput,
	DateInput,
	// Choice fields
	MultipleChoice,
	PictureChoice,
	Dropdown,
	YesNo,
	Ranking,
	// Scale fields
	Rating,
	OpinionScale,
	NPS,
	Slider,
	// Special fields
	Address,
	Legal,
	Statement,
	Signature,
	FileUpload,
} from "./fields/shared";

export type {
	FieldMode,
	ModeBehavior,
	FieldContextValue,
	SharedFieldProps,
	TextInputProps,
	TextAreaProps,
	NumberInputProps,
	DateInputProps,
	MultipleChoiceProps,
	PictureChoiceProps,
	DropdownProps,
	YesNoProps,
	RankingProps,
	RatingProps,
	OpinionScaleProps,
	NPSProps,
	SliderProps,
	AddressProps,
	LegalProps,
	StatementProps,
	SignatureProps,
	FileUploadProps,
} from "./fields/shared";
