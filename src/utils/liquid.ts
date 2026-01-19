import { Liquid } from "liquidjs";
import type { ThemeVariables, ThemeVariableDefinition } from "../types";

/**
 * Create a configured Liquid engine instance
 */
function createLiquidEngine(): Liquid {
	return new Liquid({
		strictFilters: false,
		strictVariables: false,
		lenientIf: true,
		trimTagLeft: false,
		trimTagRight: false,
		trimOutputLeft: false,
		trimOutputRight: false,
	});
}

// Singleton engine instance
let liquidEngine: Liquid | null = null;

function getEngine(): Liquid {
	if (!liquidEngine) {
		liquidEngine = createLiquidEngine();
	}
	return liquidEngine;
}

/**
 * Built-in context variables available in all templates
 */
export interface TemplateContext {
	/** Theme variable values */
	[key: string]: string | number | boolean | undefined;
	/** Current progress (0-100) */
	progress?: number;
	/** Current question index (1-based) */
	questionNumber?: number;
	/** Total number of questions */
	totalQuestions?: number;
	/** Whether user can go back */
	canGoBack?: boolean;
	/** Whether user can go forward */
	canGoNext?: boolean;
	/** Current field type */
	fieldType?: string;
	/** Whether the field is required */
	isRequired?: boolean;
}

/**
 * Get resolved variable values from theme variables
 * Uses current values if set, otherwise falls back to default values
 */
export function getVariableValues(
	variables: ThemeVariables | undefined
): Record<string, string | number | boolean> {
	if (!variables) return {};

	const values: Record<string, string | number | boolean> = {};

	// Start with default values from definitions
	for (const def of variables.definitions) {
		values[def.id] = def.defaultValue;
	}

	// Override with current values
	if (variables.values) {
		for (const [key, value] of Object.entries(variables.values)) {
			values[key] = value;
		}
	}

	return values;
}

/**
 * Build the complete template context from theme variables and runtime data
 */
export function buildTemplateContext(
	variables: ThemeVariables | undefined,
	runtimeContext?: Partial<TemplateContext>
): TemplateContext {
	const variableValues = getVariableValues(variables);
	return {
		...variableValues,
		...runtimeContext,
	};
}

/**
 * Process a Liquid template string with the given context
 * Returns the processed HTML string
 */
export async function processTemplate(
	template: string,
	context: TemplateContext
): Promise<string> {
	if (!template) return "";

	const engine = getEngine();

	try {
		return await engine.parseAndRender(template, context);
	} catch (error) {
		console.error("Error processing Liquid template:", error);
		// Return original template on error (graceful degradation)
		return template;
	}
}

/**
 * Process a Liquid template string synchronously
 * Use this when async is not possible (e.g., in render methods)
 */
export function processTemplateSync(
	template: string,
	context: TemplateContext
): string {
	if (!template) return "";

	const engine = getEngine();

	try {
		return engine.parseAndRenderSync(template, context);
	} catch (error) {
		console.error("Error processing Liquid template:", error);
		// Return original template on error (graceful degradation)
		return template;
	}
}

/**
 * Check if a string contains Liquid syntax
 */
export function hasLiquidSyntax(template: string): boolean {
	if (!template) return false;
	// Check for {{ }} or {% %}
	return /\{\{.*?\}\}|\{%.*?%\}/s.test(template);
}

/**
 * Extract variable references from a template
 * Returns list of variable names used in the template
 */
