import React from "react";

export interface FormContainerProps {
	children: React.ReactNode;
	className?: string;
}

export function FormContainer({ children, className }: FormContainerProps) {
	return <div className={`lf-form ${className || ""}`}>{children}</div>;
}
