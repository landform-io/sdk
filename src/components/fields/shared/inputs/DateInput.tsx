/**
 * DateInput - Unified date input component
 *
 * Handles: date
 */

import { useState, useEffect } from "react";
import type { DateInputProps } from "../types";
import { getModeBehavior } from "../types";

export function DateInput({
	field,
	value,
	onChange,
	mode,
}: DateInputProps) {
	const behavior = getModeBehavior(mode);

	const structure = field.properties?.structure || "MMDDYYYY";
	const separator = field.properties?.separator || "/";

	// Parse existing value or default to empty
	const [parts, setParts] = useState<{
		day: string;
		month: string;
		year: string;
	}>(() => {
		if (value) {
			// Try to parse YYYY-MM-DD format (ISO)
			const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
			if (match) {
				return { year: match[1], month: match[2], day: match[3] };
			}
		}
		return { day: "", month: "", year: "" };
	});

	// Update the value when parts change
	useEffect(() => {
		if (parts.day && parts.month && parts.year) {
			// Store as ISO format (YYYY-MM-DD)
			onChange(`${parts.year}-${parts.month.padStart(2, "0")}-${parts.day.padStart(2, "0")}`);
		}
	}, [parts, onChange]);

	const handlePartChange = (part: "day" | "month" | "year", val: string) => {
		// Only allow numeric input
		const numeric = val.replace(/\D/g, "");
		const maxLength = part === "year" ? 4 : 2;
		const bounded = numeric.slice(0, maxLength);
		setParts((prev) => ({ ...prev, [part]: bounded }));
	};

	const getPlaceholder = () => {
		const d = "DD";
		const m = "MM";
		const y = "YYYY";
		switch (structure) {
			case "DDMMYYYY":
				return `${d}${separator}${m}${separator}${y}`;
			case "YYYYMMDD":
				return `${y}${separator}${m}${separator}${d}`;
			default:
				return `${m}${separator}${d}${separator}${y}`;
		}
	};

	const renderInputs = () => {
		const dayInput = (
			<input
				key="day"
				type="text"
				value={parts.day}
				onChange={(e) => handlePartChange("day", e.target.value)}
				placeholder="DD"
				className="lf-input lf-input-underline w-16 text-center py-3"
				maxLength={2}
				readOnly={!behavior.allowValueChanges}
			/>
		);
		const monthInput = (
			<input
				key="month"
				type="text"
				value={parts.month}
				onChange={(e) => handlePartChange("month", e.target.value)}
				placeholder="MM"
				className="lf-input lf-input-underline w-16 text-center py-3"
				maxLength={2}
				readOnly={!behavior.allowValueChanges}
				autoFocus={behavior.autoFocus && structure === "MMDDYYYY"}
			/>
		);
		const yearInput = (
			<input
				key="year"
				type="text"
				value={parts.year}
				onChange={(e) => handlePartChange("year", e.target.value)}
				placeholder="YYYY"
				className="lf-input lf-input-underline w-24 text-center py-3"
				maxLength={4}
				readOnly={!behavior.allowValueChanges}
				autoFocus={behavior.autoFocus && structure === "YYYYMMDD"}
			/>
		);
		const sep = (i: number) => (
			<span key={`sep-${i}`} className="lf-date-separator px-1" style={{ color: "var(--lf-color-placeholder)" }}>
				{separator}
			</span>
		);

		switch (structure) {
			case "DDMMYYYY":
				return [dayInput, sep(1), monthInput, sep(2), yearInput];
			case "YYYYMMDD":
				return [yearInput, sep(1), monthInput, sep(2), dayInput];
			default:
				return [monthInput, sep(1), dayInput, sep(2), yearInput];
		}
	};

	return (
		<div className="flex items-center">
			{renderInputs()}
		</div>
	);
}

export default DateInput;
