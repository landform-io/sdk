import React from "react";

export interface QuestionContainerProps {
	children: React.ReactNode;
	className?: string;
}

export function QuestionContainer({ children, className }: QuestionContainerProps) {
	return (
		<div className={`lf-question-container ${className || ""}`}>
			{children}
		</div>
	);
}
