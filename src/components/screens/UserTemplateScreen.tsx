import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	LF_ACTIONS,
	type ParsedAction,
	parseActionFromElement,
} from "../../actions";
import type { CustomPageTemplate, UserDefinedScreen } from "../../types";

export interface UserTemplateScreenProps {
	screen: UserDefinedScreen;
	template: CustomPageTemplate;
	onNext: () => void;
	onBack?: () => void;
	onSubmit?: () => void;
	onGoto?: (screenId: string) => void;
	onRestart?: () => void;
}

/**
 * Interpolates template variables in HTML
 */
function interpolateTemplate(
	html: string,
	fieldValues: Record<string, string | boolean | number>,
): string {
	return html.replace(/\{\{(\w+)\}\}/g, (match, fieldId) => {
		const value = fieldValues[fieldId];
		if (value !== undefined) {
			// Escape HTML special characters for non-HTML content
			return String(value)
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");
		}
		return match;
	});
}

/**
 * Allowed data-lf-* attributes for actions
 */
const ALLOWED_LF_ATTRS = ["data-lf-action", "data-lf-target", "data-lf-url"];

// DOMPurify config for sanitization
const DOMPURIFY_CONFIG = {
	ALLOWED_TAGS: [
		"div",
		"span",
		"p",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"img",
		"a",
		"button",
		"ul",
		"ol",
		"li",
		"br",
		"hr",
		"strong",
		"em",
		"b",
		"i",
		"u",
		"section",
		"article",
		"header",
		"footer",
		"nav",
		"figure",
		"figcaption",
		"script",
	],
	ALLOWED_ATTR: [
		"class",
		"style",
		"src",
		"href",
		"alt",
		"title",
		"target",
		"rel",
		"id",
		"width",
		"height",
		// Script attributes
		"type",
		"defer",
		"async",
		// Allow Landform action attributes
		...ALLOWED_LF_ATTRS,
	],
	ALLOW_DATA_ATTR: false,
	ADD_ATTR: ["target"],
	// Ensure links open in new tabs
	FORBID_TAGS: ["style", "iframe", "form", "input", "textarea"],
};

// Lazy-loaded DOMPurify instance (browser only)
let domPurifyInstance: typeof import("dompurify") | null = null;
let domPurifyLoading: Promise<void> | null = null;

async function loadDOMPurify(): Promise<void> {
	if (typeof window === "undefined") return;
	if (domPurifyInstance) return;
	if (domPurifyLoading) return domPurifyLoading;

	domPurifyLoading = import("dompurify").then((module) => {
		domPurifyInstance = module.default || module;
	});
	return domPurifyLoading;
}

/**
 * Sanitizes HTML content using DOMPurify
 * On SSR or before DOMPurify loads, returns raw HTML
 */
function sanitizeHtml(html: string): string {
	if (!domPurifyInstance?.sanitize) {
		return html;
	}
	return domPurifyInstance.sanitize(html, DOMPURIFY_CONFIG);
}

/**
 * Prefixes CSS selectors to scope styles to the template
 */
function scopeCss(css: string, templateId: string): string {
	if (!css) return "";

	const scopePrefix = `[data-template-id="${templateId}"]`;

	// Simple CSS scoping - prefix each rule selector
	// This is a basic implementation; a full CSS parser would be more robust
	return css.replace(
		/([^{}]+)(\{[^}]*\})/g,
		(match, selectors: string, rules: string) => {
			const scopedSelectors = selectors
				.split(",")
				.map((s: string) => {
					const trimmed = s.trim();
					// Don't scope @rules like @keyframes, @media
					if (trimmed.startsWith("@")) return trimmed;
					// Don't scope :root or html/body
					if (trimmed === ":root" || trimmed === "html" || trimmed === "body") {
						return trimmed;
					}
					return `${scopePrefix} ${trimmed}`;
				})
				.join(", ");
			return `${scopedSelectors}${rules}`;
		},
	);
}

/**
 * Component that renders user-defined templates safely
 */