export function extractVariableReferences(template: string): string[] {
	if (!template) return [];

	const variables = new Set<string>();

	// Match {{ variable }} patterns
	const outputMatches = template.matchAll(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g);
	for (const match of outputMatches) {
		variables.add(match[1]);
	}

	// Match {% if variable %} and similar patterns
	const tagMatches = template.matchAll(/\{%\s*(?:if|unless|elsif|when|assign|for|case)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g);
	for (const match of tagMatches) {
		variables.add(match[1]);
	}

	return Array.from(variables);
}

/**
 * Default theme variable definitions for navigation and display
 * These provide the standard settings that used to be in FormSettings
 */
export const DEFAULT_THEME_VARIABLE_DEFINITIONS: ThemeVariableDefinition[] = [
	{
		id: "showNavigationArrows",
		label: "Show Navigation Arrows",
		type: "boolean",
		defaultValue: true,
		description: "Display back/forward arrows for navigation",
		category: "Navigation",
	},
	{
		id: "showOkButton",
		label: "Show OK Button",
		type: "boolean",
		defaultValue: true,
		description: "Display the OK/Next button below questions",
		category: "Navigation",
	},
	{
		id: "showKeyboardHint",
		label: "Show Keyboard Hint",
		type: "boolean",
		defaultValue: true,
		description: "Display 'press Enter' hint on buttons",
		category: "Navigation",
	},
	{
		id: "showProgressBar",
		label: "Show Progress Bar",
		type: "boolean",
		defaultValue: true,
		description: "Display progress indicator at the top",
		category: "Display",
	},
	{
		id: "showQuestionNumber",
		label: "Show Question Number",
		type: "boolean",
		defaultValue: true,
		description: "Display question numbers (1, 2, 3...)",
		category: "Display",
	},
	{
		id: "showKeyHintOnChoices",
		label: "Show Key Hints on Choices",
		type: "boolean",
		defaultValue: true,
		description: "Display keyboard shortcut letters (A, B, C...) on multiple choice options",
		category: "Display",
	},
	{
		id: "showTimeToComplete",
		label: "Show Time to Complete",
		type: "boolean",
		defaultValue: false,
		description: "Display estimated time to complete the form",
		category: "Display",
	},
	{
		id: "containerMaxWidth",
		label: "Container Max Width",
		type: "text",
		defaultValue: "720px",
		description: "Maximum width of the question container",
		category: "Layout",
	},
	{
		id: "contentAlignment",
		label: "Content Alignment",
		type: "select",
		defaultValue: "left",
		description: "Horizontal alignment of question content",
		category: "Layout",
		options: [
			{ label: "Left", value: "left" },
			{ label: "Center", value: "center" },
			{ label: "Right", value: "right" },
		],
	},
];

/**
 * Create default theme variables with standard definitions
 */
export function createDefaultThemeVariables(): ThemeVariables {
	return {
		definitions: [...DEFAULT_THEME_VARIABLE_DEFINITIONS],
		values: {},
	};
}

/**
 * Get a specific theme variable value with fallback to default
 * Uses current value if set, otherwise falls back to definition default, then provided fallback
 */
export function getThemeVariableValue<T extends string | number | boolean>(
	variables: ThemeVariables | undefined,
	variableId: string,
	fallback: T
): T {
	if (variables?.values?.[variableId] !== undefined) {
		return variables.values[variableId] as T;
	}
	const def = variables?.definitions?.find((d) => d.id === variableId);
	return (def?.defaultValue as T) ?? fallback;
}

/**
 * Default Typeform-style question page template
 * Uses Liquid syntax for conditional rendering based on theme variables
 */
export const DEFAULT_QUESTION_PAGE_TEMPLATE = {
	html: `<div class="lf-question-wrapper{% if contentAlignment == 'center' %} lf-align-center{% elsif contentAlignment == 'right' %} lf-align-right{% endif %}">
  <div class="lf-question-content lf-fade-in">
    {{field}}
  </div>
  {% if showOkButton != false %}
  <div class="lf-question-footer lf-fade-in lf-fade-delay-1">
    <button class="lf-button lf-button-typeform" data-lf-action="next">
      OK
    </button>
    {% if showKeyboardHint != false %}
    <span class="lf-key-hint-inline">press <kbd>Enter</kbd> <span class="lf-enter-icon">\u21b5</span></span>
    {% endif %}
  </div>
  {% endif %}
</div>`,
	css: `.lf-question-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--lf-spacing-question, 24px);
  width: 100%;
  max-width: {{ containerMaxWidth | default: "720px" }};
  text-align: {{ contentAlignment | default: "left" }};
}

.lf-question-wrapper.lf-align-center {
  margin-left: auto;
  margin-right: auto;
}

.lf-question-wrapper.lf-align-right {
  margin-left: auto;
}

.lf-question-content {
  flex: 1;
}

.lf-question-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.lf-button-typeform {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-family: var(--lf-font-button);
  font-size: var(--lf-font-size-button);
  font-weight: 700;
  color: var(--lf-color-button-text);
  background-color: var(--lf-color-button-bg);
  border: none;
  border-radius: var(--lf-border-radius);
  cursor: pointer;
  transition: all 0.15s ease;
}

.lf-button-typeform:hover {
  background-color: var(--lf-color-button-hover);
}

.lf-key-hint-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--lf-color-primary);
  font-weight: 500;
}

.lf-key-hint-inline kbd {
  font-family: inherit;
  font-weight: 700;
}

.lf-enter-icon {
  font-size: 16px;
}

@media (hover: none) and (pointer: coarse) {
  .lf-key-hint-inline {
    display: none;
  }
}`,
};
