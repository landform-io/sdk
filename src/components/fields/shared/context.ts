/**
 * Field Context Provider
 *
 * Provides mode and settings to nested field components without prop drilling.
 */

import { createContext, useContext } from "react";
import type { FieldMode } from "./types";

export interface FieldContextValue {
	/** Current rendering mode */
	mode: FieldMode;
	/** Whether to show keyboard hints on choices */
	showKeyHints: boolean;
	/** Question number (if showing) */
	questionNumber?: number;
	/** Whether to show question numbers */
	showQuestionNumber: boolean;
}

const defaultContext: FieldContextValue = {
	mode: "live",
	showKeyHints: true,
	showQuestionNumber: false,
};

export const FieldContext = createContext<FieldContextValue>(defaultContext);

export function useFieldContext(): FieldContextValue {
	return useContext(FieldContext);
}

export function useFieldMode(): FieldMode {
	const ctx = useContext(FieldContext);
	return ctx.mode;
}