export function UserTemplateScreen({
	screen,
	template,
	onNext,
	onBack,
	onSubmit,
	onGoto,
	onRestart,
}: UserTemplateScreenProps) {
	const styleRef = useRef<HTMLStyleElement | null>(null);
	const scriptRef = useRef<HTMLScriptElement | null>(null);
	const [purifyLoaded, setPurifyLoaded] = useState(!!domPurifyInstance);

	// Load DOMPurify on mount (browser only)
	useEffect(() => {
		if (!purifyLoaded) {
			loadDOMPurify().then(() => setPurifyLoaded(true));
		}
	}, [purifyLoaded]);

	// Build field values with defaults
	const fieldValues = useMemo(() => {
		const values: Record<string, string | boolean | number> = {};

		// Start with default values from template fields
		for (const field of template.fields) {
			if (field.defaultValue !== undefined) {
				values[field.id] = field.defaultValue;
			}
		}

		// Override with screen-specific values
		if (screen.fieldValues) {
			Object.assign(values, screen.fieldValues);
		}

		return values;
	}, [template.fields, screen.fieldValues]);

	// Interpolate and sanitize HTML (re-sanitize when DOMPurify loads)
	const sanitizedHtml = useMemo(() => {
		const interpolated = interpolateTemplate(template.html, fieldValues);
		return sanitizeHtml(interpolated);
	}, [template.html, fieldValues, purifyLoaded]);

	// Scope and inject CSS
	const scopedCss = useMemo(
		() => scopeCss(template.css || "", template.id),
		[template.css, template.id],
	);

	// Inject scoped CSS
	useEffect(() => {
		if (!scopedCss) return;

		// Create or update style element
		let styleEl = styleRef.current;
		if (!styleEl) {
			styleEl = document.createElement("style");
			styleEl.setAttribute("data-template-css", template.id);
			document.head.appendChild(styleEl);
			styleRef.current = styleEl;
		}
		styleEl.textContent = scopedCss;

		// Cleanup on unmount
		return () => {
			if (styleRef.current) {
				styleRef.current.remove();
				styleRef.current = null;
			}
		};
	}, [scopedCss, template.id]);

	// Inject template JavaScript
	useEffect(() => {
		if (!template.js) return;

		// Create script element
		const scriptEl = document.createElement("script");
		scriptEl.setAttribute("data-template-js", template.id);
		scriptEl.textContent = template.js;
		document.body.appendChild(scriptEl);
		scriptRef.current = scriptEl;

		// Cleanup on unmount
		return () => {
			if (scriptRef.current) {
				scriptRef.current.remove();
				scriptRef.current = null;
			}
		};
	}, [template.js, template.id]);

	// Handle action execution
	const executeAction = (action: ParsedAction) => {
		switch (action.action) {
			case LF_ACTIONS.NEXT:
				onNext();
				break;
			case LF_ACTIONS.BACK:
				if (onBack) onBack();
				break;
			case LF_ACTIONS.SUBMIT:
				if (onSubmit) onSubmit();
				else onNext(); // Fallback to next if no submit handler
				break;
			case LF_ACTIONS.GOTO:
				if (onGoto && action.target) onGoto(action.target);
				break;
			case LF_ACTIONS.RESTART:
				if (onRestart) onRestart();
				break;
			case LF_ACTIONS.LINK:
				if (action.url) {
					window.open(action.url, "_blank", "noopener,noreferrer");
				}
				break;
		}
	};

	// Handle button clicks within the template
	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;

		// Find the closest actionable element (button or element with data-lf-action)
		const actionElement =
			target.closest("[data-lf-action]") ||
			target.closest("button") ||
			target.closest(".lf-button");

		if (actionElement) {
			// Try to parse action from element
			const action = parseActionFromElement(actionElement as HTMLElement);

			if (action) {
				e.preventDefault();
				executeAction(action);
				return;
			}

			// Fallback: if it's a button without data-lf-action, treat as "next"
			if (
				actionElement.tagName === "BUTTON" ||
				actionElement.classList.contains("lf-button")
			) {
				e.preventDefault();
				onNext();
				return;
			}
		}

		// Handle external links (without data-lf-action)
		const link = target.closest("a") as HTMLAnchorElement | null;
		if (link && link.href && !link.hasAttribute("data-lf-action")) {
			// Let external links work normally
			return;
		}
	};

	return (
		<div
			className="lf-screen lf-user-template-screen"
			data-template-id={template.id}
			onClick={handleClick}
		>
			<div
				className="lf-user-template-content"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized via DOMPurify
				dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
			/>
		</div>
	);
}
