/**
 * Signature - Unified signature component
 *
 * Handles: signature (with canvas drawing and typed alternatives)
 */

import { useRef, useState, useEffect, useCallback } from "react";
import type { SignatureValue } from "../../../../types";
import type { SignatureProps } from "../types";
import { getModeBehavior } from "../types";

export function Signature({
	field,
	value,
	onChange,
	mode,
}: SignatureProps) {
	const behavior = getModeBehavior(mode);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [signatureMode, setSignatureMode] = useState<"draw" | "type">("draw");
	const [typedName, setTypedName] = useState(value?.type === "typed" ? value.data : "");

	const width = field.properties?.width || 400;
	const height = field.properties?.height || 200;
	const strokeColor = field.properties?.strokeColor || "var(--lf-color-answer)";
	const strokeWidth = field.properties?.strokeWidth || 2;
	const backgroundColor = field.properties?.backgroundColor || "var(--lf-color-input-bg)";
	const showClearButton = field.properties?.showClearButton ?? true;
	const showTypedSignature = field.properties?.showTypedSignature ?? false;

	// Initialize canvas
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set background
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, width, height);

		// Restore previous signature if exists
		if (value?.type === "drawn" && value.data) {
			const img = new Image();
			img.onload = () => {
				ctx.drawImage(img, 0, 0);
			};
			img.src = value.data;
		}
	}, [backgroundColor, width, height]);

	const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
		const canvas = canvasRef.current;
		if (!canvas) return { x: 0, y: 0 };

		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;

		if ("touches" in e) {
			const touch = e.touches[0];
			return {
				x: (touch.clientX - rect.left) * scaleX,
				y: (touch.clientY - rect.top) * scaleY,
			};
		}
		return {
			x: (e.clientX - rect.left) * scaleX,
			y: (e.clientY - rect.top) * scaleY,
		};
	};

	const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
		if (!behavior.allowValueChanges) return;

		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!ctx) return;

		setIsDrawing(true);
		const { x, y } = getCoordinates(e);
		ctx.beginPath();
		ctx.moveTo(x, y);
	};

	const draw = (e: React.MouseEvent | React.TouchEvent) => {
		if (!isDrawing || !behavior.allowValueChanges) return;

		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!ctx) return;

		const { x, y } = getCoordinates(e);
		ctx.lineTo(x, y);
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = strokeWidth;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.stroke();
	};

	const stopDrawing = () => {
		if (!isDrawing) return;
		setIsDrawing(false);

		const canvas = canvasRef.current;
		if (canvas) {
			const dataUrl = canvas.toDataURL("image/png");
			onChange({ type: "drawn", data: dataUrl });
		}
	};

	const clearCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!ctx || !canvas) return;

		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		onChange({ type: "drawn", data: "" });
	}, [backgroundColor, onChange]);

	const handleTypedNameChange = (name: string) => {
		setTypedName(name);
		onChange({ type: "typed", data: name });
	};

	// Editor mode shows placeholder
	if (mode === "editor") {
		return (
			<div>
				<div
					className="lf-signature relative"
					style={{ height: "160px" }}
				>
					<div className="w-full h-full flex items-center justify-center">
						<p className="text-lg italic opacity-40" style={{ color: "var(--lf-color-placeholder)" }}>
							Sign here
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "var(--lf-spacing-option)" }}>
			{showTypedSignature && (
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setSignatureMode("draw")}
						className={`lf-scale-button px-4 py-2 text-sm ${signatureMode === "draw" ? "lf-scale-button-selected" : ""}`}
					>
						Draw
					</button>
					<button
						type="button"
						onClick={() => setSignatureMode("type")}
						className={`lf-scale-button px-4 py-2 text-sm ${signatureMode === "type" ? "lf-scale-button-selected" : ""}`}
					>
						Type
					</button>
				</div>
			)}

			{signatureMode === "draw" ? (
				<div className="relative">
					<canvas
						ref={canvasRef}
						width={width}
						height={height}
						className="w-full border-2 cursor-crosshair touch-none"
						style={{
							borderColor: "var(--lf-color-primary)",
							borderRadius: "var(--lf-border-radius)",
							maxWidth: width,
							aspectRatio: `${width} / ${height}`,
						}}
						onMouseDown={startDrawing}
						onMouseMove={draw}
						onMouseUp={stopDrawing}
						onMouseLeave={stopDrawing}
						onTouchStart={startDrawing}
						onTouchMove={draw}
						onTouchEnd={stopDrawing}
					/>
					{showClearButton && behavior.allowValueChanges && (
						<button
							type="button"
							onClick={clearCanvas}
							className="absolute top-2 right-2 lf-button-ghost px-3 py-1 text-sm bg-white/80"
							style={{ borderRadius: "var(--lf-border-radius)" }}
						>
							Clear
						</button>
					)}
				</div>
			) : (
				<div>
					<input
						type="text"
						value={typedName}
						onChange={(e) => handleTypedNameChange(e.target.value)}
						placeholder="Type your full name"
						className="lf-input lf-input-underline w-full py-3 text-2xl"
						style={{ fontFamily: "cursive" }}
						autoFocus={behavior.autoFocus}
						readOnly={!behavior.allowValueChanges}
					/>
					{typedName && (
						<div
							className="mt-4 py-6 px-4 text-center border-2"
							style={{
								borderColor: "var(--lf-color-primary)",
								borderRadius: "var(--lf-border-radius)",
								fontFamily: "cursive",
								fontSize: "2rem",
								color: "var(--lf-color-answer)",
							}}
						>
							{typedName}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default Signature;
