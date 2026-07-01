<div align="center">

<img src="assets/mascot.png" width="200" alt="lazyprompt mascot" />

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

스킬이 `plan` vs `loop`를 추론하고, 충분하면 바로 그대로 복붙할 수 있는 `프롬프트` + `프롬프트 설명`을 뱉습니다.
정말 필요한 정보가 비어 있을 때만 한 번에 묶어 묻습니다.

---

## 왜 쓰나 (Why)

`ulw-plan`/`ulw-loop`은 **어떻게 부탁하느냐**에 따라 결과가 크게 달라집니다. 이 스킬은 좋은 결과가 나오도록 그 부탁 문장을 대신 꼼꼼히 써 줍니다 — 당신은 하고 싶은 걸 한 줄로 던지기만 하면 됩니다.

## 동작 (How)

1. **타깃 추론** — 아이디어가 `ulw-plan`(계획)용인지 `ulw-loop`(실행)용인지 추론.
2. **바로 출력 우선** — 충분하면 질문 없이 생성하고, 부족할 때만 필요한 항목을 한 번에 질문.
3. **2부 출력** — `프롬프트`(복붙용 명령) + `프롬프트 설명`(무엇이 담겼는지 + 왜 그렇게 골랐는지).
4. **안전한 복붙 경계** — 실제 `$ulw-plan`/`$ulw-loop`에 붙여넣을 것은 `프롬프트`뿐입니다.

## 무엇이 채워지나 (Reward structure)

| 타깃 | 프롬프트에 자동으로 담기는 것 |
| --- | --- |
| `$ulw-loop` (실행+검증 반복) | 뭘 만들지 · 다 됐는지 확인하는 법 · 언제 "끝"인지 · 조심할 상황 · 확인 방법 · 절대 하지 말 것 |
| `$ulw-plan` (계획 먼저) | 지금 얼마나 뚜렷한지 · 당신이 직접 정할 것 · 알아둔 배경과 지킬 조건 |

작업에 맞는 OmO 도우미 기능(`$`-스킬)도 알아서 골라 끼워 줍니다 — 예: 코드 찾기(`$lsp`/`$ast-grep`), 화면 만들기(`$frontend`), 마무리 점검(`$review-work`/`$remove-ai-slops`). 맞는 게 없으면 넣지 않습니다.

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
프롬프트 (복붙용 명령)
$ulw-loop "<bullet/번호 목록 없는 한 개의 연속 브리프>"

프롬프트 설명 (읽어보기용 — 붙여넣지 마세요, 쉬운 말)
- 뭘 시키는지 / 다 된 걸 어떻게 확인하는지
- 언제 "끝"으로 치는지 / 조심할 상황 / 절대 하지 말 것
- 같이 부른 도우미 기능: $programming(엄격한 구현), $review-work(끝나기 전 점검)
- 왜 '실행+검증 반복'을 골랐는지
```

`프롬프트`만 복사해 `$ulw-loop`(또는 `$ulw-plan`)에 붙여넣으면 끝. `프롬프트 설명`은 검토용입니다.

> 왜 `프롬프트`가 bullet 없는 연속 브리프인가요? `ulw-loop create-goals`는 bullet/번호 줄을 별도 goal 후보로 파싱합니다. `프롬프트`를 한 개의 연속 브리프로 유지하면 성공기준과 검증 절차는 풍부하게 전달하면서도 goal 과분할을 피할 수 있습니다.

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
