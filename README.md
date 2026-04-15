# System Design Quest

A local, gamified web app for learning system design one small concept at a
time — Duolingo, but for the fundamentals that power every app you use.

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

### Roadmap (not yet authored)
- Unit 4 — Databases (SQL vs NoSQL, indexing, ACID, transactions)
- Unit 5 — Caching (strategies, eviction, CDNs)
- Unit 6 — Async & queues (pub/sub, idempotency)
- Unit 7 — Distributed systems (replication, sharding, CAP, consistency)
- Unit 8 — Design patterns (rate limiting, circuit breakers)
- Unit 9 — Real-world designs (URL shortener, chat, feed)

---

## Tech stack

- **Vite + React 18 + TypeScript** — fast dev server, strict types.
- **TailwindCSS** — styling without bespoke CSS.
- **Zustand** with the `persist` middleware — app state saved to
  `localStorage` under the key `sdq.progress.v1`.
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
│   └── unit-03-scaling.ts
│
├── lib/
│   └── progression.ts         # pure helpers: flatten, next, status,
│                              # selectReviewQuestions, resolveMistakeQuestion,
│                              # unitReviewStatus, isLastLessonInUnit, ...
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
│   ├── UnitComplete.tsx       # "Unit complete" celebration
│   ├── IntroCard.tsx
│   ├── ExampleCard.tsx        # "How Netflix uses this →"
│   ├── AnalogyCard.tsx        # "Think of it like: ..."
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

---

## Out of scope (for now)

- Streaks, hearts/lives, sound effects, animations.
- Accounts / cloud sync (all progress is local to your browser).
- Diagram-based questions, drag-to-order, matching pairs.
- AI-generated lessons.
- Mobile-specific polish (usable on phones, but not tuned).

These are all easy follow-ups — the lesson content is plain TypeScript data,
so adding more units or new question types is largely a content change.
