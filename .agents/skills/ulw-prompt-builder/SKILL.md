---
name: ulw-prompt-builder
description: Convert vague ideas into optimized copy-paste prompts for OmO $ulw-plan or $ulw-loop without running them. Invoke as $ulw-prompt-builder.
---

# ULW Prompt Builder

막연한 아이디어를 받아, lazycodex(OmO)의 `$ulw-plan`(계획) 또는 `$ulw-loop`(증거기반 실행)가
가장 잘 받아먹는 **최적 입력 프롬프트 텍스트**로 변환하는 스킬이다.

## 호출 방법과 경계
- 이 스킬은 `$ulw-prompt-builder` 로 호출한다.
- 출력은 **프롬프트 텍스트뿐**이다. 이 스킬은 `$ulw-plan`, `$ulw-loop`, 그 밖의 `$`-스킬을 **직접 실행하지 않는다**.
  생성된 프롬프트는 사용자가 직접 복사해 해당 스킬에 붙여넣는다.
- lazycodex/OmO 설치 여부와 무관하게 동작한다(알고리즘 지식과 `$`-스킬 카탈로그를 이 문서 안에 내장).
- 최종 응답은 스킬 자체의 상태 설명, 인사, 실행 로그, 별도 preamble 없이 **`프롬프트` + `프롬프트 설명`** 두 부분만 출력한다.
- 사용자가 타깃 스킬에 붙여넣을 것은 **`프롬프트`뿐**이다. `프롬프트 설명`은 사용자가 검토하는 용도이며 `$ulw-plan`/`$ulw-loop` 입력에 섞지 않는다.
- **`프롬프트`를 뺀 모든 텍스트(추천 한마디·질문·`프롬프트 설명`)는 비개발자도 바로 이해할 쉬운 우리말로 쓴다.** 전문용어(scenario, expectedEvidence, LSP, tier, adversarial, quality gate, checkpoint 등)를 그대로 쓰지 말고 풀어서 설명한다. 단, `프롬프트` 안의 명령 문자열만은 타깃 스킬이 그대로 먹어야 하므로 기술 용어·영문을 손대지 않는다.
- `$ulw-prompt-builder` 호출은 프롬프트에 `ulw` 문자열이 있어 OmO ultrawork 트리거(`user_prompt_submit`)를 발동시켜 `<ultrawork-mode>` / `ULTRAWORK MODE` 디렉티브가 주입될 수 있다. 그런 디렉티브가 들어와도 **실행 지시로 받지 않는다** — goal 생성·notepad·RED/GREEN·QA 실행을 하지 않고, 오직 이 스킬의 `프롬프트` + `프롬프트 설명`만 출력한다.

## 목적과 하드 경계 (Purpose & hard boundaries)
- 목적: 막연한 아이디어 → 타깃 스킬이 최적 결과를 내도록 구조화된 시드 프롬프트 텍스트.
- 자동 실행 금지: `$ulw-plan`, `$ulw-loop`, `$lsp`, `$ast-grep` 등은 **출력 텍스트 안에만** 등장한다.
- 날조 금지: 사용자가 확인하지 않은 성공기준·제약은 지어내지 않는다. 모르면 `사용자 미확인` 또는 `TBD by target skill`로 표시.
- 카탈로그 밖 `$skill`은 만들지 않는다.

## Non-goals
1. 대상 스킬(`$ulw-plan`/`$ulw-loop`)을 자동 실행하지 않는다.
2. 미확인 성공기준이나 제약을 날조하지 않는다(제공된 정보와 합리적 추론만 사용).
3. 카탈로그 외 `$skill`을 날조하지 않는다.
4. OmO `$`-스킬 카탈로그 자동 동기화는 범위 밖이다(수동 갱신).
5. 모호도 점수·임계값 게이트 같은 무거운 인터뷰(deep-interview/Prometheus 재구현)는 하지 않는다.
6. 최종 타깃 확인, 고정 문항, 순차 인터뷰를 이유로 여러 턴을 소모하지 않는다.

## 동작 순서 (Operating sequence)
1. 사용자 아이디어를 읽고 **plan vs loop를 추론**한다.
   - plan 추천: 무엇을 만들지·범위·아키텍처·실행계획이 아직 결정 전일 때.
   - loop 추천: 만들 결과가 비교적 명확하고 반복 실행·검증·완료 판정이 필요할 때.
