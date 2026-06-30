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

## 목적과 하드 경계 (Purpose & hard boundaries)
- 목적: 막연한 아이디어 → 타깃 스킬이 최적 결과를 내도록 구조화된 시드 프롬프트 텍스트.
- 자동 실행 금지: `$ulw-plan`, `$ulw-loop`, `$LSP`, `$AST-grep` 등은 **출력 텍스트 안에만** 등장한다.
- 날조 금지: 사용자가 확인하지 않은 성공기준·제약은 지어내지 않는다. 모르면 `사용자 미확인` 또는 `TBD by target skill`로 표시.
- 카탈로그 밖 `$skill`은 만들지 않는다.

## Non-goals
1. 대상 스킬(`$ulw-plan`/`$ulw-loop`)을 자동 실행하지 않는다.
2. 미확인 성공기준이나 제약을 날조하지 않는다(질문 답변 기반만 사용).
3. 카탈로그 외 `$skill`을 날조하지 않는다.
4. OmO `$`-스킬 카탈로그 자동 동기화는 범위 밖이다(수동 갱신).
5. 모호도 점수·임계값 게이트 같은 무거운 인터뷰(deep-interview/Prometheus 재구현)는 하지 않는다.

## 동작 순서 (Operating sequence)
1. 사용자 아이디어를 읽고 **plan vs loop를 추천**한다.
   - plan 추천: 무엇을 만들지·범위·아키텍처·실행계획이 아직 결정 전일 때.
   - loop 추천: 만들 결과가 비교적 명확하고 반복 실행·검증·완료 판정이 필요할 때.
2. 추천 이유를 **한 문장**으로 제시하고, 사용자에게 **최종 타깃을 확인**받는다. 확인 전에는 프롬프트를 생성하지 않는다.
3. 확정된 타깃의 **고정 질문**을 묻는다(plan 4개 / loop 5개). 한 번에 하나씩.
4. 답변을 보상요소 템플릿에 채운다. 모르는 값은 날조하지 말고 `사용자 미확인` / `TBD by target skill`로 둔다.
5. 태스크 유형을 매핑표와 대조해 **관련 `$skill`만** 본문 적절한 위치에 넣는다(매칭 없으면 넣지 않음, graceful).
6. 항상 **3부로 출력**한다: Part A 복붙용 전체 명령 / Part B 구조화 본문 / Part C 플래그 선택 이유.

## 타깃별 질문과 보상요소 매핑 (질문 ↔ 보상요소 1:1)

### plan 질문 4개
1. WHAT: 최종적으로 무엇을 결정하거나 만들 계획인가? → 명확한 WHAT.
2. Intent signal: 결과가 대체로 명확(`CLEAR`)한가, 결과 자체가 모호(`UNCLEAR`)한가, 인터뷰를 원하나(`interview-me`), 고정밀 리뷰가 필요(`high-accuracy`)한가? → 의도 신호.
3. Owner decisions: 사용자가 **반드시 직접** 정해야 할 tradeoff·정책·UX·보안·일정 선택지는? → owner-decision 표면화.
4. Context & constraints: 현재 repo 상태, 기술스택, 반드시 지킬 제약·금지, 관련 파일·외부 맥락은? → 맥락/제약.

### loop 질문 5개
1. Desired result: 루프가 끝났을 때 관찰 가능한 결과물은? → 명확한 결과.
2. Success evidence: 어떤 `scenario`와 `expectedEvidence`로 성공을 판정하나? → 관찰가능 성공기준.
3. Completion promise: 완료 시 정확히 어떤 문자열/XML promise를 출력하게 하나? → completion promise(완료 약속).
4. Adversarial cases: 절대 깨지면 안 되는 엣지/적대 케이스는? → 적대적/엣지 케이스.
5. Verification & Must-NOT: 실행할 검증 명령/절차와 **절대 하면 안 되는 일**은? → 검증 명령 + Must-NOT.

## OmO `$`-skill mapping table (snapshot: 2026-06)
2026-06 기준 OmO 공개 `$`-스킬. 카탈로그 밖 스킬은 만들지 않는다.

| 태스크 유형 | `$skill` |
|------------|----------|
| 프런트엔드/UI/디자인 | `$frontend-ui-ux` |
| 코드 구조 검색 | `$AST-grep` |
| 정의·참조·진단 | `$LSP` |
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

## 출력 템플릿 (항상 3부)

### plan output template
Part A — Copy-paste command:
```
$ulw-plan "<structured body>"
```
Part B — Structured body:
- Intent signal: `<CLEAR|UNCLEAR|interview-me|high-accuracy>`
- What to plan: `<WHAT>`
- Owner decisions to surface: `<owner-decision 목록>`
- Context & constraints: `<repo/tech/rules/files/must-not>`
- Optional OmO skill hints: `<관련 $skill만 또는 없음>`
- Expected plan quality: decision-complete, evidence-grounded, pending approval before execution.

Part C — Flag rationale:
- 왜 그 intent signal을 골랐는지.
- 왜 그 `$skill`을 넣었는지/뺐는지.

### loop output template
Part A — Copy-paste command:
```
$ulw-loop "<structured body>" --completion-promise="<promise>" --max-iterations=<N>
```
Part B — Structured body:
- Desired outcome: `<observable result>`
- Success criteria:
  - scenario: `<scenario>`
  - expectedEvidence: `<evidence>`
