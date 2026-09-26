# Technical studio direction

The user rejected the first editorial treatment as too recognizably AI-generated and selected “Technical studio — sharp typography, real product screens, interactive engineering details.” This direction replaces that version.

## Identity

Lead with Akul’s name in self-hosted Barlow Condensed, then a direct account of the work. Neutral white, charcoal, a small rust accent, and a pale yellow-green contact surface. No italic-serif slogans, ornamental asterisks, repeated giant project numbers, or generic capability panels.

## Sequence

- A compact name-led opening gives context and leads directly into work.
- RISE uses an executable local model of request → queue → worker → persistence. A load toggle changes the illustrative waiting interval and event log. No production integrations or performance claims are inferred from the model.
- Claims uses a two-document evidence workspace. Visitors compare conflicting dates and move the illustrative discrepancy to a local review state.
- Fleet uses the supplied before/after response times as a direct visual comparison, alongside the actual portfolio figures for scale and costs.
- Independent work uses screenshots captured from the public GloryWellNic, Elaria, and Lumivolt websites. These are public marketing-page captures, not private application screenshots.
- About describes the engineer’s specific working context. Remaining projects stay accessible in an expandable list. Contact is short and direct.

## Implementation

Next.js static export, TypeScript, Tailwind v4, and Framer Motion. The local font is preloaded through next/font/local; its OFL license is retained. Screenshots are locally served WebP assets and lazy-loaded. Original PNG captures remain available for reference. No runtime calls to project sites, third-party fonts, or analytics.

Mobile reshapes the hero, switches the order demo to a vertical arrangement, and preserves interactive controls. Reduced-motion mode removes parallax and transition effects and immediately completes the order demonstration. Keyboard focus is explicit. Stateful demos use native buttons and live feedback.