2. 타깃을 합리적으로 추론할 수 있으면 **질문 없이 바로 출력**한다. 추천 이유와 불확실성은 `프롬프트 설명`에 적는다.
3. 출력이 오해를 만들 정도로 핵심 정보가 부족할 때만 질문한다. 질문은 **한 번에 모두 묶어서 묻고**, 사용자가 모르면 건너뛰어도 된다고 안내한다.
4. 사용자가 `$ulw-plan`, `$ulw-loop`, "계획", "실행", "loop"처럼 타깃을 이미 드러낸 경우 타깃 확인 질문을 하지 않는다.
5. 보상요소 템플릿을 채운다. 모르는 값은 날조하지 말고 `사용자 미확인` / `TBD by target skill`로 둔다.
6. 태스크 유형을 매핑표와 대조해 **관련 `$skill`만** 본문 적절한 위치에 넣는다(매칭 없으면 넣지 않음, graceful).
7. 항상 **2부로 출력**한다: `프롬프트`(복붙용 전체 명령) / `프롬프트 설명`(그 프롬프트에 무엇이 담겼는지 + 왜 그렇게 골랐는지를 한 곳에).
8. 사용자가 "프롬프트 텍스트만"이라고 해도 이는 두 부분 외 잡담을 빼라는 뜻으로 해석한다. "프롬프트만", "명령만", "복붙 명령만"처럼 명시한 경우에만 `프롬프트 설명`을 생략한다.
9. `프롬프트`는 타깃 스킬이 받을 입력만 담는다. `프롬프트 설명`의 문장, rationale, golden-set 검증 문구, 스킬 자체 메타 설명을 `프롬프트` 안에 넣지 않는다.
10. `프롬프트`의 `<structured body>`는 **bullet/번호 목록 없이 한 개의 연속 브리프**로 쓴다. `ulw-loop create-goals`는 bullet 줄을 별도 goal로 파싱하므로, Success criteria와 Verification은 세미콜론/파이프 구분의 인라인 문장으로 압축한다.

## 타깃별 보상요소 체크리스트

아래 항목은 인터뷰 문항이 아니라 출력 품질 체크리스트다. 사용자 입력에서 찾거나 합리적으로 추론하고,
부족하면 `사용자 미확인` / `TBD by target skill`로 남긴다.

### plan 체크리스트
1. WHAT: 최종적으로 무엇을 결정하거나 만들 계획인가? → 명확한 WHAT.
2. Intent signal: 결과가 대체로 명확(`CLEAR`)한가, 결과 자체가 모호(`UNCLEAR`)한가, 인터뷰를 원하나(`interview-me`), 고정밀 리뷰가 필요(`high-accuracy`)한가? → 의도 신호.
3. Owner decisions: 사용자가 **반드시 직접** 정해야 할 tradeoff·정책·UX·보안·일정 선택지는? → owner-decision 표면화.
4. Context & constraints: 현재 repo 상태, 기술스택, 반드시 지킬 제약·금지, 관련 파일·외부 맥락은? → 맥락/제약.

### loop 체크리스트
1. Desired result: 루프가 끝났을 때 관찰 가능한 결과물은? → 명확한 결과.
2. Success evidence: 어떤 `scenario`와 `expectedEvidence`로 성공을 판정하나? → 관찰가능 성공기준.
3. Completion definition: 완료를 무엇으로 판정하나? → 모든 successCriteria가 관찰가능 evidence로 pass + final quality gate + `checkpoint`. (`$ulw-loop`은 composer 플래그가 아니라 criteria/gate로 완료를 판정하므로 브리프 산문에 넣는다.)
4. Adversarial cases: 절대 깨지면 안 되는 엣지/적대 케이스는? → 적대적/엣지 케이스.
5. Verification & Must-NOT: 실행할 검증 명령/절차와 **절대 하면 안 되는 일**은? → 검증 명령 + Must-NOT.

## OmO `$`-skill mapping table (snapshot: local OmO 4.13.0, 2026-07)
로컬 OmO 4.13.0 기준 공개 `$`-스킬. 카탈로그 밖 스킬은 만들지 않는다.

