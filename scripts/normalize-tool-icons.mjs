import { readdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const iconDirectory = new URL("../public/tools/", import.meta.url);
const canvasSize = 1024;
const alphaThreshold = 8;
const paddingRatio = 0.06;

const parseViewBox = (svg, fileName) => {
	const match = svg.match(/viewBox=["']([^"']+)["']/i);
	const dimensions = !match
		? [svg.match(/\bwidth=["']([\d.]+)["']/i), svg.match(/\bheight=["']([\d.]+)["']/i)]
		: null;
	if (!match && (!dimensions?.[0] || !dimensions[1])) {
		throw new Error(`${fileName} does not define a viewBox or numeric dimensions`);
	}
	const values = match
		? match[1].trim().split(/[ ,]+/).map(Number)
		: [0, 0, Number(dimensions[0][1]), Number(dimensions[1][1])];
	if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
		throw new Error(`${fileName} has an invalid viewBox`);
	}
	return values;
};

const formatNumber = (value) => Number(value.toFixed(4)).toString();

for (const fileName of (await readdir(iconDirectory))
	.filter((name) => name.endsWith(".svg"))
	.sort()) {
	const fileUrl = new URL(fileName, iconDirectory);
	const svg = await readFile(fileUrl, "utf8");
	const [viewX, viewY, viewWidth, viewHeight] = parseViewBox(svg, fileName);
	const { data, info } = await sharp(Buffer.from(svg), { density: 384 })
		.resize(canvasSize, canvasSize, { fit: "contain" })
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	let minX = info.width;
	let minY = info.height;
	let maxX = -1;
	let maxY = -1;
	for (let y = 0; y < info.height; y += 1) {
		for (let x = 0; x < info.width; x += 1) {
			if (data[(y * info.width + x) * info.channels + 3] <= alphaThreshold) continue;
			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		}
	}
	if (maxX < minX || maxY < minY) throw new Error(`${fileName} has no visible pixels`);

	const scale = Math.min(canvasSize / viewWidth, canvasSize / viewHeight);
	const offsetX = (canvasSize - viewWidth * scale) / 2;
	const offsetY = (canvasSize - viewHeight * scale) / 2;
	const contentX = viewX + (minX - offsetX) / scale;
	const contentY = viewY + (minY - offsetY) / scale;
	const contentWidth = (maxX - minX + 1) / scale;
	const contentHeight = (maxY - minY + 1) / scale;
	const side = Math.max(contentWidth, contentHeight) * (1 + paddingRatio * 2);
	const normalizedX = contentX + contentWidth / 2 - side / 2;
	const normalizedY = contentY + contentHeight / 2 - side / 2;
	const viewBox = [normalizedX, normalizedY, side, side].map(formatNumber).join(" ");

	const withViewBox = /viewBox=/i.test(svg)
		? svg.replace(/viewBox=["'][^"']+["']/i, `viewBox="${viewBox}"`)
		: svg.replace(/<svg\b/i, `<svg viewBox="${viewBox}"`);
	const normalized = withViewBox
		.replace(/(<svg\b[^>]*?)\swidth=["'][^"']+["']/i, "$1")
		.replace(/(<svg\b[^>]*?)\sheight=["'][^"']+["']/i, "$1");
	await writeFile(fileUrl, normalized);
}

console.log("Normalized tool SVG viewBoxes to their visible content bounds.");
