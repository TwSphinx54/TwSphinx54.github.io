import type { ImageMetadata } from "astro";

const assets = import.meta.glob<ImageMetadata>(
	[
		"../assets/icons/*.{png,jpg,jpeg,svg,gif,webp}",
		"../assets/logos/*.{png,jpg,jpeg,svg,gif,webp}",
	],
	{ eager: true, import: "default" },
);

function normalizeAssetPath(path: string): string {
	const value = path.trim();
	if (value.startsWith("../assets/")) return value;
	if (value.startsWith("/src/assets/")) return `..${value.replace("/src", "")}`;
	if (value.startsWith("/assets/")) return `../assets${value.replace("/assets", "")}`;
	return `../assets/${value}`;
}

export function resolveAsset(path?: string): ImageMetadata | null {
	if (!path) return null;
	return assets[normalizeAssetPath(path)] ?? null;
}

export function findAssetByName(keys: string | string[]): ImageMetadata | null {
	const candidates = Array.isArray(keys) ? keys : [keys];
	const match = Object.entries(assets).find(([path]) =>
		candidates.some((key) => path.toLowerCase().includes(key.toLowerCase())),
	);
	return match?.[1] ?? null;
}
