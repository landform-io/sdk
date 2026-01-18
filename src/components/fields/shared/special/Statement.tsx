/**
 * Statement - Unified statement/info screen component
 *
 * Handles: statement (informational screens with continue button)
 */

import type { StatementProps } from "../types";
import { getModeBehavior } from "../types";

export function Statement({
	field,
	onNext,
	mode,
}: StatementProps) {
	const behavior = getModeBehavior(mode);

	const buttonText = field.properties?.buttonText || "Continue";

	const handleClick = () => {
		if (!behavior.allowValueChanges) return;
		onNext?.();
	};

	return (
		<div className="text-center">
			<button
				type="button"
				onClick={handleClick}
				className="lf-button px-8 py-3"
			>
				{buttonText}
			</button>
		</div>
	);
}

export default Statement;
