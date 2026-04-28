# CLAUDE.md

Project context for Claude Code sessions working on System Design Quest.

## What this project is

A gamified web app for learning system design concepts, Duolingo-style. Linear
lesson path, no topic picker. Every lesson teaches via real-world company
examples and everyday analogies, then quizzes. Progress persists in
localStorage. No backend, no accounts.

Live at: https://system-design-quest.vijayaraghavansridevi.workers.dev/

## Tech stack

- **Vite 5 + React 18 + TypeScript** (strict mode)
- **TailwindCSS 3** with `darkMode: 'class'`
- **Zustand 4** with `persist` middleware for state (localStorage key: `sdq.progress.v1`)
- **Lucide React** for icons
- **Inter** (body) + **JetBrains Mono** (code/mono) via `@fontsource`
- **Vitest** + jsdom for unit tests
- Deployed to **Cloudflare Workers** (static assets) via `wrangler.jsonc`

## Commands

```bash
npm run dev       # Start dev server on http://localhost:5173
npm test          # Run vitest suite (must pass before every commit)
npm run build     # tsc -b && vite build (production bundle to dist/)
```

## Before every commit

1. `npx tsc -b` — must produce zero errors
2. `npm test` — all tests must pass
3. `npm run build` — production build must succeed

Do NOT commit if any of these fail. Fix the issue first.

## Project structure

```
src/
├── App.tsx                    # View state machine (home / lesson / review / complete)
├── main.tsx                   # React entry
├── index.css                  # Tailwind + font imports
│
├── content/                   # LESSON CONTENT (pure data, no React)
│   ├── types.ts               # Lesson / Unit / Question / RealWorldExample / Analogy
│   ├── index.ts               # Ordered curriculum array + exports
│   ├── README.md              # Authoring rules (examples + analogies required)
│   └── unit-*.ts              # One file per unit (currently 7 units)
│
├── lib/                       # PURE LOGIC (no React, no side effects)
│   ├── progression.ts         # flattenLessons, lessonStatus, nextLessonId,
│   │                          # selectReviewQuestions, resolveMistakeQuestion,
│   │                          # unitReviewStatus, isLastLessonInUnit, mistakeKey, etc.
│   ├── theme.ts               # useTheme hook (applies dark class to <html>)
│   └── unit-accents.ts        # Per-unit color tokens (border, bg, text for light+dark)
│
├── store/
│   └── progress.ts            # Zustand store: xp, completed, completedReviews,
│                              # mistakes, theme. Actions: completeLesson,
│                              # completeUnitReview, setTheme, reset.
│
├── components/
│   ├── Header.tsx             # Brand mark, lesson count, XP pill, theme toggle, settings
│   ├── LessonPath.tsx         # Home screen: meandering lesson nodes + unit review nodes
│   ├── WelcomeCard.tsx        # Dismissible first-visit onboarding card
│   ├── LessonRunner.tsx       # Drives one lesson: intro → examples → analogies → questions → review Qs
│   ├── LessonComplete.tsx     # "+X XP" celebration with count-up animation
│   ├── UnitReviewRunner.tsx   # End-of-unit review: mistakes + finalReview questions
│   ├── UnitComplete.tsx       # "Unit mastered" celebration
│   ├── ConceptDiagram.tsx     # SVG diagrams shown on intro cards (keyed by lessonId)
│   ├── IntroCard.tsx          # "New concept" card
│   ├── ExampleCard.tsx        # "How {Company} uses this" card
│   ├── AnalogyCard.tsx        # "Think of it like…" card
│   ├── CardShell.tsx          # Shared card chrome (border, shadow, footer slot)
│   ├── QuestionCard.tsx       # Wraps MCQ/TF/Fill with review badge + Continue button
│   └── questions/
│       ├── MultipleChoice.tsx
│       ├── TrueFalse.tsx
│       └── FillBlank.tsx
│
└── __tests__/
    └── progression.test.ts    # 18 tests: unlock logic, review selection, mistake keys,
                               # unit review status, content contract assertions
```

## Content authoring rules

When adding or editing lessons in `src/content/unit-*.ts`:

1. Every lesson MUST have `examples` (tuple, at least 1) and `analogies` (tuple, at least 1).
   The TypeScript types enforce this at compile time via `[X, ...X[]]`.
2. Name **real companies** (Netflix, Instagram, Uber, Stripe, Slack, etc.).
3. Describe a **concrete moment** ("when you tap X", "when the power cuts between two writes"),
   not a generic claim ("X uses servers").
