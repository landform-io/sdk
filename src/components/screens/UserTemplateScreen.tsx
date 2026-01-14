import React, { useMemo, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import type { CustomPageTemplate, UserDefinedScreen } from "../../types";

export interface UserTemplateScreenProps {
	screen: UserDefinedScreen;
	template: CustomPageTemplate;
	onNext: () => void;
}

/**
 * Interpolates template variables in HTML
 */
function interpolateTemplate(
	html: string,
	fieldValues: Record<string, string | boolean | number>
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
 * Sanitizes HTML content using DOMPurify
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
		],
		ALLOW_DATA_ATTR: false,
		ADD_ATTR: ["target"],
		// Ensure links open in new tabs
		FORBID_TAGS: ["script", "style", "iframe", "form", "input", "textarea"],
	});
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
 * Component that renders user-defined templates safely
 */
export function UserTemplateScreen({
	screen,
	template,
	onNext,
}: UserTemplateScreenProps) {
	const styleRef = useRef<HTMLStyleElement | null>(null);

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

	// Interpolate and sanitize HTML
	const sanitizedHtml = useMemo(() => {
		const interpolated = interpolateTemplate(template.html, fieldValues);
		return sanitizeHtml(interpolated);
	}, [template.html, fieldValues]);

	// Scope and inject CSS
	const scopedCss = useMemo(
		() => scopeCss(template.css || "", template.id),
		[template.css, template.id]
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

	// Handle button clicks within the template
	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;

		// If a button or link with class lf-button is clicked, advance
		if (
			target.tagName === "BUTTON" ||
			target.classList.contains("lf-button") ||
			target.closest("button") ||
			target.closest(".lf-button")
		) {
			e.preventDefault();
			onNext();
		}

		// Handle external links
		const link = target.closest("a") as HTMLAnchorElement | null;
		if (link && link.href && !link.classList.contains("lf-button")) {
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
