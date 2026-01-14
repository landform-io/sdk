import React, { createContext, useContext, useMemo } from "react";
import { useForm, type UseFormOptions, type UseFormReturn } from "../hooks/useForm";
import { ThemeContext } from "../hooks/useTheme";
import type { FormContent, FormSettings } from "../types";

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

	return (
		<ThemeContext.Provider value={options.theme}>
			<FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
		</ThemeContext.Provider>
	);
}
