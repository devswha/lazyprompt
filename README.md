<div align="center">

<img src="assets/mascot.png" width="200" alt="lazyprompt mascot" />

# lazyprompt

**막연한 아이디어를 [lazycodex / OmO](https://github.com/code-yeongyu/lazycodex)의 `$ulw-plan`·`$ulw-loop`가 가장 잘 먹는 최적 프롬프트로 바꿔주는 Codex 스킬**

_Turn a vague idea into the optimal copy-paste prompt for `$ulw-plan` / `$ulw-loop`._
_Outputs prompt text only — it never auto-runs the target skill._

[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Codex](https://img.shields.io/badge/Codex-skill%20%2B%20plugin-7C3AED?style=flat-square)](https://developers.openai.com/codex/skills)
[![invoke](https://img.shields.io/badge/invoke-%24lazyprompt-111827?style=flat-square)](#2-사용법)

</div>

---

## 1. 설치

Codex에 아래 한 줄 붙여넣고 설치하면 끝:

```bash
codex plugin marketplace add devswha/lazyprompt
```

> GUI면 `/plugins` → **Add Marketplace** → `https://github.com/devswha/lazyprompt` 붙여넣고 `lazyprompt` 설치. 안 보이면 Codex 재시작.

## 2. 사용법

Codex 입력창에 `$lazyprompt` 뒤에 **하고 싶은 걸 평소 말로 한 줄** 적으면 됩니다.

```text
$lazyprompt 내 쇼핑몰에 상품 후기(별점+사진) 넣고 실제로 올라가는지 확인하는 프롬프트 만들어줘
```
```text
$lazyprompt 우리 서비스에 검색 기능 넣고 싶어
```

- 뭘 만들지 뚜렷하면 → **실행+검증(`$ulw-loop`)**, 아직 막연하면 → **계획(`$ulw-plan`)** 프롬프트로 알아서 골라줍니다.
- 모르는 값은 지어내지 않고 `사용자 미확인`으로 남깁니다.
- 꼼꼼히 정하고 싶으면 **딥 인터뷰 옵션**: `$lazyprompt --deep <아이디어>` (또는 `--interview`, "인터뷰해줘"). 가장 약한 부분을 하나씩 물어 막연도를 점수로 낮춘 뒤 프롬프트를 만듭니다. 옵션이 없으면 지금처럼 바로 만들어 줍니다.

## 3. 스킬 쓰면 나오는 것

두 부분이 나옵니다 — **`프롬프트`(복사해서 붙여넣을 것)** 와 **`프롬프트 설명`(그냥 읽어보는 쉬운 말)**.

```text
프롬프트 (복사해서 $ulw-loop에 붙여넣기)
$ulw-loop "<하고 싶은 일 + 다 됐는지 확인법 + 조심할 점 + 하지 말 것을 담은 한 덩어리 문장>"

프롬프트 설명 (읽어보기용 — 붙여넣지 마세요, 쉬운 말)
- 뭘 시키는지 / 다 된 걸 어떻게 확인하는지
- 언제 "끝"으로 치는지 / 조심할 상황 / 절대 하지 말 것
- 같이 부른 도우미 기능 (하나씩 왜 쓰는지)
- 왜 이 방식(계획/실행)을 골랐는지
```

`프롬프트`만 복사해서 `$ulw-loop`(또는 `$ulw-plan`)에 붙여넣으면 끝. `프롬프트 설명`은 안 붙여도 됩니다.

**끼워 넣는 도우미 기능(`$`-스킬)과 왜 쓰는지** — 작업에 맞는 것만 자동으로 넣습니다(맞는 게 없으면 안 넣음):

| 도우미 | 왜 쓰나 |
| --- | --- |
| `$frontend` | 화면·버튼을 만들고 보기 좋게 |
| `$ast-grep` | 코드 구조로 찾기·한꺼번에 고치기 |
| `$lsp` | 정의·참조 찾고, 바꾼 코드의 오류 확인 |
| `$programming` | 언어별로 엄격하게 구현 |
| `$remove-ai-slops` | AI가 만든 어색한 코드 정리 |
| `$review-work` | 끝내기 전에 한 번 더 검토 |
| `$init-deep` | 큰 코드베이스 파악·기억 |
| `$rules` | 프로젝트 규칙 지키기 |
| `$start-work` | 세운 계획을 실제 작업으로 시작 |

---

<details>
<summary><b>자세히 (왜 쓰나 · 무엇이 채워지나 · 파일 구조 · 안 하는 것 · 다른 설치법)</b></summary>

### 왜 쓰나

`ulw-plan`/`ulw-loop`은 **어떻게 부탁하느냐**에 따라 결과가 크게 달라집니다. 이 스킬은 좋은 결과가 나오도록 그 부탁 문장을 대신 꼼꼼히 써 줍니다 — 당신은 하고 싶은 걸 한 줄로 던지기만 하면 됩니다. 정말 필요한 정보가 비어 있을 때만 한 번에 묶어서 묻습니다.

### 무엇이 채워지나

| 타깃 | 프롬프트에 자동으로 담기는 것 |
| --- | --- |
| `$ulw-loop` (실행+검증 반복) | 뭘 만들지 · 다 됐는지 확인하는 법 · 언제 "끝"인지 · 조심할 상황 · 확인 방법 · 절대 하지 말 것 |
| `$ulw-plan` (계획 먼저) | 지금 얼마나 뚜렷한지 · 당신이 직접 정할 것 · 알아둔 배경과 지킬 조건 |

> 왜 `프롬프트`가 한 덩어리 문장인가요? `ulw-loop`은 줄 단위 목록을 별도 작업으로 쪼개서 읽기 때문에, 한 덩어리로 유지해야 내용은 풍부하게 전달되면서 작업이 과하게 쪼개지지 않습니다.

### 딥 인터뷰 옵션 (GJC deep-interview 이식)

막연한 아이디어를 **한 번에 하나씩** 물어 명료도를 점수로 끌어올린 뒤 프롬프트를 만드는 선택 모드. 기본값은 그대로 한 방 출력이고, 아래처럼 켤 때만 동작합니다.

```bash
$lazyprompt --deep 우리 서비스에 검색 기능 넣고 싶어   # 또는 --interview / --quick / --standard
```

- **깊이별 막연도 임계값**(이 값 이하로 내려가면 인터뷰 종료): `--quick` 0.60 · `--standard` 0.50 · `--deep` 0.35.
- **가중 채점**: greenfield는 `1 - (목표0.40 + 제약0.30 + 성공기준0.30)`, brownfield는 `1 - (목표0.35 + 제약0.25 + 성공기준0.25 + 기존이해0.15)`. 답변이 앞말을 뒤집거나 범위를 늘리면 점수는 **다시 올라갈 수도** 있습니다(양방향).
- 시작 전 **최상위 구성요소(1~6개)**를 한 번 확인하고, 매 라운드 **가장 약한 부분**만 골라 이유와 함께 묻습니다. 사실(스택·기존 코드)은 저장소를 먼저 뒤져 근거로 확인하고, 결정만 사용자에게 묻습니다.
- 결과물은 여전히 `프롬프트` + `프롬프트 설명` 2부뿐 — 타깃 스킬을 대신 실행하지 않습니다.
- **oh-my-codex 심화**: 근거에 출처 라벨(`[from-code]`/`[from-user]` 등)을 붙여 사실과 결정을 안 섞고, 범위가 커지면 Simplifier·핵심이 흔들리면 Ontologist 질문을 넣고, 마무리 전 앞 답변을 한 번 더 눌러봅니다(비목표가 정해지기 전엔 완료로 안 침).

### 프롬프트 품질 하드닝 (oh-my-codex 참고)

생성되는 프롬프트에 `$ulw-plan`/`$ulw-loop`이 실제로 보상하는 구조를 더 두껍게 담습니다(관련될 때만).

- **위험 티어**: 인증·보안·마이그레이션·파괴적 작업·개인정보·공개 API 파괴 같은 고위험이면 계획에 **사전부검(실패 시나리오 3개)**과 unit/integration/e2e/observability 테스트 계획을 붙입니다.
- **계획(plan)**: 테스트 가능한 성공기준 · 파일 참조 · 수치 지표("빠르게"→"p99 < 200ms") · 원칙/결정 동인/후보안(RALPLAN-DR)과 결정 기록(ADR).
- **실행(loop)**: 작업 크기에 따라 성공기준 개수를 정하고(LIGHT 1~2 / HEAVY 3+), 각 기준을 `scenario`+`expectedEvidence`+실제 확인 채널로. **빌드·테스트 통과는 필요조건일 뿐**이라 실제 화면·요청 같은 눈에 보이는 증거와 정리(cleanup)까지 요구합니다.

### 파일 구조

```text
package.json                                        # 버전 단일 소스 + npm scripts
CHANGELOG.md                                        # 변경 이력 (Keep a Changelog + SemVer)
scripts/sync-version.mjs                            # 버전 동기화·정합성 검사 도구
test/                                               # 스킬 계약 + 버전 정합성 테스트
.agents/skills/lazyprompt/SKILL.md                  # 레포에서 바로 인식되는 스킬
.agents/plugins/marketplace.json                    # 마켓플레이스 매니페스트
plugins/lazyprompt/
├── .codex-plugin/plugin.json                       # Codex 플러그인 매니페스트 (버전 동기화 대상)
└── skills/lazyprompt/SKILL.md                      # 플러그인에 동봉된 스킬
```

### 버전 관리 (Versioning)

버전 단일 소스는 `package.json`이며, [SemVer](https://semver.org/lang/ko/)와 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따른다. `plugin.json`의 버전은 여기서 자동으로 맞춰진다.

```bash
npm test                 # 스킬 계약 + 버전 정합성 테스트
npm run version:check    # package.json ↔ plugin.json 버전 어긋남 검사
npm version patch        # 1.0.0 → 1.0.1: 테스트 → CHANGELOG 스탬프 → plugin.json 동기화 → 커밋 + 태그
git push --follow-tags   # 커밋과 v* 태그를 함께 푸시
```

- `npm version <patch|minor|major>`가 `package.json` 버전을 올리면, `version` 훅이 `plugin.json` 버전(`x.y.z+codex.<빌드시각>`)과 `CHANGELOG.md`의 `[Unreleased]` 항목을 자동으로 스탬프한 뒤 함께 커밋·태그한다.
- `plugin.json` 버전은 손으로 고치지 말 것 — `npm run version:sync`로 맞춘다. 어긋나면 `npm test`가 실패한다.
- 릴리스 전 바뀐 내용은 `CHANGELOG.md`의 `## [Unreleased]` 아래에 먼저 적어 둔다.

### 안 하는 것 (Non-goals)

- 대상 스킬을 대신 실행하지 않음 — 프롬프트 텍스트만 만들어 줌.
- 확인 안 된 성공기준·제약을 지어내지 않음.
- 없는 `$`-스킬을 지어내지 않음.
- 도우미 스킬 목록 자동 동기화는 안 함 (OmO 공개 `$`-스킬 2026-07 기준, 수동 갱신).

### 다른 설치법

```bash
# 클론해서 그 안에서 Codex 실행 (설치 0단계)
git clone https://github.com/devswha/lazyprompt
cd lazyprompt
codex   # .agents/skills/ 자동 인식 → $lazyprompt 바로 사용
```
```bash
# 개인 전역 스킬로 복사 — 어느 레포에서나 사용
cp -R .agents/skills/lazyprompt ~/.agents/skills/
```

</details>

## License

[MIT](LICENSE)
