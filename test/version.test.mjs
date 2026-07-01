import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readJson = async (path) =>
	JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));

const readText = async (path) =>
	readFile(new URL(`../${path}`, import.meta.url), "utf8");

const core = (v) => String(v).split("+")[0];

test("package.json version is clean SemVer", async () => {
	const pkg = await readJson("package.json");
	assert.match(pkg.version, /^\d+\.\d+\.\d+$/, `unexpected version: ${pkg.version}`);
});

test("plugin manifest version stays in sync with package.json", async () => {
	const [pkg, plugin] = await Promise.all([
		readJson("package.json"),
		readJson("plugins/lazyprompt/.codex-plugin/plugin.json"),
	]);

	assert.equal(
		core(plugin.version),
		pkg.version,
		`plugin.json (${plugin.version}) core must equal package.json (${pkg.version}); run \`npm run version:sync\``,
	);
});

test("plugin manifest version is valid SemVer (core or core+metadata)", async () => {
	const plugin = await readJson("plugins/lazyprompt/.codex-plugin/plugin.json");
	assert.match(
		plugin.version,
		/^\d+\.\d+\.\d+(\+[0-9A-Za-z.-]+)?$/,
		`unexpected plugin version: ${plugin.version}`,
	);
});

test("CHANGELOG documents the current package version", async () => {
	const [pkg, changelog] = await Promise.all([
		readJson("package.json"),
		readText("CHANGELOG.md"),
	]);

	assert.match(changelog, /## \[Unreleased\]/, "CHANGELOG must keep an [Unreleased] section");
	assert.ok(
		changelog.includes(`## [${pkg.version}]`),
		`CHANGELOG.md is missing a released entry for ${pkg.version}`,
	);
});