4. Analogies use **everyday, non-technical objects**: restaurants, libraries, mail, highways.
5. At least **one question per lesson must reference the example or analogy by name**.
6. Each lesson has exactly **6 questions** mixing `mcq`, `tf`, and `fill` kinds.
7. Each unit has a `finalReview` with **4 cross-cutting questions** that integrate multiple lessons.
8. Fill-blank `answers` arrays should use **lowercase** (matching is case-insensitive).
9. See `src/content/README.md` for the full style guide.

## Content data model (key types)

```ts
type Question = MCQQuestion | TrueFalseQuestion | FillBlankQuestion;
type Lesson = { id, title, intro, examples: [Ex, ...Ex[]], analogies: [An, ...An[]], questions, xp };
type Unit = { id, title, description, lessons, finalReview?, reviewXp? };
```

## How the lesson flow works

1. **Intro card** → 2. **Example card(s)** → 3. **Analogy card(s)** → 4. **Questions** (6)
→ 5. **Review questions** (1-2 from prior lessons in the same unit, appended automatically
by `selectReviewQuestions` in `progression.ts`) → 6. **Lesson complete** → XP awarded.

After the last lesson of a unit: automatic transition to **Unit Review** (wrong-answer retries
+ `finalReview` questions) → **Unit complete**.

## How progression works

- Lessons are unlocked linearly: lesson N+1 unlocks when lesson N is done.
- Wrong answers during lessons are recorded in `mistakes[unitId]` in the Zustand store.
- `selectReviewQuestions(lessonId, curriculum, 2)` deterministically picks 2 questions
  from prior lessons in the same unit (most-recent-first, rotating index).
- Unit review status: locked until all unit lessons done, then available, then done.
- All progression logic lives in `src/lib/progression.ts` as pure functions — tested.

## Styling conventions

- Primary brand color: **indigo-500** (`#6366f1`)
- Each unit has its own accent color defined in `src/lib/unit-accents.ts`
- Dark mode uses `dark:` Tailwind variants; toggled via `html.dark` class
- Animations: `animate-fade-in` (cards), `animate-pulse-ring` (unit complete trophy)
- Shadows: `shadow-soft` / `shadow-soft-dark` (custom in `tailwind.config.js`)
- Buttons: `rounded-2xl bg-indigo-500 ... hover:bg-indigo-600`
- Cards: `rounded-3xl border border-slate-200 bg-white shadow-soft dark:...`

## Deployment

- Hosted on Cloudflare Workers (static assets mode)
- Config: `wrangler.jsonc` at repo root (assets directory: `./dist`, SPA fallback)
- Auto-deploys on push to `claude/system-design-game-N1eLR`
- Build command on Cloudflare: `npm run build`, output dir: `dist`

## Current curriculum (7 units, 35 lessons)

1. Foundations (client-server, request-response, latency/throughput, availability, stateless/stateful)
2. Networking (IP/ports, DNS, TCP/UDP, HTTP methods, HTTPS)
3. Scale and distribution (vertical/horizontal, load balancers, health checks, autoscaling, multi-region)
4. Databases (what is a DB, tables/rows/queries, indexes, ACID/transactions, SQL vs NoSQL)
5. Caching (why cache, hits/misses, invalidation, LRU eviction, CDNs)
6. Async and queues (sync vs async, message queues, pub/sub, idempotency, retries/DLQs)
7. Distributed systems (replication, sharding, CAP theorem, consistency models, consensus)

Remaining roadmap: Unit 8 (Design patterns), Unit 9 (Real-world designs).

## Git workflow

- Development branch: `claude/system-design-game-N1eLR`
- Always push to this branch unless told otherwise
- Write clear, descriptive commit messages explaining WHY, not just WHAT
- Do NOT create pull requests unless explicitly asked

## Common pitfalls

- **Stream idle timeout on large writes**: Writing a full unit file (~500 lines) in one
  Write call can timeout. Build unit files incrementally: create with lesson 1, then
  append lessons 2-5 via Edit calls.
- **Question component state reuse**: Question components (MCQ/TF/Fill) hold internal
  state. When advancing between questions, they MUST be keyed (e.g. `key={stepIdx}`)
  so React remounts them. Missing keys cause the "stuck question" bug.
- **Zustand persist hydration**: New store fields (like `completedReviews`, `mistakes`)
  get default values from the initial state on first hydration from old localStorage.
  No migration needed as long as defaults are set in the store definition.
- **Cloudflare Workers + Vite 5**: The auto-detect "Vite" framework preset in Cloudflare
  tries to use the new Workers-Vite integration which requires Vite 6+. We bypass this
  with an explicit `wrangler.jsonc` that declares static-assets-only mode.
