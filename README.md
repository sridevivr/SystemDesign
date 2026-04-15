# System Design Quest

**[→ Live demo](https://system-design-quest.vijayaraghavansridevi.workers.dev/)**

A gamified web app for learning system design one small concept at a time —
Duolingo, but for the fundamentals that power every app you use.

The app drives a single linear path: no topic picker, no dashboard of choices.
You start at "what is a client and a server" and work your way up through
networking, scaling, and beyond. Every lesson is built around **real-world
company scenarios** (Netflix, Instagram, Slack, Uber, Stripe, Zoom, DoorDash,
and more) and **everyday analogies**, because concepts stick better when they
are tied to things you already experience.

No backend. No accounts. Progress is saved in your browser's localStorage.

---

## How to run it

Prerequisites: **Node.js 18+** and **git**.

```bash
git clone https://github.com/sridevivr/SystemDesign.git
cd SystemDesign
git checkout claude/system-design-game-N1eLR
npm install
npm run dev
```

Open <http://localhost:5173> in your browser. To stop, press `Ctrl+C` in the
terminal.

Other commands:

```bash
npm test       # run the vitest suite
npm run build  # production bundle to dist/
```

---

## How a lesson works

Each lesson walks you through five kinds of cards in order. This pedagogical
contract is enforced by the TypeScript types — a lesson that skips examples or
analogies will not compile.

1. **Concept intro** — 1–3 sentences in plain language.
2. **Real-world example(s)** — a concrete moment at a specific company.
   ("When you open Netflix on your TV, the TV is the client…")
3. **Analogy** — an everyday, non-technical comparison.
   ("The kitchen at a restaurant is the server…")
4. **Questions** — 6 per lesson, mixing multiple choice, true/false, and
   fill-in-the-blank. At least one question per lesson references the example
   or the analogy by name so the story isn't just decoration.
5. **Review questions** — after the lesson's own questions, 1–2 questions
   drawn from *earlier lessons in the same unit* are appended, tagged with a
   "🔁 Review — from '…'" badge. This is spaced repetition baked into the
   core loop.

At the end of a lesson you earn XP. Wrong answers do not block progress, but
they are tracked (see below).

---

## How a unit works

Every unit ends with a **Unit Review**, automatically triggered the first time
you finish the last lesson of the unit. The Unit Review runs:

1. **Every question you got wrong during the unit**, pulled from a per-unit
   mistake bucket in the Zustand store (persisted to localStorage).
2. **A small curated `finalReview` set** (3–4 hand-written cross-cutting
   questions per unit) that tie the concepts together.

Finishing the review awards extra XP (+25 or +30 depending on the unit) and
clears the mistake bucket for that unit. A "Unit Review" node is also shown
on the lesson path, so you can replay a review or backfill one at any time.

---

## Curriculum

Each unit ships with 5 lessons × 6 questions + a curated final review.

### Unit 1 — Foundations
> The very first ideas behind every app you use.

1. **Client and server** — Netflix · Instagram · restaurant ordering
2. **Requests and responses** — Google Maps · Stripe · librarian at a desk
3. **Latency vs throughput** — YouTube · Uber · highway traffic
4. **Availability and reliability (nines)** — WhatsApp · Amazon · 24-hour diner
5. **Stateless vs stateful** — Slack · Discord · hotel front desk vs butler

### Unit 2 — Networking basics
> How clients and servers actually find and talk to each other.

1. **IP addresses and ports** — Zoom · Minecraft · apartment building
2. **DNS: names into addresses** — Netflix · Airbnb · phone book
3. **TCP vs UDP** — Gmail · Zoom · registered mail vs shouting across a room
4. **HTTP methods and status codes** — Twitter/X · Dropbox · waiter with a ticket
5. **HTTPS and encryption** — your bank · Google Search · sealed envelope vs postcard

### Unit 3 — Scale and distribution
> How systems grow from one server to many — and stay up.

1. **Vertical vs horizontal scaling** — Stack Overflow · Netflix · one giant chef vs many regular chefs
2. **Load balancers** — Amazon · Discord · airport security with multiple lanes
3. **Health checks** — Slack · Cloudflare · bouncer checking the staff
4. **Autoscaling** — DoorDash · Zoom · opening more checkout lanes
5. **Multi-region** — Spotify · Slack (us-east-1 outage) · coffee shop chain

### Unit 4 — Databases
> How systems remember things. The place where all the important stuff actually lives.

1. **What is a database?** — Instagram · Uber · a filing cabinet with an organized clerk
2. **Tables, rows, and queries** — Airbnb · Twitter/X · highlighting rows in a spreadsheet
3. **Indexes** — LinkedIn · Amazon · the index at the back of a textbook
4. **ACID and transactions** — Stripe · Venmo · a marriage ceremony
5. **SQL vs NoSQL** — Reddit · Discord · a formal library vs a well-labeled warehouse

### Unit 5 — Caching
> Don't do work you've already done. The art of making the second request fast.

1. **Why cache?** — YouTube · Wikipedia · a snack in your desk drawer
2. **Cache hits and misses** — Instagram · Spotify · looking up a phone number
3. **Cache invalidation** — Twitter/X · Stripe · printed paper menus
4. **Eviction: LRU** — Netflix · DNS caches · your kitchen counter
5. **CDNs** — Netflix Open Connect · Cloudflare · a chain bookstore

### Unit 6 — Async and queues
> Work that doesn't have to happen while the user is waiting.

1. **Synchronous vs asynchronous** — Amazon checkout · Instagram posts · a waiter taking your order and walking away
2. **Message queues** — DoorDash orders · Uber pricing events · a factory conveyor belt
3. **Pub/sub** — Slack notifications · Stripe webhooks · a newspaper delivery subscription
4. **Idempotency** — Stripe idempotency keys · shipping a box vs sending an email · light switch vs toggle button
5. **Retries and dead-letter queues** — AWS SQS DLQs · Shopify webhook retries · mail that keeps getting returned

### Roadmap (not yet authored)
- Unit 7 — Distributed systems (replication, sharding, CAP, consistency)
- Unit 8 — Design patterns (rate limiting, circuit breakers)
- Unit 9 — Real-world designs (URL shortener, chat, feed)

---

## Tech stack

- **Vite + React 18 + TypeScript** — fast dev server, strict types.
- **TailwindCSS** with class-based dark mode — no bespoke CSS.
- **Inter** + **JetBrains Mono** self-hosted via `@fontsource` — the
  typography pair that feels right for a developer tool.
- **Lucide** for iconography — no emojis in the UI.
- **Zustand** with the `persist` middleware — app state (XP, completed
  lessons, mistake bucket, theme preference) saved to `localStorage`
  under `sdq.progress.v1`.
- **Vitest + React Testing Library + jsdom** — 18 unit tests covering
  progression logic, review question selection, mistake tracking, and
  content contracts.

---

## Project layout

```
src/
├── App.tsx                    # top-level view switcher (state machine)
├── main.tsx                   # React entry
├── index.css                  # Tailwind entry
│
├── content/
│   ├── index.ts               # ordered curriculum + future roadmap
│   ├── types.ts               # Lesson / Unit / Question / Example / Analogy
│   ├── README.md              # authoring rules (examples + analogies required)
│   ├── unit-01-foundations.ts
│   ├── unit-02-networking.ts
│   ├── unit-03-scaling.ts
│   ├── unit-04-databases.ts
│   ├── unit-05-caching.ts
│   └── unit-06-async-queues.ts
│
├── lib/
│   ├── progression.ts         # pure helpers: flatten, next, status,
│   │                            selectReviewQuestions, resolveMistakeQuestion,
│   │                            unitReviewStatus, isLastLessonInUnit, ...
│   ├── theme.ts               # useTheme hook, system-preference listener
│   └── unit-accents.ts        # per-unit colour map (sky/violet/amber/teal/pink)
│
├── store/
│   └── progress.ts            # Zustand store (xp, completed, completedReviews,
│                              # mistakes bucket) + localStorage persist
│
├── components/
│   ├── Header.tsx             # title + XP + reset
│   ├── LessonPath.tsx         # the home screen: vertical lesson tree
│   │                            with Unit Review nodes
│   ├── LessonRunner.tsx       # drives one lesson, tracks wrong answers,
│   │                            appends review questions
│   ├── LessonComplete.tsx     # "Lesson complete +X XP"
│   ├── UnitReviewRunner.tsx   # end-of-unit review (mistakes + finalReview)
│   ├── UnitComplete.tsx       # "Unit mastered" celebration with pulse-ring trophy
│   ├── ConceptDiagram.tsx     # inline SVG diagrams per lesson (Lucide icons + arrows)
│   ├── IntroCard.tsx
│   ├── ExampleCard.tsx        # "How {company} uses this"
│   ├── AnalogyCard.tsx        # "Think of it like…"
│   ├── CardShell.tsx          # shared card chrome with footer slot
│   ├── QuestionCard.tsx       # shared question renderer with review badge
│   └── questions/
│       ├── MultipleChoice.tsx
│       ├── TrueFalse.tsx
│       └── FillBlank.tsx
│
└── __tests__/
    └── progression.test.ts    # 18 tests
```

---

## Key data model

Every lesson is forced at compile time to include a real-world example and an
analogy — both are tuple types (`[X, ...X[]]`) rather than arrays, so a lesson
that forgets them won't type-check.

```ts
export type Lesson = {
  id: string;                  // e.g. "foundations.client-server"
  title: string;
  intro: string;               // 1–3 sentence plain definition
  examples: [RealWorldExample, ...RealWorldExample[]];
  analogies: [Analogy, ...Analogy[]];
  questions: Question[];       // 6 per lesson, mixed kinds
  xp: number;                  // 10 per lesson
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  finalReview?: Question[];    // end-of-unit curated questions
  reviewXp?: number;           // defaults to 25
};

export type Question =
  | { kind: 'mcq'; prompt; options; answerIndex; explain }
  | { kind: 'tf'; prompt; answer; explain }
  | { kind: 'fill'; prompt; answers: string[]; explain };
```

Mistakes are stored as `"${lessonId}:${questionIndex}"` keys in a
`Record<unitId, string[]>` inside the Zustand store. `resolveMistakeQuestion`
walks the curriculum to turn a key back into the real question for the review
screen.

---

## Development journal

A quick record of what was built, in order, for anyone jumping in later.

### v0.1.0 — Initial MVP
- Vite + React + TypeScript + Tailwind scaffold.
- Zustand store with localStorage persistence (XP + completed lessons).
- Linear lesson path with locked/available/done states.
- Three question kinds: MCQ, true/false, fill-in-blank, each with immediate
  feedback and an explanation.
- Lesson flow: intro → examples → analogies → questions → completion.
- Unit 1 (Foundations) and Unit 2 (Networking basics), 5 lessons × 6
  questions each, all with real company examples and analogies.
- `Lesson` type forces every lesson to include at least one example and one
  analogy. `content/README.md` documents the authoring rules.
- 7 unit tests on progression logic.

### v0.1.1 — Question reset fix
- Fixed a bug where advancing from one question to the next reused the same
  `MultipleChoice`/`TrueFalse`/`FillBlank` component instance, so the new
  question showed up pre-selected with stale feedback and no Continue button.
  Fix: key `QuestionBody` on the step index so React remounts it per question.

### v0.2.0 — Wrong-answer tracking, spaced review, and unit reviews
- **Spaced review inside lessons.** Every lesson after the first in a unit
  now ends with 1–2 review questions drawn deterministically from earlier
  lessons in the same unit. Each review question is tagged with a
  "🔁 Review — from '…'" badge.
- **Per-unit mistake bucket.** When you answer any question wrong — regular
  or review — the mistake is recorded in `mistakes[unitId]` in the Zustand
  store and persisted to localStorage.
- **End-of-unit review.** Finishing the last lesson of a unit transitions
  straight into a Unit Review that re-asks every wrong answer plus a
  curated `finalReview` set. Completing the review awards extra XP and
  clears the unit's mistake bucket.
- **Unit Review node** on the lesson path, visible for every unit. Locked
  until all lessons in the unit are done, then available (or done once
  you've completed it). You can replay or backfill reviews at any time.
- **Factored shared `QuestionCard`** used by both `LessonRunner` and
  `UnitReviewRunner`, so review questions render identically wherever they
  appear.
- Unit 1 and Unit 2 each got 4 curated cross-cutting `finalReview` questions.
- Extended progression helpers: `unitForLesson`, `isLastLessonInUnit`,
  `selectReviewQuestions`, `resolveMistakeQuestion`, `mistakeKey`,
  `unitReviewStatus`.

### v0.3.0 — Unit 3 and test expansion
- **Unit 3 — Scale and distribution.** Five full lessons (vertical vs
  horizontal scaling, load balancers, health checks, autoscaling,
  multi-region) plus a 4-question `finalReview`. Real-world scenarios
  include Stack Overflow, Netflix, Amazon, Discord, Slack, Cloudflare,
  DoorDash, Zoom, Spotify, and the famous 2017 AWS us-east-1 outage.
- Progression test suite expanded from 7 to 18 tests, now covering unit
  helpers, review question selection (emptiness, scope, determinism),
  mistake key round-tripping, and unit review status transitions.

### v0.4.0 — Units 4 and 5 (databases + caching)
- **Unit 4 — Databases.** Five lessons — what is a database, tables
  and queries, indexes, ACID/transactions, and SQL vs NoSQL — plus a
  4-question `finalReview`. Real-world scenarios include Instagram,
  Uber, Airbnb, Twitter/X, LinkedIn, Amazon, Stripe, Venmo, Reddit
  (PostgreSQL), and Discord (ScyllaDB).
- **Unit 5 — Caching.** Five lessons — why cache, hits and misses,
  cache invalidation (with Phil Karlton's famous quote), LRU eviction,
  and CDNs — plus a 4-question `finalReview`. Real-world scenarios
  include YouTube, Wikipedia, Instagram, Spotify, Twitter/X, Stripe,
  Netflix Open Connect, Cloudflare, and DNS caches.
- Curriculum now runs to 25 lessons / 150 questions + 5 unit reviews
  (20 curated cross-cutting questions), all type-checked by the same
  `Lesson` tuple contract that forces examples and analogies.
- Progression test suite bumped its minimum-unit assertion from 3 to
  5 so any future regression in the curriculum surfaces immediately.

### v0.5.0 — Aesthetic refresh + first public ship
- Full visual refresh: dark mode (default "system"), indigo palette,
  Inter + JetBrains Mono, Lucide icon set, meandering lesson path,
  per-unit accent colors, concept diagrams on intro cards, animated
  XP count-ups, softer celebration screens, a richer header with a
  lesson-progress breadcrumb, an XP pill, a theme toggle, and a
  settings menu.
- Pre-deploy polish: mobile-safe lesson path offsets, real `<title>`
  and Open Graph tags in `index.html`, an indigo LayoutGrid favicon,
  and a dismissible first-visit welcome card in `LessonPath`.
- First public ship to Cloudflare Workers (static assets) via a
  dedicated `wrangler.jsonc`. Live at
  https://system-design-quest.vijayaraghavansridevi.workers.dev/

### v0.6.0 — Unit 6 Async and queues
- **Unit 6 — Async and queues.** Five lessons — synchronous vs
  asynchronous work, message queues, pub/sub, idempotency, and
  retries / dead-letter queues — plus a 4-question `finalReview`.
  Real-world scenarios include Amazon checkout, Instagram posts,
  DoorDash order pipelines, Uber pricing events, Slack notifications,
  Stripe webhooks, Stripe idempotency keys, AWS SQS dead-letter
  queues, and Shopify webhook retries. Analogies include a waiter
  taking your order, a factory conveyor belt, a newspaper delivery
  subscription, a light switch vs a toggle button, and mail that
  keeps getting returned.
- Curriculum now runs to 30 lessons / 180 questions + 6 unit reviews
  (24 curated cross-cutting questions).
- Progression test suite's minimum-unit assertion bumped from 5 to 6
  so any future curriculum regression fails immediately.

### v0.5.0 — Visual refresh ("playful but adult")
The app used to look like a Duolingo clone, down to the #58cc02 green.
This release is a full aesthetic overhaul towards an
engineering-tool vibe — GitHub/Figma, not a kids' language app.

- **New palette.** Indigo primary, emerald success, rose danger. Each
  unit has its own accent colour via `src/lib/unit-accents.ts`:
  foundations = sky, networking = violet, scaling = amber, databases
  = teal, caching = pink. Accent flows everywhere that unit appears —
  the lesson path header, the path nodes, the in-lesson progress bar,
  the Unit Review banner.
- **Dark mode.** Tailwind `darkMode: 'class'` plus a
  `theme: 'light' | 'dark' | 'system'` setting persisted in the
  Zustand store. `useTheme()` in `src/lib/theme.ts` syncs the `<html>`
  class and listens to `prefers-color-scheme` when in system mode.
  Every component has `dark:` twins; the header has a three-state
  Sun/Moon/Monitor toggle.
- **Typography.** Inter for everything UI/body, JetBrains Mono for
  technical terms, progress counters, and XP readouts. Self-hosted
  via `@fontsource/inter` and `@fontsource/jetbrains-mono`.
- **Lucide icons replace every emoji.** `Check`, `Star`, `Lock`,
  `Trophy`, `Sparkles`, `Zap`, `RotateCcw`, `Sun`, `Moon`, `Monitor`,
  `Settings`, `X`, `LayoutGrid`, `Building2`, `Lightbulb`, `Server`,
  `Smartphone`, `Database`.
- **Lesson path feels like a path.** `LessonPath.tsx` redesigned as
  a meandering column of circular accent-coloured nodes (alternating
  `ml-0 / ml-12 / ml-20 / ml-12` offsets) connected by a dashed
  accent line, each next to a small lesson card. The current lesson
  has a `animate-pulse-ring` halo in its unit's accent. Unit Review
  nodes are rotated-diamond trophies at the end of each unit.
- **New header.** Sticky with backdrop blur, indigo brand tile,
  `{done} / {total} lessons` progress bar, amber `Zap` XP pill, theme
  cycle button, and a settings menu with click-outside dismissal.
- **Softer, designed celebrations.** `LessonComplete` and
  `UnitComplete` are now tight cards with a `useCountUp` hook easing
  the XP readout from 0 → earned over 600ms. `UnitComplete` has a
  large amber `Trophy` with a subtle `animate-pulse-ring` halo. No
  big coloured slab screens, no emoji.
- **Concept diagrams on intro cards.** New `ConceptDiagram.tsx`
  component with a registry of inline SVG illustrations keyed by
  `lessonId`. Each diagram composes Lucide icons (`Server`,
  `Smartphone`, `Database`) with SVG lines, arrows, and markers, and
  draws its "hot" stroke in the source unit's accent colour.
  `LessonRunner` shows it above the intro card when the lesson has a
  registered diagram — `client-server` (client ↔ server arrows),
  `ip-ports` (building with labelled doors), `vertical-horizontal`
  (one big box vs many small), `what-is-a-database` (client → DB),
  `why-cache` (client → cache → origin). Returns `null` for lessons
  not yet covered, so more can be added lesson-by-lesson without
  touching types or content.
- **Implementation notes.** Foundation work (Tailwind config, store,
  hooks, unit accents lookup) was sequential; the four big component
  redesigns ran as parallel subagents touching disjoint files. The
  `brand` colour token is kept as an alias to indigo for a graceful
  transition of any lingering references.

---

## Out of scope (for now)

- Streaks, hearts/lives, sound effects, animations.
- Accounts / cloud sync (all progress is local to your browser).
- Diagram-based questions, drag-to-order, matching pairs.
- AI-generated lessons.
- Mobile-specific polish (usable on phones, but not tuned).

These are all easy follow-ups — the lesson content is plain TypeScript data,
so adding more units or new question types is largely a content change.
