// Placeholder for validation utilities
// TODO: Add field-specific validators

export function validateRequired(value: unknown): boolean {
	if (value === undefined || value === null || value === "") {
		return false;
	}
	if (Array.isArray(value) && value.length === 0) {
		return false;
	}
	return true;
}

export function validateEmail(value: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(value);
}

export function validateUrl(value: string): boolean {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
}

export function validateMinLength(value: string, minLength: number): boolean {
	return value.length >= minLength;
}

export function validateMaxLength(value: string, maxLength: number): boolean {
	return value.length <= maxLength;
}

export function validateMinValue(value: number, minValue: number): boolean {
	return value >= minValue;
}

export function validateMaxValue(value: number, maxValue: number): boolean {
	return value <= maxValue;
}
