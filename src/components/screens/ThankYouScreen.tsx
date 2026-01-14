import React from "react";
import type { ThankYouScreen as ThankYouScreenType } from "../../types";

export interface ThankYouScreenProps {
	screen: ThankYouScreenType;
}

export function ThankYouScreen({ screen }: ThankYouScreenProps) {
	const { title, properties, attachment } = screen;

	const handleButtonClick = () => {
		switch (properties.buttonMode) {
			case "reload":
				window.location.reload();
				break;
			case "redirect":
				if (properties.redirectUrl) {
					window.location.href = properties.redirectUrl;
				}
				break;
			default:
				// Do nothing
				break;
		}
	};

	return (
		<div className="lf-screen">
			{attachment && attachment.type === "image" && (
				<img
					src={attachment.href}
					alt={attachment.properties?.description || ""}
					style={{ maxWidth: "100%", maxHeight: "300px", marginBottom: "2rem" }}
				/>
			)}

			<h1 className="lf-screen-title">{title}</h1>

			{properties.description && (
				<p className="lf-screen-description">{properties.description}</p>
			)}

			{properties.showButton && (
				<button type="button" className="lf-button" onClick={handleButtonClick}>
					{properties.buttonText || "Done"}
				</button>
			)}
		</div>
	);
}
