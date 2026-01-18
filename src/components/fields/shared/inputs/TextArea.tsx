/**
 * TextArea - Unified text area component
 *
 * Handles: long_text
 */

import type { TextAreaProps } from "../types";
import { getModeBehavior } from "../types";

export function TextArea({
	field,
	value,
	onChange,
	mode,
}: TextAreaProps) {
	const behavior = getModeBehavior(mode);

	const placeholder = field.properties?.placeholder || "Type your answer here...";

	return (
		<textarea
			value={value || ""}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className="lf-input lf-input-bordered w-full py-3 px-3 min-h-[120px] resize-y"
			readOnly={!behavior.allowValueChanges}
			autoFocus={behavior.autoFocus}
		/>
	);
}

export default TextArea;