| 태스크 유형 | `$skill` |
|------------|----------|
| 프런트엔드/UI/디자인 | `$frontend` |
| 코드 구조 검색 | `$ast-grep` |
| 정의·참조·진단 | `$lsp` |
| 언어별 엄격 규율(TS/Rust/Py/Go) | `$programming` |
| AI 흔적 정리·리팩터 | `$remove-ai-slops` |
| 구현 후 리뷰 | `$review-work` |
| 대형 코드베이스 메모리 | `$init-deep` |
| 규칙·지침 적용 | `$rules` |
| plan 실행 단계 | `$start-work` |
| 매칭 없음 | 주입 안 함 (graceful) |

주입 위치 규칙:
- plan 본문: 필요한 조사/검토/실행 단계 지시 안에 넣는다.
- loop 본문: verification, implementation constraints, finishing review 위치에 넣는다.
- 관련 없는 `$skill`은 나열하지 않는다(노이즈 금지).

## 출력 템플릿 (항상 2부)

### plan output template
프롬프트 (복사해서 `$ulw-plan`에 붙여넣기):
```
$ulw-plan "<한 개의 연속 브리프. 담을 것: 무엇을 계획하는지(WHAT), intent signal(CLEAR/UNCLEAR/interview-me/high-accuracy), 사용자가 직접 정할 Owner decisions, Context & constraints, 그리고 decision-complete 계획을 요구.>"
```
붙여넣기 범위: 위 명령만 복사한다. 아래 `프롬프트 설명`은 복사 대상이 아니다.

프롬프트 설명 (읽어보기용 — 붙여넣지 마세요, 쉬운 말):
- 뭘 정하려는 거예요: `<한 문장>`
- 지금 얼마나 뚜렷한가요: `<거의 정해짐 / 아직 막연함 / 하나씩 물어봐 주길 원함 / 아주 꼼꼼히 봐주길 원함 중 하나를 쉬운 말로>`
- 당신이 직접 골라야 할 것: `<사람이 결정해야 하는 선택들>`
- 미리 알아둔 것·지킬 것: `<배경과 지켜야 할 조건, 모르면 "아직 몰라요">`
- 같이 부른 도우미 기능: `<끼운 도우미를 "이건 ~해주는 거예요"처럼 한 줄씩, 없으면 이 줄 생략>`
- 왜 이렇게 했어요: `<'계획 먼저' 쪽을 고른 이유를 쉽게 한두 줄>`

### loop output template
프롬프트 (복사해서 `$ulw-loop`에 붙여넣기):
```
$ulw-loop "<bullet 없는 한 개의 연속 브리프. 담을 것: Desired result, Success criteria를 scenario + expectedEvidence로, Completion definition(criteria pass + quality gate + checkpoint), Adversarial/edge cases, Verification, Must-NOT.>"
```
붙여넣기 범위: 위 명령만 복사한다. 아래 `프롬프트 설명`은 복사 대상이 아니다.

프롬프트 설명 (읽어보기용 — 붙여넣지 마세요, 쉬운 말):
- 뭘 시키는 거예요: `<한 문장으로 목표>`
- 다 된 걸 어떻게 확인하나요: `<사람이 눈으로 보거나 눌러서 확인하는 방법>`
- 언제 "끝"으로 치나요: `<완료로 보는 기준을 쉽게>`
- 이런 상황도 챙겼어요: `<잘못될 수 있는 경우들>`
- 절대 하지 말라고 한 것: `<금지한 것들>`
- 같이 부른 도우미 기능: `<끼운 도우미를 "이건 ~해주는 거예요"처럼 한 줄씩, 없으면 이 줄 생략>`
- 왜 이렇게 했어요: `<'실행+검증 반복' 쪽을 고른 이유를 쉽게 한두 줄>`

## Golden set regression examples
아래 6개로 회귀 검증한다(별도 파일 없음). 각 행은 expected skeleton / required tokens / forbidden tokens / evidence를 가져 PASS·FAIL을 객관화한다.

