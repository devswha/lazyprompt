# ULW Prompt Builder

막연한 아이디어를 [lazycodex / OmO](https://github.com/code-yeongyu/lazycodex)의 `$ulw-plan`(계획)·`$ulw-loop`(증거기반 실행)가 **가장 잘 받아먹는 최적 입력 프롬프트**로 바꿔주는 Codex 스킬. 출력은 프롬프트 텍스트뿐이며, 대상 스킬을 자동 실행하지 않습니다(복사해서 직접 붙여넣기).

> Turn a vague idea into the optimal copy-paste prompt for lazycodex/OmO `$ulw-plan` or `$ulw-loop`. Outputs prompt text only — it never runs the target skill.

## 무엇을 하나 (What it does)

1. **타깃 추천 + 확인** — 아이디어가 `ulw-plan`(계획)용인지 `ulw-loop`(실행)용인지 추천하고, 당신이 확정.
2. **가벼운 인터뷰** — 타깃별 고정 질문 3~5개로 다듬음 (모호도 점수/게이트 없음).
3. **보상구조 100% 반영**
   - `ulw-loop`: 성공기준(`scenario`/`expectedEvidence`) + 완료 약속(completion promise) + 적대적/엣지 케이스 + 검증 명령 + `Must-NOT`
   - `ulw-plan`: 의도 신호(CLEAR/UNCLEAR/interview-me/high-accuracy) + owner-decision 표면화 + 맥락/제약
4. **OmO `$`-스킬 선택 주입** — 태스크 유형에 맞는 스킬만 graceful하게 (검증→`$LSP`/`$AST-grep`, UI→`$frontend-ui-ux`, 마무리→`$review-work`/`$remove-ai-slops` …).
5. **3부 출력** — 복붙용 전체 명령 + 구조화 본문 + 플래그 선택 이유.

## 설치 (Install)

### 방법 1 — Codex 마켓플레이스 (권장, 가장 간단)

```bash
codex plugin marketplace add devswha/lazyprompt
# Codex 재시작 후, 플러그인 디렉터리에서 "devswha Skills" 마켓플레이스 → ulw-prompt-builder 설치
```

또는 Codex 안에서 `/plugins` → **Add Marketplace** → `https://github.com/devswha/lazyprompt` 입력 후 `ulw-prompt-builder` 설치.

### 방법 2 — 레포 클론 후 그 안에서 Codex 실행 (자동 discovery)

Codex는 실행 디렉터리의 `.agents/skills/`를 자동으로 읽습니다.

```bash
git clone https://github.com/devswha/lazyprompt
cd lazyprompt
codex          # 이 레포 안에서 실행하면 $ulw-prompt-builder 가 바로 잡힘
```

### 방법 3 — 개인(전역) 스킬로 복사

```bash
mkdir -p ~/.agents/skills
cp -R .agents/skills/ulw-prompt-builder ~/.agents/skills/
# Codex 재시작 → 어느 레포에서나 $ulw-prompt-builder 사용 가능
```

설치 후 변경이 안 보이면 Codex를 재시작하세요.

## 사용 (Usage)

Codex composer에서 `$`를 눌러 스킬 목록을 열거나, 직접 호출:

```text
$ulw-prompt-builder 결제 모듈 리팩터링 계획을 세우고 싶어
$ulw-prompt-builder turn "add login API to my node backend" into a ulw-loop prompt
```

스킬이 plan/loop를 추천 → 당신이 확인 → 3~5개 질문 → 최적 프롬프트(복붙 명령 + 본문 + 플래그 이유)를 출력합니다. 그 텍스트를 `$ulw-plan` / `$ulw-loop`에 붙여넣으면 됩니다.

## 구조 (Layout)

```
.agents/skills/ulw-prompt-builder/SKILL.md      # 레포-로컬 자동 discovery (방법 2)
.agents/plugins/marketplace.json                # 마켓플레이스 매니페스트 (방법 1)
plugins/ulw-prompt-builder/
├── .codex-plugin/plugin.json                   # Codex 플러그인 매니페스트
└── skills/ulw-prompt-builder/SKILL.md          # 플러그인 동봉 스킬 (방법 1)
```

> 두 `SKILL.md`는 동일 내용입니다(레포 discovery용 + 플러그인 동봉용).

## 비목표 (Non-goals)

- 대상 스킬(`$ulw-plan`/`$ulw-loop`)을 자동 실행하지 않음 — 프롬프트 텍스트만 출력.
- 사용자가 확인하지 않은 성공기준·제약을 날조하지 않음.
- 카탈로그에 없는 `$skill`을 날조하지 않음.
- OmO `$`-스킬 카탈로그 자동 동기화는 범위 밖(2026-06 snapshot 기준, 수동 갱신).

## 라이선스

MIT
