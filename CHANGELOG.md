# Changelog

All notable changes to **lazyprompt** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The canonical version lives in [`package.json`](package.json) and is synced into the
Codex plugin manifest ([`plugins/lazyprompt/.codex-plugin/plugin.json`](plugins/lazyprompt/.codex-plugin/plugin.json))
via `npm run version:sync`. See [Versioning](README.md) for the release workflow.

## [Unreleased]

### Changed
- **Auto-triggered deep interview (OmX-style routing).** `$lazyprompt` now gauges
  ambiguity first: clear inputs still produce a one-shot prompt, while vague
  inputs (broad verbs, no concrete anchors, unstable core noun) automatically
  enter a short (`--quick`) deep interview instead of requiring a flag. Always
  skippable with `--direct` or "그냥 만들어"/"바로"/"묻지 말고"; force/deepen with
  `--interview` / `--quick` / `--standard` / `--deep` or interview trigger words.
  Updated the operating-sequence routing gate, deep-interview trigger section,
  README, and the contract test.
- **Clarified the ulw delegation boundary.** Made explicit that deep planning,
  iterative execution, verification, completion judgement, and state are
  delegated to the target `$ulw-plan`/`$ulw-loop` (ulw); lazyprompt interviews
  only enough to seed a strong ulw prompt and does not duplicate `$ulw-plan`'s
  own planning/interview.

## [1.1.0] - 2026-07-01

### Added
- Optional **deep-interview mode** for `$lazyprompt`, ported from GJC's
  deep-interview algorithm. Opt-in via `--interview` / `--quick` / `--standard`
  / `--deep` flags or natural-language triggers ("interview me", "인터뷰",
  "deep interview"). Runs Socratic one-question-at-a-time interviewing with a
  Round 0 topology gate, weighted bidirectional ambiguity scoring (greenfield
  `goal 0.40 / constraints 0.30 / criteria 0.30`, brownfield
  `0.35 / 0.25 / 0.25 / context 0.15`), weakest-dimension targeting, and depth
  thresholds (quick 0.60 / standard 0.50 / deep 0.35) before crystallizing into
  the standard `프롬프트` + `프롬프트 설명` output. Default one-shot behavior is
  unchanged; the skill still only emits prompt text and never runs the target.
- Algorithm-fidelity contract test locking the ported formulas, thresholds, and
  core mechanics across both skill copies.
- **oh-my-codex (OmX) hardening** of the plan/loop reward structure and the
  deep-interview mode, referencing OmX's `plan`/`ralplan` (RALPLAN-DR summary,
  ADR, plan quality bars, `deliberate` high-risk tier with pre-mortem + expanded
  test plan), `ultrawork`/`ultraqa` (LIGHT/HEAVY criteria triage, real-surface
  evidence with "baseline tests are necessary but not sufficient", adversarial
  scenario classes, cleanup receipt + final quality gate), and `deep-interview`
  (fact/decision routing labels, Simplifier/Ontologist challenge modes, pressure
  pass, Non-goals readiness gate). Hardened plan/loop output templates and added
  a cross-cutting risk tier. Applied to both skill copies.
- Contract test locking the oh-my-codex hardening tokens across both copies.

## [1.0.0] - 2026-07-01

### Added
- `$lazyprompt` Codex skill that turns a vague idea into the optimal copy-paste
  prompt for lazycodex/OmO `$ulw-plan` (planning) or `$ulw-loop` (evidence-gated
  execution). Outputs prompt text only; never runs the target skill.
- Automatic target inference (plan vs. loop) with reward-structure templates and
  selective `$`-skill weaving from the OmO catalog snapshot.
- Codex plugin packaging under `plugins/lazyprompt/` and the marketplace manifest
  at `.agents/plugins/marketplace.json`.
- Repository-local skill copy (`.agents/skills/lazyprompt/SKILL.md`) kept byte-for-byte
  in sync with the packaged copy.
- Skill contract tests (`test/skill-contract.test.mjs`).

[Unreleased]: https://github.com/devswha/lazyprompt/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/devswha/lazyprompt/releases/tag/v1.1.0
[1.0.0]: https://github.com/devswha/lazyprompt/releases/tag/v1.0.0
