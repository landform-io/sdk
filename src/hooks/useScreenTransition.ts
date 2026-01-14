import { useState, useEffect, useCallback, useRef } from "react";
import type { ThemeScreenTransitions, ScreenTransitionType } from "../types";

/**
 * Default screen transitions configuration
 */
const DEFAULT_TRANSITIONS: ThemeScreenTransitions = {
	enabled: false,
	enterTransition: "fade",
	exitTransition: "fade",
	duration: "0.4s",
	easing: "cubic-bezier(0.4, 0, 0.2, 1)",
};

export interface UseScreenTransitionOptions {
	/** Screen transitions configuration from theme */
	transitions?: ThemeScreenTransitions;
	/** Current screen index */
	currentIndex: number;
}

export interface UseScreenTransitionReturn {
	/** CSS class to apply to the screen wrapper */
	transitionClass: string;
	/** Whether a transition is currently in progress */
	isTransitioning: boolean;
	/** Direction of the current transition */
	direction: "forward" | "backward" | null;
	/** CSS style object with transition variables */
	transitionStyle: React.CSSProperties;
	/** Whether to animate children with stagger effect */
	shouldStagger: boolean;
}

/**
 * Parse duration string to milliseconds
 */
function parseDuration(duration: string): number {
	if (duration.endsWith("ms")) {
		return parseFloat(duration);
	}
	if (duration.endsWith("s")) {
		return parseFloat(duration) * 1000;
	}
	return parseFloat(duration) * 1000;
}

/**
 * Hook for managing screen-to-screen transition animations
 *
 * @example
 * ```tsx
 * const { transitionClass, isTransitioning, transitionStyle } = useScreenTransition({
 *   transitions: theme.screenTransitions,
 *   currentIndex,
 * });
 *
 * return (
 *   <div className={`lf-screen-wrapper ${transitionClass}`} style={transitionStyle}>
 *     {content}
 *   </div>
 * );
 * ```
 */
export function useScreenTransition(
	options: UseScreenTransitionOptions
): UseScreenTransitionReturn {
	const { transitions = DEFAULT_TRANSITIONS, currentIndex } = options;

	const [isTransitioning, setIsTransitioning] = useState(false);
	const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
	const [direction, setDirection] = useState<"forward" | "backward" | null>(
		null
	);

	const prevIndexRef = useRef(currentIndex);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Clean up timeouts on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	// Handle index changes and trigger transitions
	useEffect(() => {
		if (!transitions.enabled) {
			prevIndexRef.current = currentIndex;
			return;
		}

		const prevIndex = prevIndexRef.current;

		if (prevIndex !== currentIndex) {
			// Clear any pending timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			// Determine direction
			const newDirection = currentIndex > prevIndex ? "forward" : "backward";
			setDirection(newDirection);
			setIsTransitioning(true);

			// Start exit phase
			setPhase("exit");

			// Calculate duration in milliseconds
			const durationMs = parseDuration(transitions.duration);

			// After exit animation, switch to enter phase
			timeoutRef.current = setTimeout(() => {
				setPhase("enter");

				// After enter animation, complete transition
				timeoutRef.current = setTimeout(() => {
					setIsTransitioning(false);
					setPhase("idle");
					setDirection(null);
				}, durationMs);
			}, durationMs);

			// Update previous index reference
			prevIndexRef.current = currentIndex;
		}
	}, [currentIndex, transitions]);

	// Get the appropriate transition type based on phase and direction
	const getTransitionType = useCallback((): ScreenTransitionType => {
		if (!transitions.enabled || phase === "idle") {
			return "none";
		}

		// Check for direction-specific overrides
		if (direction && transitions.directionOverrides?.[direction]) {
			return transitions.directionOverrides[direction]!;
		}

		// Use default enter/exit transitions
		return phase === "exit"
			? transitions.exitTransition
			: transitions.enterTransition;
	}, [direction, phase, transitions]);

	// Generate CSS class based on current state
	const transitionClass = (() => {
		if (!transitions.enabled || phase === "idle") {
			return "lf-transition-idle";
		}

		const transitionType = getTransitionType();
		return `lf-transition-${transitionType} lf-transition-${phase}`;
	})();

	// Generate style object with CSS custom properties
	const transitionStyle: React.CSSProperties = {
		"--lf-screen-transition-duration": transitions.duration,
		"--lf-screen-transition-easing": transitions.easing,
		"--lf-screen-stagger-delay": transitions.staggerDelay || "0.05s",
	} as React.CSSProperties;

	// Determine if children should be staggered
	const shouldStagger =
		transitions.enabled &&
		transitions.animateChildren === true &&
		phase === "enter";

	return {
		transitionClass,
		isTransitioning,
		direction,
		transitionStyle,
		shouldStagger,
	};
}
