import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"hooks/index": "src/hooks/index.ts",
		"components/index": "src/components/index.ts",
		"theme/index": "src/theme/index.ts",
		"api/index": "src/api/index.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	splitting: true,
	sourcemap: true,
	clean: true,
	treeshake: true,
	external: ["react", "react-dom"],
	esbuildOptions(options) {
		options.jsx = "automatic";
	},
});
