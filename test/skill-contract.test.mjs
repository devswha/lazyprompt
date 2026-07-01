import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skillPaths = [
	".agents/skills/lazyprompt/SKILL.md",
	"plugins/lazyprompt/skills/lazyprompt/SKILL.md",
];

async function readSkill(path) {
	return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("default output stays one-shot and deep interview is opt-in", async () => {
	for (const path of skillPaths) {
		const skill = await readSkill(path);

		// The default path must never force a gated, fixed-question interview.
		assert.doesNotMatch(skill, /확인 전에는 프롬프트를 생성하지 않는다/);
		assert.doesNotMatch(skill, /고정 질문.*묻는다/);

		// Default one-shot behavior is preserved.
		assert.match(skill, /질문 없이 바로.*출력/s);
		assert.match(skill, /한 번에.*묶어서.*묻/s);

		// Deep interview is an explicit, default-off option.
		assert.match(skill, /--interview/);
		assert.match(skill, /딥 인터뷰는 \*\*옵션일 때만\*\* 켠다/);
		assert.match(skill, /한 번에 한 질문 \(딥 인터뷰 모드에서만\)/);
	}
});

test("deep-interview mode ports the GJC ambiguity algorithm faithfully", async () => {
	for (const path of skillPaths) {
		const skill = await readSkill(path);

		// Weighted-dimension ambiguity formulas (greenfield + brownfield).
		assert.match(skill, /goal×0\.40 \+ constraints×0\.30 \+ criteria×0\.30/);
		assert.match(skill, /goal×0\.35 \+ constraints×0\.25 \+ criteria×0\.25 \+ context×0\.15/);

		// Depth thresholds: quick 0.60 / standard 0.50 / deep 0.35.
		assert.match(skill, /`--quick` \| 0\.60/);
		assert.match(skill, /`--standard` \| 0\.50/);
		assert.match(skill, /`--deep` \| 0\.35/);

		// Core mechanics: Round 0 topology gate, weakest-dimension targeting,
		// and bidirectional (non-monotonic) scoring.
		assert.match(skill, /토폴로지 게이트/);
		assert.match(skill, /가장 약한/);
		assert.match(skill, /양방향·비단조/);
	}
});

test("oh-my-codex hardening patterns are present in both skill copies", async () => {
	for (const path of skillPaths) {
		const skill = await readSkill(path);

		// Plan reward hardening: RALPLAN-DR, ADR, quality bars, deliberate tier.
		assert.match(skill, /RALPLAN-DR/);
		assert.match(skill, /ADR/);
		assert.match(skill, /pre-mortem/);
		assert.match(skill, /deliberate/);

		// Loop reward hardening: LIGHT/HEAVY triage, real-surface evidence, cleanup.
		assert.match(skill, /LIGHT/);
		assert.match(skill, /HEAVY/);
		assert.match(skill, /curl -i/);
		assert.match(skill, /필요조건일 뿐/);

		// High-risk (deliberate) triggers.
		assert.match(skill, /인증·보안/);
		assert.match(skill, /마이그레이션/);

		// Deep-interview enrichment: fact/decision routing labels + challenge modes.
		assert.match(skill, /\[from-code\]\[auto-confirmed\]/);
		assert.match(skill, /\[from-user\]/);
		assert.match(skill, /Simplifier/);
		assert.match(skill, /Ontologist/);
	}
});

test("repository-local and packaged skill copies stay in sync", async () => {
	const [localSkill, packagedSkill] = await Promise.all(skillPaths.map(readSkill));

	assert.equal(localSkill, packagedSkill);
});
