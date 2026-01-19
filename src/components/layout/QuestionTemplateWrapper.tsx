import React, { useMemo, useEffect, useRef, useId } from "react";
import DOMPurify from "isomorphic-dompurify";
import type { QuestionPageTemplate } from "../../types";
import {
	parseActionFromElement,
	type ParsedAction,
	LF_ACTIONS,
} from "../../actions";

export interface QuestionTemplateWrapperProps {
	/** The template configuration */
	template: QuestionPageTemplate;
	/** The field component to render inside the template */
	children: React.ReactNode;
	/** Navigation handlers */
	onNext: () => void;
	onBack?: () => void;
	onSubmit?: () => void;
	onGoto?: (screenId: string) => void;
	onRestart?: () => void;
}

/**
 * Allowed data-lf-* attributes for actions
 */
const ALLOWED_LF_ATTRS = [
	"data-lf-action",
	"data-lf-target",
	"data-lf-url",
];

/**
 * Sanitizes HTML content using DOMPurify
 * Does not allow scripts for security
 */
function sanitizeHtml(html: string): string {
	return DOMPurify.sanitize(html, {
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
			"kbd",
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
			// Allow Landform action attributes
			...ALLOWED_LF_ATTRS,
		],
		ALLOW_DATA_ATTR: false,
		ADD_ATTR: ["target"],
		// No scripts, iframes, forms, or inputs for security
		FORBID_TAGS: ["script", "style", "iframe", "form", "input", "textarea"],
	});
}

/**
 * Prefixes CSS selectors to scope styles to the template
 */
function scopeCss(css: string, scopeId: string): string {
	if (!css) return "";

	const scopePrefix = `[data-question-template-id="${scopeId}"]`;

	// Simple CSS scoping - prefix each rule selector
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
					if (
						trimmed === ":root" ||
						trimmed === "html" ||
						trimmed === "body"
					) {
						return trimmed;
					}
					return `${scopePrefix} ${trimmed}`;
				})
				.join(", ");
			return `${scopedSelectors}${rules}`;
		}
	);
}

/**
 * Marker string for the field placeholder
 */
const FIELD_PLACEHOLDER = "{{field}}";
const FIELD_MARKER_ID = "__lf_field_placeholder__";

/**
 * Wrapper component that renders custom HTML template around a field component.
 * Uses {{field}} placeholder to mark where the field should be inserted.
 */
export function QuestionTemplateWrapper({
	template,
	children,
	onNext,
	onBack,
	onSubmit,
	onGoto,
	onRestart,
}: QuestionTemplateWrapperProps) {
	const uniqueId = useId();
	const scopeId = `qt-${uniqueId.replace(/:/g, "")}`;
	const styleRef = useRef<HTMLStyleElement | null>(null);
	const fieldContainerRef = useRef<HTMLDivElement | null>(null);

	// Replace {{field}} with a placeholder div that we can identify
	const htmlWithMarker = useMemo(() => {
		return template.html.replace(
			FIELD_PLACEHOLDER,
			`<div id="${FIELD_MARKER_ID}"></div>`
		);
	}, [template.html]);

	// Sanitize the HTML
	const sanitizedHtml = useMemo(() => {
		return sanitizeHtml(htmlWithMarker);
	}, [htmlWithMarker]);

	// Scope the CSS
	const scopedCss = useMemo(
		() => scopeCss(template.css || "", scopeId),
		[template.css, scopeId]
	);

	// Inject scoped CSS
	useEffect(() => {
		if (!scopedCss) return;

		let styleEl = styleRef.current;
		if (!styleEl) {
			styleEl = document.createElement("style");
			styleEl.setAttribute("data-question-template-css", scopeId);
			document.head.appendChild(styleEl);
			styleRef.current = styleEl;
		}
		styleEl.textContent = scopedCss;

		return () => {
			if (styleRef.current) {
				styleRef.current.remove();
				styleRef.current = null;
			}
		};
	}, [scopedCss, scopeId]);

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

		// Don't intercept clicks on the field content itself
		if (fieldContainerRef.current?.contains(target)) {
			return;
		}

		// Find the closest actionable element
		const actionElement =
			target.closest("[data-lf-action]") ||
			target.closest("button") ||
			target.closest(".lf-button");

		if (actionElement) {
			// Don't process if it's inside the field container
			if (fieldContainerRef.current?.contains(actionElement as Node)) {
				return;
			}

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
	};

	return (
		<div
			className="lf-question-template-wrapper"
			data-question-template-id={scopeId}
			onClick={handleClick}
		>
			{/* Template content with placeholder for field */}
			<TemplateContent
				html={sanitizedHtml}
				fieldContent={children}
				fieldContainerRef={fieldContainerRef}
			/>
		</div>
	);
}

/**
 * Component that renders the template HTML and injects the field at the placeholder
 */
function TemplateContent({
	html,
	fieldContent,
	fieldContainerRef,
}: {
	html: string;
	fieldContent: React.ReactNode;
	fieldContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
	const containerRef = useRef<HTMLDivElement>(null);

	// After the HTML is rendered, find the placeholder and inject a portal target
	useEffect(() => {
		if (!containerRef.current) return;

		const placeholder = containerRef.current.querySelector(`#${FIELD_MARKER_ID}`);
		if (placeholder && fieldContainerRef.current) {
			// Move the field container into the placeholder position
			placeholder.replaceWith(fieldContainerRef.current);
		}
	}, [html, fieldContainerRef]);

	return (
		<>
			{/* Render the template HTML */}
			<div
				ref={containerRef}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized via DOMPurify
				dangerouslySetInnerHTML={{ __html: html }}
			/>
			{/* Hidden container for the field that will be moved into the template */}
			<div
				ref={fieldContainerRef}
				className="lf-question-field-container"
				style={{ display: "contents" }}
			>
				{fieldContent}
			</div>
		</>
	);
}
