<div align="center">

<img src="assets/mascot.png" width="200" alt="lazyprompt mascot" />

# lazyprompt

**막연한 아이디어를 [lazycodex / OmO](https://github.com/code-yeongyu/lazycodex)의 `$ulw-plan`·`$ulw-loop`가 가장 잘 먹는 최적 프롬프트로 바꿔주는 Codex 스킬**

_Turn a vague idea into the optimal copy-paste prompt for `$ulw-plan` / `$ulw-loop`._
_Outputs prompt text only — it never auto-runs the target skill._

[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Codex](https://img.shields.io/badge/Codex-skill%20%2B%20plugin-7C3AED?style=flat-square)](https://developers.openai.com/codex/skills)
[![invoke](https://img.shields.io/badge/invoke-%24ulw--prompt--builder-111827?style=flat-square)](#2-사용법)

</div>

---

## 1. 설치

Codex에 아래 한 줄 붙여넣고 설치하면 끝:

```bash
codex plugin marketplace add devswha/lazyprompt
```

> GUI면 `/plugins` → **Add Marketplace** → `https://github.com/devswha/lazyprompt` 붙여넣고 `ulw-prompt-builder` 설치. 안 보이면 Codex 재시작.

## 2. 사용법

Codex 입력창에 `$ulw-prompt-builder` 뒤에 **하고 싶은 걸 평소 말로 한 줄** 적으면 됩니다.

```text
$ulw-prompt-builder 내 쇼핑몰에 상품 후기(별점+사진) 넣고 실제로 올라가는지 확인하는 프롬프트 만들어줘
```
```text
$ulw-prompt-builder 우리 서비스에 검색 기능 넣고 싶어
```

- 뭘 만들지 뚜렷하면 → **실행+검증(`$ulw-loop`)**, 아직 막연하면 → **계획(`$ulw-plan`)** 프롬프트로 알아서 골라줍니다.
- 모르는 값은 지어내지 않고 `사용자 미확인`으로 남깁니다.

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

### 파일 구조

```text
.agents/skills/ulw-prompt-builder/SKILL.md          # 레포에서 바로 인식되는 스킬
.agents/plugins/marketplace.json                    # 마켓플레이스 매니페스트
plugins/ulw-prompt-builder/
├── .codex-plugin/plugin.json                       # Codex 플러그인 매니페스트
└── skills/ulw-prompt-builder/SKILL.md              # 플러그인에 동봉된 스킬
```

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
codex   # .agents/skills/ 자동 인식 → $ulw-prompt-builder 바로 사용
```
```bash
# 개인 전역 스킬로 복사 — 어느 레포에서나 사용
cp -R .agents/skills/ulw-prompt-builder ~/.agents/skills/
```

</details>

## License

[MIT](LICENSE)
