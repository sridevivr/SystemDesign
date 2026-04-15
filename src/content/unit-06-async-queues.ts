import type { Unit } from './types';

export const unit06AsyncQueues: Unit = {
  id: 'async-queues',
  title: 'Unit 6 — Async and queues',
  description:
    'Work that does not have to happen while the user is waiting. Queues, events, and the dark art of making things eventually happen.',
  reviewXp: 30,
  lessons: [
    // ---------------------------------------------------------------
    {
      id: 'async.sync-vs-async',
      title: 'Synchronous vs asynchronous',
      xp: 10,
      intro:
        "Some work has to happen before you can answer a user's request — you can't return search results before you've run the search. Other work does not — the user does not need to wait while you send them a receipt email. Doing that second kind of work in the background, so the user gets their answer immediately, is the whole idea of asynchronous processing.",
      examples: [
        {
          company: 'Amazon',
          scenario:
            "When you click 'Place order' on Amazon, the page confirms your order within a few hundred milliseconds. But behind the scenes there's a long list of things that still need to happen — the warehouse system needs to reserve stock, a shipping label needs to print, a receipt email needs to send, fraud checks need to run, loyalty points need to update. Almost none of that happens while you're waiting. Amazon accepts the order, tells you 'confirmed', and then the rest fans out asynchronously. If it all had to happen synchronously, placing an order would take 10+ seconds.",
        },
        {
          company: 'Instagram',
          scenario:
            "When you hit 'Post' on Instagram, the post appears on your profile almost instantly. But Instagram still has to generate multiple thumbnail sizes, run content-moderation checks, update your followers' feeds, index the caption and hashtags for search, and maybe notify people you tagged. All of that happens in the background after the initial upload is accepted. The user-facing response is fast because the slow work was moved off the hot path.",
        },
      ],
      analogies: [
        {
          title: 'A waiter taking your order',
          body: "The waiter writes down what you want and walks away immediately. They do not stand at your table until the food is cooked. Cooking happens in the background while the waiter serves other tables. Your food arrives whenever it is ready. You got a fast acknowledgement and the slow part happens somewhere else.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What does "asynchronous" processing mean, in one sentence?',
          options: [
            'The server does nothing until the user refreshes the page',
            'Work that does not need to finish before the response goes back to the user, so it happens in the background',
            'A type of database index',
            'A way to encrypt network traffic',
          ],
          answerIndex: 1,
          explain:
            'Async work is deliberately moved off the request/response path so the user sees a fast answer while the slow stuff happens behind the scenes.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Amazon example, which of these most likely happens ASYNCHRONOUSLY (after the order confirmation is shown)?',
          options: [
            "Validating that your credit card number has the right number of digits",
            'Deciding whether the order button should be enabled at all',
            'Sending the receipt email and notifying the warehouse',
            "Rendering the HTML of the checkout page",
          ],
          answerIndex: 2,
          explain:
            "Receipt emails and warehouse notifications do not need to block the 'order confirmed' response. They're classic examples of work pushed to async.",
        },
        {
          kind: 'tf',
          prompt:
            "In the restaurant analogy, the waiter represents a system doing synchronous work because they do not leave the table until the food is ready.",
          answer: false,
          explain:
            'The waiter walks away immediately after taking the order — that is the asynchronous pattern. The cooking happens in the background.',
        },
        {
          kind: 'fill',
          prompt:
            'Work that happens in the background after a user has already received their response is called ______ work.',
          answers: ['async', 'asynchronous'],
          explain: 'Async / asynchronous — off the hot path.',
        },
        {
          kind: 'mcq',
          prompt:
            "Why would Instagram NOT wait for thumbnail generation before showing your new post on your profile?",
          options: [
            "Because thumbnails are not important",
            "Because doing it synchronously would make the 'Post' button feel much slower to every user, and the thumbnails can land a few seconds later with no real downside",
            "Because Instagram does not use thumbnails",
            "Because thumbnails are generated by the user's phone, not the server",
          ],
          answerIndex: 1,
          explain:
            'Slow background work should not make fast user-facing actions feel slow. Defer it.',
        },
        {
          kind: 'tf',
          prompt:
            'Some work genuinely has to happen synchronously — for example, running the search that produces your search results before the results page can be returned.',
          answer: true,
          explain:
            'Not everything can be async. The rule of thumb: if the user cannot be shown an answer without this step, it has to happen synchronously.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'async.message-queues',
      title: 'Message queues',
      xp: 10,
      intro:
        'A message queue is a component sitting between two parts of a system. One side drops work onto the queue; the other side pulls work off and processes it. The two sides can run at different speeds, and the producer does not have to wait for the consumer to finish.',
      examples: [
        {
          company: 'DoorDash',
          scenario:
            "When you place a DoorDash order, the order goes into a queue that the restaurant's tablet pulls from. If the tablet is slow to acknowledge — maybe it's in a busy kitchen with poor Wi-Fi — the order just sits in the queue until the tablet catches up. Meanwhile DoorDash's servers keep accepting new orders at full speed. The queue decouples the 'accept the order' system from the 'kitchen sees the order' system so neither has to wait on the other.",
        },
        {
          company: 'Uber',
          scenario:
            'Every ride request and ride completion at Uber generates an event. Those events get published onto internal queues, and a whole fleet of downstream services pull from the queues and do different jobs: recalculating surge prices in each neighborhood, updating driver ratings, running fraud checks, updating analytics dashboards. The services that accept new ride requests are never blocked by any of those downstream jobs.',
        },
      ],
      analogies: [
        {
          title: 'A factory conveyor belt',
          body: "Workers upstream place items on the belt at their own pace. Workers downstream pick items off at their own pace. Neither side has to wait for the other. If the downstream workers get briefly slower, items pile up on the belt for a bit — that is fine, the belt is designed to hold a buffer — and nothing gets dropped or lost.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What does a message queue provide, at its core?',
          options: [
            'Encryption of network traffic',
            'A buffer between a producer and a consumer that lets them run at different speeds without blocking each other',
            'A backup of the database',
            'A faster CPU',
          ],
          answerIndex: 1,
          explain:
            "The decoupling is the point. Producers publish; consumers consume; the queue absorbs the difference in their speeds.",
        },
        {
          kind: 'mcq',
          prompt:
            'In the DoorDash example, what happens if a restaurant tablet briefly goes offline?',
          options: [
            "All new orders are rejected",
            'The tablet is removed from DoorDash permanently',
            "The orders continue to pile up safely in the queue, and the tablet pulls them once it's back online",
            "The orders are sent to a random other restaurant",
          ],
          answerIndex: 2,
          explain:
            'That durability is one of the key properties of a good message queue — a temporarily slow consumer does not cause lost work.',
        },
        {
          kind: 'tf',
          prompt:
            'In the conveyor belt analogy, items piling up on the belt for a few seconds is a failure mode that breaks the factory.',
          answer: false,
          explain:
            "That buffering is a feature, not a bug. The belt is designed exactly so that temporary imbalances between upstream and downstream are absorbed safely.",
        },
        {
          kind: 'fill',
          prompt:
            'The component that writes items into a queue is called the ______.',
          answers: ['producer'],
          explain: 'Producer writes to the queue; consumer reads from it.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why is using a queue often better than having the producer call the consumer directly over HTTP?',
          options: [
            "Because HTTP is illegal between servers",
            "Because if the consumer is temporarily down, the direct HTTP call fails and the work is lost, whereas a queue holds the work until the consumer is back",
            'Because queues are always faster',
            'Because HTTP cannot carry data',
          ],
          answerIndex: 1,
          explain:
            'Queues buy you durability and decoupling. Direct synchronous calls tie your fate to the availability of the downstream service at exactly that moment.',
        },
        {
          kind: 'tf',
          prompt:
            "Most production queue systems process messages in roughly the order they were written (FIFO — first in, first out).",
          answer: true,
          explain:
            "FIFO is the default model. Some systems relax ordering for throughput, but the mental model of 'first in, first out' is the place to start.",
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'async.pub-sub',
      title: 'Pub/sub',
      xp: 10,
      intro:
        'Pub/sub — short for publish/subscribe — is a pattern where one event gets published once, and every interested subscriber gets a copy. The publisher does not know or care who is listening. You can add or remove subscribers without touching the publisher.',
      examples: [
        {
          company: 'Slack',
          scenario:
            "When you send a message in a channel, Slack publishes a single 'new message' event. Many different services subscribe to that event: the mobile push notification service, the desktop notification service, the email digest service, the unread-count counter, the search indexer, the analytics pipeline. Slack's message-sending servers have no hardcoded list of those services — each service subscribed itself. Adding a new feature like 'highlight messages that mention me' means adding a new subscriber, not changing the sender.",
        },
        {
          company: 'Stripe',
          scenario:
            "When a payment succeeds at Stripe, Stripe publishes a `payment_intent.succeeded` event. Any app subscribed to that event via a webhook gets notified. A single payment might trigger work in the merchant's order system, their receipt system, their fraud analytics, their loyalty program, and their accounting software — all from one published event. Stripe does not need to know about any of those internal systems. The merchant wires them up on their side as independent subscribers.",
        },
      ],
      analogies: [
        {
          title: 'A newspaper delivery subscription',
          body: 'The newspaper prints one edition each morning. Anyone who subscribed gets a copy delivered. The newspaper does not need to know each subscriber individually — there is a subscription list. Unsubscribing is easy; adding a new subscriber is easy. Every subscriber gets the same content without the publisher doing extra work per subscriber.',
        },
      ],
      questions: [
        {
          kind: 'fill',
          prompt: 'Pub/sub is short for ______/______.',
          answers: ['publish/subscribe', 'publish subscribe', 'publisher/subscriber'],
          explain: 'Publish/subscribe — one side publishes events, the other side subscribes to them.',
        },
        {
          kind: 'mcq',
          prompt:
            'What is the key difference between pub/sub and a plain "producer to consumer" queue?',
          options: [
            'Pub/sub only works for images',
            'Pub/sub lets many different subscribers each receive their own copy of the same event, not just one consumer popping items off a list',
            'Pub/sub never delivers the event',
            "Pub/sub is just a different name for a database",
          ],
          answerIndex: 1,
          explain:
            "A classic queue: one item is processed by one consumer. Pub/sub: one event is delivered to N independent subscribers (sometimes called 'fan-out').",
        },
        {
          kind: 'mcq',
          prompt:
            'In the Slack example, what does the message-sending server need to know about each subscriber?',
          options: [
            'Each subscriber\'s name, location, and current load',
            'Nothing — subscribers register themselves; the sender just publishes the event',
            'Their database passwords',
            'Their exact processing time',
          ],
          answerIndex: 1,
          explain:
            "That decoupling is the whole selling point of pub/sub. The publisher does not maintain a list; subscribers opt in.",
        },
        {
          kind: 'tf',
          prompt:
            'In the newspaper analogy, adding a new subscriber requires the newspaper to rewrite its printing press.',
          answer: false,
          explain:
            'Adding a subscriber just adds to the subscription list. The publisher does not change its own operation. That is exactly how pub/sub keeps subscribers independent of each other.',
        },
        {
          kind: 'mcq',
          prompt:
            'A single Stripe payment event triggering work in 5 different merchant systems is an example of:',
          options: [
            "Database indexing",
            "Fan-out — one event, many subscribers, parallel work",
            "A network outage",
            "Cache invalidation",
          ],
          answerIndex: 1,
          explain:
            '"Fan-out" is the common term for one event going to many subscribers, each doing its own thing.',
        },
        {
          kind: 'tf',
          prompt:
            'Pub/sub is a good fit when several independent downstream systems care about the same event.',
          answer: true,
          explain:
            'That exact shape — one producer, many unrelated consumers — is what pub/sub is built for.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'async.idempotency',
      title: 'Idempotency',
      xp: 10,
      intro:
        "In a distributed system, the same message sometimes gets delivered twice — a retry after a network timeout, a glitch, a replay. Guaranteeing 'exactly once' delivery is nearly impossible. The trick is to design consumers so that processing the same message twice produces the same result as processing it once. That property is called idempotency.",
      examples: [
        {
          company: 'Stripe',
          scenario:
            "When your app asks Stripe to charge a card, you can attach an 'idempotency key' — a unique string you pick for that charge. If your request times out and you retry with the same key, Stripe sees it, realizes it already processed that exact charge, and returns the same result instead of charging the customer a second time. Stripe turned a scary distributed-systems problem (duplicate charges) into a one-line addition to your API call.",
        },
        {
          company: 'An order fulfillment system',
          scenario:
            "Contrast two async jobs a real system might run. (1) 'Send the receipt email' — running it twice is mildly annoying (you get two copies) but nothing breaks. (2) 'Ship the box from the warehouse' — running it twice ships TWO boxes and costs real money. That is exactly why real systems design the fulfillment step idempotently: for example by tracking a processed-orders table and checking it before shipping, so a replayed event does nothing the second time.",
        },
      ],
      analogies: [
        {
          title: 'A light switch vs. a toggle button',
          body: "'Turn the light ON' is idempotent — if you say it twice, the light is still on. 'Toggle the light' is not — saying it twice leaves the light in its original state. Good distributed-system operations are written like 'turn on', not 'toggle' — so that a duplicate delivery is safe.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What does it mean for an operation to be idempotent?',
          options: [
            "It runs very fast",
            'Running it twice with the same input produces the same final state as running it once',
            'It can only run during business hours',
            'It requires no network',
          ],
          answerIndex: 1,
          explain:
            "Idempotent = safe to repeat. The second call is indistinguishable from no call.",
        },
        {
          kind: 'mcq',
          prompt:
            'Why do distributed systems care so much about idempotency?',
          options: [
            "Because networks never fail",
            'Because "exactly once" delivery is essentially impossible, so systems retry on failure — and those retries mean the same message may be delivered more than once',
            "Because it saves money",
            "Because idempotent code is always faster",
          ],
          answerIndex: 1,
          explain:
            'Idempotency is the pragmatic answer to "we cannot guarantee exactly once, so we make sure extra deliveries do not cause damage".',
        },
        {
          kind: 'tf',
          prompt:
            'In the light switch analogy, "toggle the light" is an example of an idempotent operation.',
          answer: false,
          explain:
            'Toggle flips the state every time — calling it twice is NOT the same as calling it once. The "turn on" version is the idempotent one.',
        },
        {
          kind: 'fill',
          prompt:
            'Stripe lets you attach a unique ______ key to a charge request so that retries do not double-charge the customer.',
          answers: ['idempotency'],
          explain: 'Idempotency key — a client-supplied unique ID Stripe uses to detect and ignore duplicate requests.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the fulfillment example, which operation most NEEDS to be idempotent to avoid real-world damage from a duplicate event?',
          options: [
            "Sending the receipt email",
            "Shipping the box from the warehouse",
            "Logging the order to the analytics pipeline",
            "Updating a dashboard counter",
          ],
          answerIndex: 1,
          explain:
            "Shipping the box twice costs real money. Duplicate emails or duplicate log entries are annoying but cheap to recover from. Different operations have very different costs when they are re-run.",
        },
        {
          kind: 'tf',
          prompt:
            'A good rule of thumb for async systems is: assume messages may be delivered more than once, and design your consumers so that extra deliveries are safe.',
          answer: true,
          explain:
            "That is basically the core design principle for any realistic async pipeline.",
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'async.retries-dlq',
      title: 'Retries and dead-letter queues',
      xp: 10,
      intro:
        "When a queue consumer fails to process a message — maybe the downstream service is briefly down, maybe the message is malformed — most systems retry it a few times with a growing delay between attempts. If it keeps failing, the message is moved to a separate 'dead-letter queue' (DLQ) so it does not jam up the main queue, and engineers can investigate it later without blocking the rest of the pipeline.",
      examples: [
        {
          company: 'AWS SQS',
          scenario:
            "Most production systems that use AWS SQS configure a max-receive-count of 3 or 5. If the same message fails to process that many times in a row, SQS automatically moves it to a dead-letter queue. Engineers get paged when the DLQ is non-empty; they look at the bad messages, fix the underlying bug or bad data, and either replay the messages or drop them. The main queue keeps flowing the whole time because no single poison message can stall it.",
        },
        {
          company: 'Shopify',
          scenario:
            "When Shopify needs to deliver a webhook to a merchant's app and the app returns an error, Shopify retries — first after a few seconds, then with longer and longer gaps (exponential backoff). If the merchant's app never comes back up after a while, Shopify eventually gives up and marks the webhook as failed, so resources are not tied up indefinitely on a broken endpoint. The merchant can see the failed webhook later and replay it manually.",
        },
      ],
      analogies: [
        {
          title: 'Mail that keeps getting returned',
          body: 'The post office tries to deliver a letter. Nobody home — try again tomorrow. Still nobody — try next week. After several attempts, the letter gets moved to a dead-letter office for special handling. The post office does not just keep trying the same letter forever, because that would clog the normal delivery pipeline. Other letters still get delivered on time.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What does a "dead-letter queue" hold?',
          options: [
            "Messages that have been successfully processed",
            'Messages that repeatedly failed processing and have been pulled aside for manual investigation',
            "Test messages from developers",
            "Encrypted messages waiting for a key",
          ],
          answerIndex: 1,
          explain:
            'A DLQ is a separate queue that collects the "problem children" — messages that repeatedly failed — so the main queue can keep flowing.',
        },
        {
          kind: 'mcq',
          prompt:
            "Why not just keep retrying a failing message forever?",
          options: [
            "Retrying is expensive on the network",
            "Because a single poison message could block the rest of the queue behind it and keep wasting resources, so you need to set it aside after a limit",
            "Because retries are illegal",
            "Because queues can only hold 10 messages",
          ],
          answerIndex: 1,
          explain:
            'A "poison" message that cannot be processed blocks everything behind it if you keep retrying it in place. Moving it to a DLQ after a cap frees the main pipeline.',
        },
        {
          kind: 'tf',
          prompt:
            'Retries in real systems usually wait longer and longer between attempts (exponential backoff) instead of hammering the downstream service immediately.',
          answer: true,
          explain:
            'Immediate retries in a tight loop can make an already-struggling downstream service worse. Exponential backoff gives it time to recover.',
        },
        {
          kind: 'fill',
          prompt:
            'The short name for a queue that holds messages which have failed processing too many times is ______.',
          answers: ['dlq', 'dead-letter queue', 'dead letter queue'],
          explain: 'DLQ — dead-letter queue.',
        },
        {
          kind: 'mcq',
          prompt:
            "In the mail analogy, the 'dead-letter office' corresponds to which concept from this lesson?",
          options: [
            "Exponential backoff",
            "Idempotency",
            "A dead-letter queue",
            "A load balancer",
          ],
          answerIndex: 2,
          explain:
            "A dead-letter office for undeliverable mail is literally where the term 'dead-letter queue' comes from.",
        },
        {
          kind: 'tf',
          prompt:
            'In the Shopify example, a webhook that keeps failing is eventually given up on so that Shopify does not tie up resources forever on a broken endpoint.',
          answer: true,
          explain:
            'Any reasonable retry system has a ceiling. Infinite retries are almost always the wrong answer.',
        },
      ],
    },
  ],
  finalReview: [
    {
      kind: 'mcq',
      prompt:
        'You are redesigning a checkout flow that currently waits synchronously to send a receipt email before confirming the order. What is the best fix?',
      options: [
        'Remove receipts entirely',
        "Publish an 'order placed' event to an async queue so the email service picks it up afterward — the user gets an instant confirmation and the email still goes out",
        'Upgrade the email server to be much faster',
        "Ask the user to email themselves",
      ],
      answerIndex: 1,
      explain:
        'Classic async pattern: accept the order, confirm immediately, and let the email happen in the background. The user does not care when exactly the email goes out as long as it eventually does.',
    },
    {
      kind: 'mcq',
      prompt:
        'You are adding a new feature that needs to react to "user signed up" events, and two other unrelated services also react to the same event. Which pattern fits?',
      options: [
        'A single synchronous HTTP chain from one service to the next',
        'Pub/sub — each service subscribes independently and gets its own copy of the event',
        'Put everything in one giant function',
        'Email the developers the events',
      ],
      answerIndex: 1,
      explain:
        'Multiple independent reactions to the same event is exactly what pub/sub is for. Each subscriber is independent and new ones can be added without touching the publisher.',
    },
    {
      kind: 'tf',
      prompt:
        'If a queue consumer is designed so that replaying the same message a second time produces the same result as processing it once, that consumer is idempotent — which is the recommended design in realistic async systems because extra deliveries can and do happen.',
      answer: true,
      explain:
        'Idempotency is the pragmatic answer to the impossibility of true "exactly once" delivery.',
    },
    {
      kind: 'mcq',
      prompt:
        "A single 'poison' message keeps failing to process in your main queue. Without any special handling, what is the biggest danger?",
      options: [
        'The message might be slightly delayed',
        'The message blocks the rest of the queue behind it (or gets retried forever, wasting resources) until someone notices',
        'The queue becomes faster',
        'The message is automatically deleted and lost',
      ],
      answerIndex: 1,
      explain:
        "That is exactly why dead-letter queues exist — move the stuck message aside after a retry limit so the main pipeline keeps flowing.",
    },
  ],
};
