import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

export default defineConfig({
	base: "./",
	plugins: [
		react(),
		polyfillNode({
			globals: { buffer: true },
			polyfills: {
				stream: true,
			},
		}),
	],
	build: {
		outDir: "dist",
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			"@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
		},
	},
});
