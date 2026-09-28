# Design

## Source of truth
- Status: Active. Refreshed: 2026-09-28.
- Surface: public, mobile-first 10km pacer guide; static files in `docs/`.
- Evidence: user-approved content, Brittany Chiang's fixed-index portfolio structure, Tamal Sen's large section headings, locally saved event HTML.

## Brand
- Warm, precise, calm, typographic. Yellow `#FEE500` and ink `#141414` observed in saved event HTML.
- No event logo, characters, photos, copied graphics or brand fonts. Original typography/layout only.
- No names, nicknames, contact details, staff lists or internal sessions in public files.

## Product goals
- Read before the race; quickly revisit a section on race day.
- Select one of six target finish times, understand timing and metrics, practise decisions.
- Non-goals: live GPS tracking, accounts, personal profiles, publishing internal operations.
- Success: readable at 320px, complete navigation by touch/keyboard, accurate splits.

## Personas and jobs
- Race-experienced first-time pacers; phone reading and occasional desktop briefing.
- Learn consistent net-time pacing, find target splits, check preparation.

## Information architecture
- One scrolling page: principles, pace card, device display, rhythm, scenarios, checklist.
- Fixed desktop index; mobile collapsible sticky index. Sources at end.
- Essential rules always visible. Secondary notes and full tables may be expanded.

## Design principles
- Typography and spacing establish hierarchy; avoid decorating every paragraph as a card.
- Interaction clarifies a decision; essential content must remain readable without JS.
- State uncertainty next to the claim, including the NRC illustrative window.

## Visual language
- Yellow/ink key colors, warm off-white canvas, gray dividers, muted olive secondary text.
- System sans-serif for Korean; system monospace for numbers/labels. No font CDN.
- Desktop 340px sticky rail with a spacious reading column. Section rules and generous gaps.
- Mostly square geometry; modest radii only on controls. No shadows or image assets.
- Smooth anchor movement only when reduced-motion is not requested.

## Components
- Section index, target-time radio group, interactive split card, metric explainer,
  device notes, scenario choices with inline feedback, persistent local checklist.
- Colors and spacing owned by `docs/styles.css`; behavior by `docs/app.js`.

## Accessibility
- Aim for WCAG 2.2 AA; semantic headings, skip link, real buttons/inputs, visible focus.
- Dark text on yellow. Secondary text contrast checked. Touch targets at least 44px.
- Announce user-triggered results without announcing every scrolling change.
- Reduced motion support. No timed quizzes, autoplay, mandatory animation, audio.

## Responsive behavior
- >= 1000px: left sticky rail / right content.
- < 1000px: header and collapsible sticky index; single-column content.
- < 600px: compact padding; stacked content and touch-friendly controls.
- Print: hide interaction-only controls, show reference table and expanded notes.

## Interaction states
- No fetch/loading states: all content and calculations local.
- Default 60-minute illustration, clearly labeled. Inputs validated and bounded.
- Storage errors: page remains usable; show session-only note for checklist.
- Feedback: explain correct and incorrect choices; allow changing answers.
- No disabled essential content. Network unnecessary after assets have loaded.

## Content voice
- Concise Korean, familiar running terms, supportive and concrete.
- Distinguish operating recommendations, official device definitions and unverified estimates.
- Never imply cadence alone guarantees speed; no universal 180spm target.

## Implementation constraints
- Plain HTML/CSS/JS, no dependencies, analytics, tracking, cookies or remote assets.
- GitHub Pages publish directory: `/docs`. Do not publish local source/reference HTML.
- No personal data in source, metadata, scripts or generated assets.
- Test 320/390/768/1440px layouts; pace math, anchors, controls, persistence, keyboard, no-JS.

## Open questions
- GitHub destination repository not specified. Build locally; no remote publication in this step.
- Event operational contacts and handoff procedures remain outside the public guide.