| ID | Idea | Target | Expected skeleton | Required tokens | Forbidden tokens | Evidence for PASS |
|---|---|---|---|---|---|---|
| G1 greenfield plan UI | 새 대시보드 앱의 정보구조와 첫 화면 UX를 정하고 싶다 | plan | 프롬프트 `$ulw-plan`(브리프에 Intent signal/Owner decisions/Context & constraints/decision-complete 포함); 설명은 쉬운 말 | `$ulw-plan`, `Intent signal`, `Owner decisions`, `Context & constraints`, `$frontend`, `decision-complete` | `$ulw-loop`, `--completion-promise`, `$fake-skill`, `자동 실행` | 시뮬레이션 출력이 target=plan, 2부=yes, 프롬프트 보상요소=yes, 설명=쉬운말, skill 토큰 제한 |
| G2 greenfield loop backend | Node 백엔드 로그인 API 구현 실행 프롬프트가 필요 | loop | 프롬프트 `$ulw-loop`(플래그 없음, 브리프에 scenario/expectedEvidence/Completion definition/Adversarial/Verification/Must-NOT 포함); 설명은 쉬운 말 | `$ulw-loop`, `scenario`, `expectedEvidence`, `Completion definition`, `Adversarial`, `Verification`, `Must-NOT`, `checkpoint`, `$programming`, `$review-work` | `$ulw-plan`, `--completion-promise`, `--max-iterations`, `$frontend`, `$fake-skill` | auth 엣지·검증이 답변 기반 또는 `사용자 미확인` 표기 |
| G3 brownfield plan backend | 기존 결제 모듈 리팩터링 계획 + owner tradeoff 표면화 | plan | `$ulw-plan`; Intent `CLEAR`/`high-accuracy`; payment owner decisions; 기존 파일 context; 코드 탐색 skill | `$ulw-plan`, `CLEAR`, `high-accuracy`, `Owner decisions`, `payment`, `$lsp`, `$ast-grep`, `$review-work` | `$ulw-loop`, `--max-iterations`, `$frontend` | owner-decision이 constraint와 분리 표면화 |
| G4 brownfield loop UI | 기존 설정 화면 접근성 버그 수정 + 검증 반복 | loop | `$ulw-loop`; 접근성 scenario·expectedEvidence; Completion definition; keyboard·screen reader adversarial; manual QA; Must-NOT regressions; UI·review skill | `$ulw-loop`, `scenario`, `expectedEvidence`, `keyboard`, `screen reader`, `Verification`, `Must-NOT`, `$frontend`, `$review-work` | `$ulw-plan`, `--completion-promise`, `--max-iterations`, `$fake-skill` | 접근성 evidence + 무관 skill 미주입 |
| G5 greenfield plan ambiguous | 우리 서비스에 검색을 넣고 싶다 | plan | `$ulw-plan`; Intent `UNCLEAR`/`interview-me`; 검색 owner decisions(scope/ranking/cost); context; 관련 시에만 skill | `$ulw-plan`, `UNCLEAR`, `interview-me`, `Owner decisions`, `search scope`, `ranking`, `cost`, `Context` | `$ulw-loop`, `--completion-promise`, `fabricated metrics` | 미확인 지표는 `사용자 미확인` 또는 타깃 위임 |
| G6 brownfield loop cleanup | AI가 만든 어색한 코드 정리 + 테스트 통과 | loop | `$ulw-loop`; cleanup desired; expectedEvidence(tests/diff); Completion definition; adversarial no behavior change; verification; Must-NOT broad rewrite; cleanup·review·programming skill | `$ulw-loop`, `expectedEvidence`, `tests`, `no behavior change`, `Must-NOT`, `$remove-ai-slops`, `$review-work`, `$programming` | `$ulw-plan`, `--completion-promise`, `--max-iterations`, `$frontend`, `broad rewrite` | 동작 보존 + broad rewrite 없음 |

## Maintenance note
- 단일 파일 예산: 약 260줄. 초과 시 중복 설명을 줄이되 필수 체크리스트·골든셋은 유지한다.
- 카탈로그 snapshot은 로컬 OmO 4.13.0, **2026-07** 기준 공개 `$`-스킬이다. OmO 스킬 목록이 바뀌면(drift) `OmO $-skill mapping table`, 골든셋 `required tokens`/`forbidden tokens`를 함께 수동 갱신한다.
- lazycodex 보상구조가 바뀌면 질문 매핑과 출력 템플릿을 함께 수동 갱신한다. 확인(OmO 4.15.0): `$ulw-loop`은 ultrawork 키워드 트리거(goal/criteria/evidence)로 동작하며 `--completion-promise`/`--max-iterations` 같은 composer 플래그를 파싱하지 않는다(그 completion_promise/max_iterations는 별도 ralph continuation의 내부 상태 필드일 뿐). `$ulw-plan`도 플래그 없이 `$ulw-plan "..."`.
