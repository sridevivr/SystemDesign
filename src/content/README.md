# Authoring lessons

Every lesson in this app must follow these rules. They're enforced partly by
the TypeScript types in `types.ts` and partly by convention.

## The core contract

For every concept we teach, the learner sees **four things** in order:

1. **A plain-language definition** (`intro` field — 1–3 sentences).
2. **A real company scenario** (`examples` — at least 1, target 2).
3. **An everyday analogy** (`analogies` — at least 1).
4. **Questions** — at least 5, mixing `mcq`, `tf`, and `fill`.

The examples and analogies are not decoration. They are the primary
teaching tool. The definition alone is not enough.

## Style rules

1. **Name real companies.** Use products the learner already uses daily:
   Netflix, Instagram, YouTube, Uber, Stripe, Slack, WhatsApp, Amazon,
   Google Maps, Spotify, Discord, Airbnb, DoorDash.
2. **Describe a concrete moment**, not a generic claim.
   - Bad: "Instagram uses servers."
   - Good: "When you tap the heart on an Instagram post, your phone sends
     a tiny message to Instagram's servers saying 'user 123 liked post
     456.'"
3. **Analogies use non-technical everyday things**: restaurants, libraries,
   postal mail, phone calls, highways, filing cabinets, whiteboards.
4. **At least one question per lesson must reference the example or
   analogy by name** (e.g. "In the Netflix example above, which part is
   the client?"). This forces the learner to think back to it.
5. Keep `intro` to 1–3 sentences. The learner is at the very beginning.
   Don't front-load jargon.
