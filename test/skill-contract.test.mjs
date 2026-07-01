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

test("lazyprompt does not require multi-turn question interviews", async () => {
	for (const path of skillPaths) {
		const skill = await readSkill(path);

		assert.doesNotMatch(skill, /확인 전에는 프롬프트를 생성하지 않는다/);
		assert.doesNotMatch(skill, /한 번에 하나씩/);
		assert.doesNotMatch(skill, /고정 질문.*묻는다/);

		assert.match(skill, /질문 없이 바로.*출력/s);
		assert.match(skill, /한 번에.*묶어서.*묻/s);
	}
});

test("repository-local and packaged skill copies stay in sync", async () => {
	const [localSkill, packagedSkill] = await Promise.all(skillPaths.map(readSkill));

	assert.equal(localSkill, packagedSkill);
});
