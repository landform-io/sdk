import React, { createContext, useContext, useMemo } from "react";
import { useForm, type UseFormOptions, type UseFormReturn } from "../hooks/useForm";
import { ThemeContext } from "../hooks/useTheme";
import type { FormContent, FormSettings, FormTheme } from "../types";
import { createDefaultThemeVariables, DEFAULT_QUESTION_PAGE_TEMPLATE } from "../utils/liquid";

export interface FormContextValue extends UseFormReturn {
	content: FormContent;
	settings: FormSettings;
}

const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
	const ctx = useContext(FormContext);
	if (!ctx) {
		throw new Error("useFormContext must be used within a FormProvider");
	}
	return ctx;
}

export interface FormProviderProps extends UseFormOptions {
	children: React.ReactNode;
}

export function FormProvider({ children, ...options }: FormProviderProps) {
	const form = useForm(options);

	const contextValue = useMemo<FormContextValue>(
		() => ({
			...form,
			content: options.content,
			settings: options.settings,
		}),
		[form, options.content, options.settings]
	);

	// Ensure theme always has default variables and template for Liquid rendering to work
	const themeWithDefaults = useMemo<FormTheme>(() => ({
		...options.theme,
		variables: options.theme.variables ?? createDefaultThemeVariables(),
		// Inject default template if not present (null means explicitly disabled)
		questionPageTemplate: options.theme.questionPageTemplate === null
			? null
			: options.theme.questionPageTemplate ?? DEFAULT_QUESTION_PAGE_TEMPLATE,
	}), [options.theme]);

	return (
		<ThemeContext.Provider value={themeWithDefaults}>
			<FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
		</ThemeContext.Provider>
	);
}
