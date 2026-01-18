/**
 * Landform Actions Module
 *
 * This module defines the available actions that can be triggered from
 * custom page templates using data-lf-action attributes.
 *
 * Usage in HTML templates:
 * <button data-lf-action="next">Continue</button>
 * <button data-lf-action="back">Go Back</button>
 * <button data-lf-action="submit">Submit Form</button>
 * <button data-lf-action="goto" data-lf-target="welcome">Start Over</button>
 * <a data-lf-action="link" data-lf-url="https://example.com">Visit Site</a>
 */

/**
 * Available action types for custom templates
 */
export const LF_ACTIONS = {
	/** Navigate to the next screen/question */
	NEXT: "next",
	/** Navigate to the previous screen/question */
	BACK: "back",
	/** Submit the form */
	SUBMIT: "submit",
	/** Navigate to a specific screen by ID */
	GOTO: "goto",
	/** Open an external link */
	LINK: "link",
	/** Restart the form from the beginning */
	RESTART: "restart",
} as const;

export type LfAction = (typeof LF_ACTIONS)[keyof typeof LF_ACTIONS];

/**
 * Data attributes used for actions
 */
export const LF_DATA_ATTRIBUTES = {
	/** The action to perform */
	ACTION: "data-lf-action",
	/** Target screen ID for goto action */
	TARGET: "data-lf-target",
	/** URL for link action */
	URL: "data-lf-url",
} as const;

/**
 * Action definitions with metadata for documentation and autocomplete
 */
export interface ActionDefinition {
	/** The action identifier */
	action: LfAction;
	/** Human-readable label */
	label: string;
	/** Description of what the action does */
	description: string;
	/** Example HTML usage */
	example: string;
	/** Additional attributes this action supports */
	attributes?: {
		name: string;
		description: string;
		required?: boolean;
	}[];
}

/**
 * Complete action definitions for documentation and autocomplete
 */
export const ACTION_DEFINITIONS: ActionDefinition[] = [
	{
		action: "next",
		label: "Next",
		description: "Navigate to the next screen or question in the form",
		example: '<button class="lf-button" data-lf-action="next">Continue</button>',
	},
	{
		action: "back",
		label: "Back",
		description: "Navigate to the previous screen or question",
		example:
			'<button class="lf-button-ghost" data-lf-action="back">Go Back</button>',
	},
	{
		action: "submit",
		label: "Submit",
		description: "Submit the form and show the completion screen",
		example:
			'<button class="lf-button" data-lf-action="submit">Submit Form</button>',
	},
	{
		action: "goto",
		label: "Go to Screen",
		description: "Navigate to a specific screen by its ID",
		example:
			'<button class="lf-button" data-lf-action="goto" data-lf-target="welcome">Start Over</button>',
		attributes: [
			{
				name: "data-lf-target",
				description: "The ID of the screen to navigate to",
				required: true,
			},
		],
	},
	{
		action: "link",
		label: "External Link",
		description: "Open an external URL (opens in new tab)",
		example:
			'<a class="lf-button" data-lf-action="link" data-lf-url="https://example.com">Visit Site</a>',
		attributes: [
			{
				name: "data-lf-url",
				description: "The URL to open",
				required: true,
			},
		],
	},
	{
		action: "restart",
		label: "Restart",
		description: "Restart the form from the beginning, clearing all answers",
		example:
			'<button class="lf-button-ghost" data-lf-action="restart">Start Over</button>',
	},
];

/**
 * Get action definition by action type
 */
export function getActionDefinition(
	action: string
): ActionDefinition | undefined {
	return ACTION_DEFINITIONS.find((def) => def.action === action);
}

/**
 * Check if a string is a valid action
 */
export function isValidAction(action: string): action is LfAction {
	return Object.values(LF_ACTIONS).includes(action as LfAction);
}

/**
 * Parse action from an HTML element
 */
export interface ParsedAction {
	action: LfAction;
	target?: string;
	url?: string;
}

export function parseActionFromElement(
	element: HTMLElement
): ParsedAction | null {
	const action = element.getAttribute("data-lf-action");

	if (!action || !isValidAction(action)) {
		return null;
	}

	return {
		action,
		target: element.getAttribute("data-lf-target") || undefined,
		url: element.getAttribute("data-lf-url") || undefined,
	};
}
