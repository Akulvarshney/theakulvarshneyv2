# Technical studio redesign: critique and QA

The first direction was rejected. This document records changes made to address that feedback rather than treating the previous polish pass as sufficient.

1. Generic sans/italic-serif pairing → condensed typographic identity, no decorative serif.
2. Generic “products that think” slogan → Akul’s name and concrete operational work.
3. Excessive empty hero height → compact opening that reveals selected work sooner.
4. Identical chapter templates → different compositions for system behavior, document evidence, and performance.
5. Decorative rail paths → runnable order model with staged event output.
6. Tabs with only explanatory copy → a peak-load control that changes the simulated waiting behavior.
7. One claim document without a comparison → source-document switching with contradictory dates visible.
8. Passive AI narrative → local human-review action and reset, without submitting real data.
9. Decorative fleet map → measured before/after response-time comparison.
10. Missing real work imagery → captured public websites, linked to their actual sources.
11. Generic manifesto → working context at Orane and EXL in plain language.
12. Equal project cards → asymmetrically arranged client work and a compact remaining-project index.
13. Desktop artwork simply shrunk on mobile → stacked event log, reformatted hero, responsive document viewer.
14. External font dependency → licensed self-hosted font preloaded by Next.js.
15. Heavy raw captures → lazy-loaded WebP production assets.
16. Tiny annotations → raised 6–8px labels to at least 9px during visual QA.
17. Hidden line-break concatenation → explicit spacing in mobile reflow.

## QA

Production build includes TypeScript validation. `tmp/qa/studio.cjs` checks responsive overflow at 320, 390, 768, 1024, 1440, and 1920px; order completion in normal and peak modes; claim document selection; review and reset; performance comparison; mobile navigation; clipboard; and reduced-motion immediate completion. Desktop and mobile screenshots cover every major project. The public screenshots were visually inspected before inclusion.

Axe-core WCAG 2 A/AA and 2.1 AA checks cover desktop and mobile. This is automated coverage, not a claim of exhaustive accessibility certification. Local performance smoke checks are not published Core Web Vitals.

Sources for site captures: https://glorywellnic04.web.app, https://www.elariaesthetique.in, https://www.lumivolt.co.in. Captured 25 September 2026. Enterprise metrics and biographical facts come from the existing portfolio preserved in docs/archive/Portfolio.original.txt.
