<div align="center">

# lazyprompt

**막연한 아이디어를 [lazycodex / OmO](https://github.com/code-yeongyu/lazycodex)의 `$ulw-plan`·`$ulw-loop`가 가장 잘 먹는 최적 프롬프트로 바꿔주는 Codex 스킬**

_Turn a vague idea into the optimal copy-paste prompt for `$ulw-plan` / `$ulw-loop`._
_Outputs prompt text only — it never auto-runs the target skill._

[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Codex](https://img.shields.io/badge/Codex-skill%20%2B%20plugin-7C3AED?style=flat-square)](https://developers.openai.com/codex/skills)
[![invoke](https://img.shields.io/badge/invoke-%24ulw--prompt--builder-111827?style=flat-square)](#사용-usage)

</div>

---

## TL;DR

```bash
codex plugin marketplace add devswha/lazyprompt
```

```text
$ulw-prompt-builder 결제 모듈 리팩터링 계획 세우고 싶어
```

스킬이 `plan` vs `loop`를 추론하고, 충분하면 바로 그대로 복붙할 수 있는 프롬프트를 3부로 뱉습니다.
정말 필요한 정보가 비어 있을 때만 한 번에 묶어 묻습니다.

---

## 왜 쓰나 (Why)

`ulw-loop`/`ulw-plan`은 입력 프롬프트의 **구조**에 따라 결과 품질이 갈립니다. 이 스킬은 그 보상 구조를 100% 채운 프롬프트를 대신 설계해 줍니다 — 당신은 아이디어만 던지면 됩니다.

## 동작 (How)

1. **타깃 추론** — 아이디어가 `ulw-plan`(계획)용인지 `ulw-loop`(실행)용인지 추론.
2. **바로 출력 우선** — 충분하면 질문 없이 생성하고, 부족할 때만 필요한 항목을 한 번에 질문.
3. **3부 출력** — Part A 복붙용 명령 + Part B 구조화 본문 + Part C 선택 근거.
4. **안전한 복붙 경계** — 실제 `$ulw-plan`/`$ulw-loop`에 붙여넣을 것은 Part A의 명령뿐입니다.

## 무엇이 채워지나 (Reward structure)

| 타깃 | 프롬프트에 자동으로 담기는 것 |
| --- | --- |
| `$ulw-loop` | goal + tier · 성공기준(`scenario`/`expectedEvidence`) · 완료 정의(모든 criterion pass + quality gate + `checkpoint`) · 적대적/엣지 케이스 · 검증 명령 · `Must-NOT` |
| `$ulw-plan` | 의도 신호(`CLEAR`/`UNCLEAR`/`interview-me`/`high-accuracy`) · owner-decision 표면화 · 맥락/제약 |

태스크에 맞는 OmO `$`-스킬도 **선택적으로** 끼워 넣습니다 — 검증→`$lsp`/`$ast-grep`, UI→`$frontend`, 마무리→`$review-work`/`$remove-ai-slops` (매칭 없으면 넣지 않음).

## 설치 (Install)

<details open>
<summary><b>1. 마켓플레이스 (권장)</b></summary>

```bash
codex plugin marketplace add devswha/lazyprompt
```
Codex 재시작 → `/plugins`에서 **devswha Skills** → `ulw-prompt-builder` 설치.
GUI에선 `/plugins` → **Add Marketplace** → `https://github.com/devswha/lazyprompt`.
</details>

<details>
<summary><b>2. 클론 후 그 안에서 Codex 실행 (설치 0단계)</b></summary>

```bash
git clone https://github.com/devswha/lazyprompt
cd lazyprompt
codex   # .agents/skills/ 자동 인식 → $ulw-prompt-builder 바로 사용
```
</details>

<details>
<summary><b>3. 개인 전역 스킬로 복사</b></summary>

```bash
cp -R .agents/skills/ulw-prompt-builder ~/.agents/skills/
```
어느 레포에서나 `$ulw-prompt-builder` 사용 가능.
</details>

> 설치 후 안 보이면 Codex를 재시작하세요.

## 사용 (Usage)

Codex composer에서 `$`로 스킬 목록을 열거나 직접 호출:

```text
$ulw-prompt-builder Node 백엔드에 로그인 API 구현시키고 싶어
```

스킬이 `loop`를 추론하고 필요한 보상요소를 채운 뒤, 아래 형태로 출력합니다:

```text
Part A — 복붙용 명령
$ulw-loop "<bullet/번호 목록 없는 한 개의 연속 브리프>"

Part B — 구조화 본문
- Desired outcome / Success criteria(scenario·expectedEvidence)
- Completion definition / Adversarial cases / Verification / Must-NOT
- Optional OmO skill hints: $programming, $review-work

Part C — 선택 근거
- 완료 판정 기준 / tier / $skill 주입 근거
```

Part A의 명령만 복사해 `$ulw-loop`(또는 `$ulw-plan`)에 붙여넣으면 끝. Part B/C는 검토용 설명입니다.

> 왜 Part A가 bullet 없는 연속 브리프인가요? `ulw-loop create-goals`는 bullet/번호 줄을 별도 goal 후보로 파싱합니다. Part A를 한 개의 연속 브리프로 유지하면 성공기준과 검증 절차는 풍부하게 전달하면서도 goal 과분할을 피할 수 있습니다.

## 구조 (Layout)

```text
.agents/skills/ulw-prompt-builder/SKILL.md          # 레포-로컬 자동 discovery (방법 2)
.agents/plugins/marketplace.json                    # 마켓플레이스 매니페스트 (방법 1)
plugins/ulw-prompt-builder/
├── .codex-plugin/plugin.json                       # Codex 플러그인 매니페스트
└── skills/ulw-prompt-builder/SKILL.md              # 플러그인 동봉 스킬 (방법 1)
```

## Non-goals

- 대상 스킬을 자동 실행하지 않음 — 프롬프트 텍스트만 출력.
- 사용자가 확인하지 않은 성공기준·제약을 날조하지 않음.
- 카탈로그에 없는 `$skill`을 날조하지 않음.
- OmO `$`-스킬 카탈로그 자동 동기화는 범위 밖 (로컬 OmO 4.13.0 / 2026-07 snapshot, 수동 갱신).

## License

[MIT](LICENSE)
