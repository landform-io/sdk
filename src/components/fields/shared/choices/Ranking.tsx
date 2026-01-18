/**
 * Ranking - Unified ranking component
 *
 * Handles: ranking
 */

import type { Choice } from "../../../../types";
import type { RankingProps } from "../types";
import { getModeBehavior } from "../types";

export function Ranking({
	field,
	value,
	onChange,
	mode,
}: RankingProps) {
	const behavior = getModeBehavior(mode);

	const choices = field.properties?.choices || [];
	const orderedChoices = value?.length
		? value.map((ref) => choices.find((c) => c.ref === ref)).filter(Boolean) as Choice[]
		: choices;

	return (
		<div className="lf-options">
			{orderedChoices.map((choice, index) => (
				<div
					key={choice.ref}
					className="lf-choice"
					style={{ cursor: behavior.allowValueChanges ? "grab" : "default" }}
				>
					<span className="lf-key-hint">{index + 1}</span>
					<span className="flex-1">{choice.label}</span>
					{behavior.allowValueChanges && (
						<svg className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
						</svg>
					)}
				</div>
			))}
		</div>
	);
}

export default Ranking;
