#!/usr/bin/env node
// Single source of truth for the project version is package.json.
// This script keeps the Codex plugin manifest (and CHANGELOG on release) in sync.
//
// Usage:
//   node scripts/sync-version.mjs            sync plugin.json to package.json version
//   node scripts/sync-version.mjs --check    verify sync without writing (exit 1 on drift)
//   node scripts/sync-version.mjs --release  sync plugin.json + stamp CHANGELOG [Unreleased]
//
// Invoked automatically by `npm version <major|minor|patch>` via the "version" hook.

import { readFile, writeFile } from "node:fs/promises";

const ROOT = new URL("../", import.meta.url);
const PKG = new URL("package.json", ROOT);
const PLUGIN = new URL("plugins/lazyprompt/.codex-plugin/plugin.json", ROOT);
const CHANGELOG = new URL("CHANGELOG.md", ROOT);

const SEMVER_CORE = /^\d+\.\d+\.\d+$/;

const mode = process.argv[2] ?? "--sync";
const VALID = new Set(["--sync", "--check", "--release"]);
if (!VALID.has(mode)) {
	console.error(`unknown mode: ${mode} (expected --sync | --check | --release)`);
	process.exit(2);
}

/** Strip SemVer build metadata (everything from the first `+`). */
const core = (v) => String(v).split("+")[0];

/** Deterministic build-metadata tag: codex.YYYYMMDDHHmmss (UTC). */
function buildTag(date = new Date()) {
	const p = (n) => String(n).padStart(2, "0");
	return (
		`codex.${date.getUTCFullYear()}${p(date.getUTCMonth() + 1)}${p(date.getUTCDate())}` +
		`${p(date.getUTCHours())}${p(date.getUTCMinutes())}${p(date.getUTCSeconds())}`
	);
}

async function readJson(url) {
	return JSON.parse(await readFile(url, "utf8"));
}

async function writeJson(url, value) {
	await writeFile(url, `${JSON.stringify(value, null, 2)}\n`);
}

const pkg = await readJson(PKG);
const version = pkg.version;

if (!SEMVER_CORE.test(version)) {
	console.error(`package.json version is not clean SemVer (x.y.z): ${version}`);
	process.exit(1);
}

const plugin = await readJson(PLUGIN);

if (mode === "--check") {
	const pluginCore = core(plugin.version);
	if (pluginCore !== version) {
		console.error(
			`version drift: package.json=${version} plugin.json=${plugin.version} (core ${pluginCore}).\n` +
				`Run \`npm run version:sync\` to fix.`,
		);
		process.exit(1);
	}
	console.log(`version in sync: ${version}`);
	process.exit(0);
}

// --sync / --release: write the version into plugin.json with fresh build metadata.
const nextPluginVersion = `${version}+${buildTag()}`;
if (plugin.version !== nextPluginVersion) {
	plugin.version = nextPluginVersion;
	await writeJson(PLUGIN, plugin);
}
console.log(`plugin.json version -> ${nextPluginVersion}`);

if (mode === "--release") {
	const today = new Date().toISOString().slice(0, 10);
	let changelog = await readFile(CHANGELOG, "utf8");
	const heading = "## [Unreleased]";

	if (!changelog.includes(heading)) {
		console.error("CHANGELOG.md is missing an `## [Unreleased]` section; skipping stamp.");
		process.exit(1);
	}
	if (changelog.includes(`## [${version}]`)) {
		console.log(`CHANGELOG.md already has an entry for ${version}; skipping stamp.`);
	} else {
		changelog = changelog.replace(heading, `${heading}\n\n## [${version}] - ${today}`);
		// Refresh the compare/tag reference links at the bottom of the file.
		const repo = "https://github.com/devswha/lazyprompt";
		const unreleasedLink = `[Unreleased]: ${repo}/compare/v${version}...HEAD`;
		const versionLink = `[${version}]: ${repo}/releases/tag/v${version}`;
		if (/^\[Unreleased\]:.*$/m.test(changelog)) {
			changelog = changelog.replace(
				/^\[Unreleased\]:.*$/m,
				`${unreleasedLink}\n${versionLink}`,
			);
		} else {
			changelog = `${changelog.replace(/\s*$/, "")}\n\n${unreleasedLink}\n${versionLink}\n`;
		}
		await writeFile(CHANGELOG, changelog);
		console.log(`CHANGELOG.md stamped ${version} (${today})`);
	}
}
