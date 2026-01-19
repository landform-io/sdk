export {
	clearProgress,
	hasCookieConsent,
	hasSubmitted,
	loadProgress,
	markAsSubmitted,
	saveProgress,
	setCookieConsent,
} from "./storage";
export {
	calculateRemainingTime,
	calculateTimeEstimate,
	formatTimeEstimate,
} from "./timeEstimate";
export {
	buildTemplateContext,
	createDefaultThemeVariables,
	DEFAULT_THEME_VARIABLE_DEFINITIONS,
	extractVariableReferences,
	getVariableValues,
	hasLiquidSyntax,
	processTemplate,
	processTemplateSync,
	type TemplateContext,
} from "./liquid";
