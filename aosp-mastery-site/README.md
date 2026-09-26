# AOSP Mastery - Site

The course platform. A [Docusaurus](https://docusaurus.io/) static site that
runs locally and opens in Chrome or Firefox with no special flags.

## Requirements (verified)

- **Node.js >= 20** (check with `node -v`). Node 24 LTS was used to build this.
- npm (bundled with Node), or yarn/pnpm/bun.

## Run it locally (the thing you want)

    npm install       # first time only
    npm run start     # opens http://localhost:3000 automatically

If a browser window does not open on its own, open
**http://localhost:3000** in Chrome or Firefox. Edits to .md/.mdx files reload live.

## Preview the exact production build locally

    npm run build
    npm run serve     # serves http://localhost:3000 from ./build

This is the same output GitHub Pages serves.

## Where things live

    docs/
      intro.md                     # "Start Here" page
      phase-minus-1-foundation.mdx # Phase -1 (C++17 + systems-C)
      phase-0-basecamp.mdx         # Phase 0 - the verified environment gate
      phase-1-systems.mdx          # Phase 1 - systems foundations (fork/exec, IPC, cross-compile)
      phase-2-build-system.mdx     # Phase 2 - Soong/Kati/Ninja, lunch, m, Cuttlefish boot
      phase-3-boot-init.mdx        # Phase 3 - boot chain, dmesg/logcat, init.rc, boot property
      phase-4-kernel-foundations.mdx # Phase 4 - GKI/KMI, Kleaf build, Binder wait/wake
      phase-5-native-runtime.mdx   # Phase 5 - NDK daemon, Zygote/ART, atest, Rust literacy
      phase-6-hal-binder.mdx       # Phase 6 - AIDL HAL, VINTF, service manager, VTS
      phase-7-framework-layer.mdx  # Phase 7 - SystemService, app-facing AIDL, framework test
      phase-8-security-model.mdx   # Phase 8 - SELinux policy, avc denials, CTS security, Verified Boot
      phase-9-debugging-performance.mdx # Phase 9 - tombstones, Perfetto, ftrace, seeded-bug diagnosis
      phase-10-kernel-mastery.mdx  # Phase 10 - loadable module, /proc entry, dmesg/ftrace diagnosis
      phase-10-5-drivers.mdx       # Phase 10.5 - char/IIO driver, device tree, kselftest/KUnit
      phase-11-real-device.mdx     # Phase 11 - Cuttlefish vs Pixel, partitions, A/B slots
      phase-12-pixel-bringup.mdx   # Phase 12 - device tree, vendor binaries, build/flash/boot (elective)
      phase-13-production-readiness.mdx # Phase 13 - Rust, APEX, graphics/Camera HAL, Trade Fed
      phase-14-contribution.mdx    # Phase 14 - Gerrit flow, commit format, self-review, cs.android.com
      phase-15-capstone.mdx        # Phase 15 - full-stack feature, CTS/VTS subset, public fork, review
    src/components/
      Unit/                    # reusable unit-template components (plan 8.3)
      TestRunner/              # Testing-Thread UI: cmd/expected tabs + Copy (plan 4.7)
      Progress/                # client-side progress + JSON export (plan 8.5)
      CompetencyMap/           # renders the competency map (plan 9)
      HomepageFeatures/        # homepage feature cards
    sidebars.js                # curriculum navigation
    docusaurus.config.js       # site title, navbar, footer, URLs (loads the map)
data/
  competency-map.yaml       # the single source of truth (plan 9)
  load-competency-map.mjs   # build-time YAML parse + validate
.github/workflows/
  ci.yml                    # build gate: npm ci + map check + strict build
  deploy.yml                # GitHub Pages deploy workflow
static/.nojekyll            # REQUIRED for GitHub Pages (keeps _-prefixed assets)

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests:

1. `npm ci`
2. a **competency-map validation** step (fails fast on a malformed map)
3. `npm run build` with `STRICT_LINKS=1`

The `STRICT_LINKS=1` env var (read in `docusaurus.config.js`) switches
`onBrokenLinks` from `warn` to `throw`. Locally, broken links are only warnings
for fast iteration; in CI they are **hard failures**, so a dangling link — such
as a `NextMission` pointing at an unpublished phase — cannot ship.

`.github/workflows/deploy.yml` deploys to GitHub Pages after a successful build.

## Checkpoints (instant-feedback quizzes)

`<Checkpoint>` from `@site/src/components/Unit` renders an interactive
quick-check when given a quiz object:

```jsx
<Checkpoint
  quiz={{
    question: 'Why does AOSP system code avoid exceptions?',
    options: ['...', '...', '...', '...'],
    answer: 1,           // 0-based index of the correct option
    explain: 'Because ...',
  }}
/>
```

Picking an option shows correct/incorrect and the explanation, with a "Try
again" reset. It is **not graded** and stores nothing. The older static form
(`<Checkpoint question="...">answer</Checkpoint>`) still works.

## Progress tracking

Progress is stored in the browser only (localStorage), so it works offline
with no backend:

- CompleteButton unitId="..." xp={500} marks a unit done and awards XP.
- ProgressPanel shows XP + completed count, with Export JSON, Import JSON, and
  Reset. Export writes aosp-mastery-progress.json to back up or move to another
  machine.

The components are SSR-safe: they render a fallback on the server and hydrate on
the client, so localStorage is never touched during the static build.

## Competency map (single source of truth)

`data/competency-map.yaml` lists every phase, competency, tier, artifact, and
testing expectation. It is parsed and validated at BUILD time by
`data/load-competency-map.mjs` (imported from `docusaurus.config.js`), then
exposed to pages via `customFields` and rendered at `/competency-map`.

- A bad map (duplicate id, invalid tier, artifact not under `spine/`) FAILS the
  build with a clear error instead of shipping silently.
- To change the curriculum's definition of done, edit the YAML - not the
  platform code.

## Adding a new phase (no new markup)

1. Create docs/phase-N-*.mdx.
2. Import the components you need from @site/src/components/Unit.
3. Use Hook, Outcome, Prereqs, DoThis, WhyItWorked, BreakIt, Checkpoint, Reward,
   NextMission.
4. Add the doc id to sidebars.js.

## Deploying to GitHub Pages

1. Set url, baseUrl, organizationName, projectName in docusaurus.config.js.
2. Keep an empty static/.nojekyll (already present).
3. Push to main - the workflow at .github/workflows/deploy.yml builds and
   deploys. In the repo, set Settings -> Pages -> Source to GitHub Actions once.

## A note on the build

The site is statically rendered and generally works even without JavaScript.
npm run build must finish with no warnings/errors before you publish.