- Completion promise: `<exact promise>`
- Adversarial / edge cases: `<cases>`
- Verification commands/procedures: `<commands 또는 manual QA>`
- Must-NOT: `<금지 행위>`
- Optional OmO skill hints: `<관련 $skill만 또는 없음>`

Part C — Flag rationale:
- completion promise 선택 이유.
- max-iterations 선택 이유(기본: 작은 작업 10 / 중간 25 / 큰 반복 50, 사용자 요구 시 조정).
- `$skill` 주입/미주입 이유.

## Golden set regression examples
아래 6개로 회귀 검증한다(별도 파일 없음). 각 행은 expected skeleton / required tokens / forbidden tokens / evidence를 가져 PASS·FAIL을 객관화한다.

| ID | Idea | Target | Expected skeleton | Required tokens | Forbidden tokens | Evidence for PASS |
|---|---|---|---|---|---|---|
| G1 greenfield plan UI | 새 대시보드 앱의 정보구조와 첫 화면 UX를 정하고 싶다 | plan | A `$ulw-plan`; B Intent signal/What to plan/Owner decisions/Context & constraints/Optional skill hints; C rationale | `$ulw-plan`, `Intent signal`, `Owner decisions`, `Context & constraints`, `$frontend-ui-ux`, `decision-complete` | `$ulw-loop`, `--completion-promise`, `$fake-skill`, `자동 실행` | 시뮬레이션 출력이 target=plan, 3부=yes, 보상요소=yes, skill 토큰 제한 |
| G2 greenfield loop backend | Node 백엔드 로그인 API 구현 실행 프롬프트가 필요 | loop | A `$ulw-loop` + `--completion-promise` + `--max-iterations`; B Desired/scenario·expectedEvidence/promise/Adversarial/Verification/Must-NOT; C rationale | `$ulw-loop`, `scenario`, `expectedEvidence`, `completion promise`, `Adversarial`, `Verification`, `Must-NOT`, `$programming`, `$review-work` | `$ulw-plan`, `$frontend-ui-ux`, `$fake-skill` | auth 엣지·검증이 답변 기반 또는 `사용자 미확인` 표기 |
| G3 brownfield plan backend | 기존 결제 모듈 리팩터링 계획 + owner tradeoff 표면화 | plan | `$ulw-plan`; Intent `CLEAR`/`high-accuracy`; payment owner decisions; 기존 파일 context; 코드 탐색 skill | `$ulw-plan`, `CLEAR`, `high-accuracy`, `Owner decisions`, `payment`, `$LSP`, `$AST-grep`, `$review-work` | `$ulw-loop`, `--max-iterations`, `$frontend-ui-ux` | owner-decision이 constraint와 분리 표면화 |
| G4 brownfield loop UI | 기존 설정 화면 접근성 버그 수정 + 검증 반복 | loop | `$ulw-loop`; 접근성 scenario·expectedEvidence; promise; keyboard·screen reader adversarial; manual QA; Must-NOT regressions; UI·review skill | `$ulw-loop`, `scenario`, `expectedEvidence`, `keyboard`, `screen reader`, `Verification`, `Must-NOT`, `$frontend-ui-ux`, `$review-work` | `$ulw-plan`, `$fake-skill` | 접근성 evidence + 무관 skill 미주입 |
| G5 greenfield plan ambiguous | 우리 서비스에 검색을 넣고 싶다 | plan | `$ulw-plan`; Intent `UNCLEAR`/`interview-me`; 검색 owner decisions(scope/ranking/cost); context; 관련 시에만 skill | `$ulw-plan`, `UNCLEAR`, `interview-me`, `Owner decisions`, `search scope`, `ranking`, `cost`, `Context` | `$ulw-loop`, `--completion-promise`, `fabricated metrics` | 미확인 지표는 `사용자 미확인` 또는 타깃 위임 |
| G6 brownfield loop cleanup | AI가 만든 어색한 코드 정리 + 테스트 통과 | loop | `$ulw-loop`; cleanup desired; expectedEvidence(tests/diff); promise; adversarial no behavior change; verification; Must-NOT broad rewrite; cleanup·review·programming skill | `$ulw-loop`, `expectedEvidence`, `tests`, `no behavior change`, `Must-NOT`, `$remove-ai-slops`, `$review-work`, `$programming` | `$ulw-plan`, `$frontend-ui-ux`, `broad rewrite` | 동작 보존 + broad rewrite 없음 |

## Maintenance note
- 단일 파일 예산: 약 260줄. 초과 시 중복 설명을 줄이되 필수 체크리스트·골든셋은 유지한다.
- 카탈로그 snapshot은 **2026-06** 기준 OmO 공개 `$`-스킬이다. OmO 스킬 목록이 바뀌면(drift) `OmO $-skill mapping table`, 골든셋 `required tokens`/`forbidden tokens`를 함께 수동 갱신한다.
- lazycodex 보상구조(`$ulw-plan`/`$ulw-loop`의 요소·플래그)가 바뀌면 질문 매핑과 출력 템플릿을 함께 수동 갱신한다.
