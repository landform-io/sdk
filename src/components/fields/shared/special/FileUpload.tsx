/**
 * FileUpload - Unified file upload component
 *
 * Handles: file_upload
 */

import type { FileUploadProps } from "../types";
import { getModeBehavior } from "../types";

export function FileUpload({
	field,
	value,
	onChange,
	mode,
}: FileUploadProps) {
	const behavior = getModeBehavior(mode);

	// In editor mode, just show placeholder UI
	return (
		<div className="lf-file-upload">
			<svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
			</svg>
			<p style={{ color: "var(--lf-color-placeholder)" }}>
				Drag & drop or <span style={{ color: "var(--lf-color-primary)" }}>browse files</span>
			</p>
		</div>
	);
}

export default FileUpload;
