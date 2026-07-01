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

test("clear input stays one-shot; vague input auto-triggers a skippable interview", async () => {
	for (const path of skillPaths) {
		const skill = await readSkill(path);

		// The default path must never force a gated, fixed-question interview.
		assert.doesNotMatch(skill, /확인 전에는 프롬프트를 생성하지 않는다/);
		assert.doesNotMatch(skill, /고정 질문.*묻는다/);

		// Default one-shot behavior is preserved.
		assert.match(skill, /질문 없이 바로.*출력/s);
		assert.match(skill, /한 번에.*묶어서.*묻/s);

		// Clear inputs still produce a one-shot prompt (no forced gate).
		assert.match(skill, /명확하면.*바로.*출력/s);

		// Vague inputs auto-trigger the interview (OmX-style), always skippable.
		assert.match(skill, /--interview/);
		assert.match(skill, /막연할 때 자동으로 켜진다/);
		assert.match(skill, /--direct/);
		assert.match(skill, /그냥 만들어/);

		// Once interviewing, questions stay one-at-a-time (targeted, not fixed).
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
