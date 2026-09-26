# Akul Varshney — selected work

A technical studio portfolio built with Next.js, TypeScript, Tailwind CSS v4, and Framer Motion. A condensed, name-led identity opens into runnable engineering demonstrations and captured public client websites.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000 (or the port Next.js prints if 3000 is occupied).

## Production

```sh
npm run build
npm start
```

The production site is statically exported to `out/`. No environment variables or server are required. Contact uses mailto; email copying requires HTTPS or localhost. Barlow Condensed is self-hosted through next/font/local with its OFL license. Client-site captures are served locally as lazy-loaded WebP images. No external font, image, analytics, or live API requests are made.

## Editing

- `components/Experience.tsx`: reusable navigation, order simulation, document comparison, performance visualization, client work, about, and contact.
- `app/globals.css`: visual tokens, responsive compositions, Tailwind import, focus states, and reduced-motion behavior.
- `app/layout.tsx`: metadata and document shell.
- `public/Akul-Varshney-Resume.pdf`: downloadable resume.
- `docs/design-direction.md`: discovery and experience design decisions.
- `docs/design-critique.md`: critique, refinements, and QA evidence.

Project facts come from the previous portfolio; the original content is preserved in `docs/archive/`. The request lifecycle and claim documents are explicitly illustrative, not production screenshots or live data. Client-site images are captures of public websites. Fleet response figures come from the original portfolio. Existing project URLs and employer attribution are retained. Original unused JavaScript components remain available as implementation references.

## Verification

`npm run build` includes TypeScript validation. `tmp/qa/studio.cjs` is the local browser QA script. It uses the installed Codex Playwright runtime and browser executable, so those paths must be adapted on another machine. It checks all project states, navigation, clipboard, resume availability, reduced motion, and horizontal overflow from 320px to 1920px. Screenshots are in `tmp/qa/studio-*.png`.
