# Apple Design Awards Archive (2020–2026)

Browse all Apple Design Awards winners and finalists from 2020 to 2026.

**[View Live Site →](https://m1zz.github.io/ADA/)**

## Tabs

| Page | Description |
|------|-------------|
| **[/](https://m1zz.github.io/ADA/)** (`docs/index.html`) | Redirects to the archive |
| **[ADA Archive](https://m1zz.github.io/ADA/ada-archive.html)** (`docs/ada-archive.html`) | ADA winners & finalists, 2020–2026 · EN/KO |
| **[App Field Guide](https://m1zz.github.io/ADA/field-guide.html)** (`docs/field-guide.html`) | 100-app teardown checklist in 10 categories · KO only |
| **[Impact References](https://m1zz.github.io/ADA/impact.html)** (`docs/impact.html`) | Impact = reach × depth × duration × counterfactual; breadth / depth / structure / tool reference apps, impact vs. value, and how to talk to someone building a low-impact app · KO only |
| **[Install Queue](https://m1zz.github.io/ADA/install-queue.html)** (`docs/install-queue.html`) | Install every app on iPhone one by one: Get → confirm → next · KO only |
| **[My Apps](https://m1zz.github.io/ADA/my-apps.html)** (`docs/my-apps.html`) | The developer's own 46 App Store apps, evaluated with a 9-criterion rubric derived from the 291 reference apps · KO only |

All pages share the same header tab bar, so you can switch between them freely.

## Features

- Complete ADA winners & finalists from 2020–2026
- Filter by year, category, and type (app / game)
- Search by app name or developer
- Live app icons from the iTunes API
- **English / Korean** language toggle
- **Deep dive** per app (both tabs): what makes it good, its impact, and evidence — App Store ratings measured via the iTunes Lookup API plus sourced metrics (users, revenue, funding, awards) with links and as-of dates (`docs/insights.js`, data in `docs/insights-data.js`)

## Categories

| Color | Category |
|-------|----------|
| 🟠 | Delight and Fun |
| 🟢 | Inclusivity |
| 🔵 | Innovation |
| 🟣 | Interaction |
| 🩷 | Social Impact |
| 🟡 | Visuals and Graphics |
| 🔷 | Spatial Computing |

## App Field Guide (앱 관찰 기록부)

100 apps grouped by **impact**, not by feature: 10 impact types × 10 apps.

| | Impact type | Measured by |
|---|---|---|
| A | Created a new daily behavior | DAU/MAU, daily repeats, streaks |
| B | Interface everyone copied | Imitation by rivals/platforms, reach |
| C | Changed the Apple platform | Apple acquisition, became a system feature, API showcase |
| D | Changed an industry or business model | Revenue/valuation, competitor response, pricing |
| E | Accessibility that changed lives | People helped, tasks done independently |
| F | Changed health & wellbeing behavior | Efficacy studies, paid subscribers, retention |
| G | Social & public impact | Reach in crises, coverage, donations/institutions |
| H | Small team, big impact | Users/revenue per team size, longevity |
| I | AI changed how work gets done | Growth speed, usage/ARR, trust costs (lawsuits, errors) |
| J | Changed the Korean market | Domestic share/MAU, lifestyle change |

- Each card pairs an **impact metric** (summarized from the sourced "Deep dive" evidence, with as-of dates)
  with an **observation point**: the design decision that produced that impact
- A 30-minute protocol works backward from the metric to the screens that caused it
- Progress is stored in the browser (`localStorage`, key `ada-field-guide-v2`; v1 progress is migrated by app name)
- 43 apps are ADA winners/finalists and link to the archive tab

## Impact References (임팩트 레퍼런스)

A reference page built around one formula: **impact = reach × depth × duration × counterfactual**.

1. **Measuring impact** — each factor with practical proxies (D30/D90 retention, the "what would you use
   if this disappeared tomorrow?" question, resources saved, behavior change, the Sean Ellis 40% test)
2. **High-impact apps by type** — breadth (M-Pesa, WhatsApp, KakaoTalk, Signal, Toss, Watch Duty),
   depth (Be My Eyes, oko, Proloquo2Go, Seeing AI, Voice Dream Reader, Tiimo), structure (Anki, Duolingo,
   Strava, Photomath), tool (Figma, Obsidian, Slack, Google Sheets, Notion). Each app is rated on the four
   factors (editorial judgment; counterfactual is inferred) with sourced evidence or a link to its deep dive
3. **Is bigger impact more valuable?** — impact has a sign (mixed cases: Robinhood, Noom, Diablo Immortal,
   Otter.ai; direction flipped by design: Opal, Gentler Streak), measurability bias, the aggregation trap,
   and value to the maker
4. **Talking to someone building a low-impact app** — triage (learning / wrong direction / sunk cost) and
   tools: lower the cost of validation, self-set timeboxes, separate sunk cost, settle failure as assets,
   lower the stakes instead of folding the game

## My Apps (내 앱 평가)

All App Store apps by the developer account behind this repo, evaluated against a rubric built from
the 291 researched reference apps.

- **9 criteria**, each scored 1–5 with anchors: first value, return loop, craft, accessibility,
  platform integration, trust & privacy, business model, store presence, impact evidence.
  Each criterion states what the reference apps taught and links to exemplar apps' deep dives
- Every score cites its evidence: App Store data, screenshots, and (for 37 apps) the local source code.
  Apps were not run, so runtime-only behavior is out of scope
- Per app: impact type, closest reference apps, strengths, gaps, and the 3 highest-impact fixes
- Portfolio diagnosis: average per criterion, recurring strengths and gaps, and portfolio-wide actions
- Security-sensitive specifics are redacted on this public page and were reported to the developer privately
- Data in `docs/my-apps-data.js`

## Data Source

[Apple Design Awards](https://developer.apple.com/design/awards/) — Apple Developer official page.

> App icons are fetched live from the Apple iTunes API. Download links point to the US App Store.

## Install Queue (다운로드 큐)

Work through all 291 apps from both tabs on an iPhone, one at a time.

- **Get** opens the App Store app directly (`itms-apps://`); coming back to Safari asks
  "did you install it?" and moves the next app to the top
- Installed / skipped state is saved in the browser (`localStorage`), with a progress bar,
  remaining download size, and total cost of remaining paid apps
- Apps that can't be installed on iPhone are hidden by default: Mac-, iPad- and
  Vision Pro-only listings, apps removed from the store, and US-storefront-only apps
  (where an iPhone version exists under a different listing, that one is used)
- Filters for source (ADA / winners only / field guide), price (free / Apple Arcade / paid)
  and status; sort by recommended, size, name, or ADA year
- Data in `docs/install-data.js` (iTunes Lookup API; a missing price field marks Apple Arcade)
