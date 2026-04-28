import type { Unit } from './types';

export const unit09RealWorld: Unit = {
  id: 'real-world',
  title: 'Unit 9 — Real-world designs',
  description:
    'Put it all together. Walk through the design of systems you use every day.',
  reviewXp: 35,
  lessons: [
    // ---------------------------------------------------------------
    {
      id: 'real-world.url-shortener',
      title: 'Designing a URL shortener',
      xp: 10,
      intro:
        "A URL shortener takes a long URL and gives you a short code that redirects to it. It sounds simple, but a production shortener needs to handle billions of redirects, generate unique short codes without collisions, and respond in milliseconds. It is the classic 'starter' system design question because it touches databases, hashing, caching, and scale.",
      examples: [
        {
          company: 'Bitly',
          scenario:
            "Bitly handles billions of link clicks per month. When you create a short link, Bitly generates a unique 7-character code and stores the mapping (short code → long URL) in a database. When someone clicks the short link, Bitly looks up the code, finds the original URL, and returns an HTTP 301 redirect. Because reads vastly outnumber writes, Bitly caches the most popular mappings so most redirects never even hit the database.",
        },
        {
          company: 'TinyURL',
          scenario:
            "TinyURL was one of the earliest URL shorteners. It lets you optionally pick a custom alias ('tinyurl.com/my-cool-link'). Custom aliases add a uniqueness constraint — the system has to check that nobody else has already claimed that code before accepting it. At scale, that check has to be fast and race-condition-free, which usually means a unique index in the database.",
        },
      ],
      analogies: [
        {
          title: 'A coat check',
          body: "You hand over a long, bulky coat and get a short ticket number. Later you present the ticket and get the coat back. The coat check counter is the database mapping ticket → coat. Popular events need a fast lookup system so the queue does not get long — that is caching.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'A URL shortener is heavily read-biased (many more redirects than new link creations). Which technique from earlier units most directly helps with read performance?',
          options: [
            'Sharding the write path',
            'Caching the most popular short-code-to-URL mappings in memory',
            'Using eventual consistency for writes',
            'Adding a circuit breaker',
          ],
          answerIndex: 1,
          explain:
            'When reads vastly outnumber writes, caching the hot entries is the classic first move. Most redirects are served from cache without hitting the database.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Bitly example, what HTTP status code does a redirect typically use?',
          options: ['200 OK', '301 Moved Permanently', '404 Not Found', '500 Internal Server Error'],
          answerIndex: 1,
          explain:
            '301 tells the browser "this URL has permanently moved to the long URL." Some shorteners use 302 (temporary) instead if they want to track every click.',
        },
        {
          kind: 'tf',
          prompt:
            'In the coat check analogy, the ticket number is like the short code and the coat is like the original long URL.',
          answer: true,
          explain:
            'Short token in, long thing out. The mapping table (coat check counter / database) is where the association lives.',
        },
        {
          kind: 'fill',
          prompt:
            'To avoid two users getting the same short code, the database needs a ______ index on the code column.',
          answers: ['unique'],
          explain: 'A unique index ensures no two rows can share the same short code — collisions are rejected at the database level.',
        },
        {
          kind: 'mcq',
          prompt:
            'If the shortener grows to billions of mappings, which technique from Unit 7 would you use to split the data across multiple database machines?',
          options: [
            'Replication only',
            'Consensus (Raft)',
            'Sharding by short code (or a hash of it)',
            'Rate limiting',
          ],
          answerIndex: 2,
          explain:
            'Sharding by the short code distributes the lookup table across machines so no single machine holds the entire mapping.',
        },
        {
          kind: 'tf',
          prompt:
            'A URL shortener is a good example of a system where the core data model is very simple (just a key-value mapping) but the scale and performance requirements are what make the design interesting.',
          answer: true,
          explain:
            'The schema is trivial. The challenge is serving billions of reads per day with low latency, high availability, and no collisions.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'real-world.chat-system',
      title: 'Designing a chat system',
      xp: 10,
      intro:
        "A chat system needs to deliver messages in real time, store them durably, handle millions of concurrent connections, and show who is online. The interesting design tensions are: real-time delivery (WebSockets vs polling), message ordering, read/write patterns that differ wildly between 1-on-1 chats and large group channels, and presence (online/offline status).",
      examples: [
        {
          company: 'WhatsApp',
          scenario:
            "WhatsApp keeps a persistent connection (based on a custom protocol over TCP) between each phone and their servers. When you send a message, it goes to WhatsApp's server, gets stored, and is pushed to the recipient's device over their persistent connection. If the recipient is offline, the message waits on the server until they reconnect. The double-check delivery receipts (sent / delivered / read) are separate lightweight messages flowing back over the same connection.",
        },
        {
          company: 'Slack',
          scenario:
            "Slack uses WebSocket connections for real-time message delivery. When you type in a channel with 500 members, Slack needs to fan the message out to all 500 connected clients — a classic pub/sub problem. Slack also stores every message in a searchable database, so the 'real-time push' and 'durable storage' paths are separate systems working in parallel. The search index is eventually consistent — a message you just sent might take a second to appear in search results.",
        },
      ],
      analogies: [
        {
          title: 'A walkie-talkie network vs. postal mail',
          body: "Real-time chat is like walkie-talkies: both parties hold an open channel and hear each other instantly. Offline message delivery is like postal mail: the letter sits at the post office until the recipient picks it up. Most chat systems do both — instant delivery when online, queued delivery when offline.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'What is the main advantage of WebSockets over HTTP polling for a chat system?',
          options: [
            'WebSockets use less storage',
            'WebSockets keep a persistent connection so the server can push messages instantly, without the client constantly asking "any new messages?"',
            'WebSockets are more secure',
            'WebSockets are simpler to implement',
          ],
          answerIndex: 1,
          explain:
            'Polling wastes bandwidth and adds latency (you only see new messages on the next poll). WebSockets deliver instantly.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Slack example, delivering one message to 500 channel members is an example of which pattern from Unit 6?',
          options: [
            'Rate limiting',
            'Sharding',
            'Fan-out / pub-sub',
            'Circuit breaking',
          ],
          answerIndex: 2,
          explain:
            'One event (message sent) → many subscribers (500 channel members). Classic pub/sub fan-out.',
        },
        {
          kind: 'tf',
          prompt:
            'In the walkie-talkie analogy, offline message delivery (storing messages until the recipient comes back) corresponds to the postal mail part.',
          answer: true,
          explain:
            'Walkie-talkie = real-time push when online. Postal mail = store-and-forward when offline. Chat systems need both paths.',
        },
        {
          kind: 'fill',
          prompt:
            'A persistent, full-duplex connection between client and server that enables real-time push is called a ______.',
          answers: ['websocket'],
          explain: 'WebSocket — the standard protocol for real-time browser-to-server communication.',
        },
        {
          kind: 'mcq',
          prompt:
            'WhatsApp stores undelivered messages on the server until the recipient reconnects. Which earlier concept does this most resemble?',
          options: [
            'A CDN cache',
            'A message queue — the server holds the message until the consumer (recipient) is ready to receive it',
            'A database index',
            'DNS resolution',
          ],
          answerIndex: 1,
          explain:
            'Store-and-forward for offline recipients is essentially a per-user message queue.',
        },
        {
          kind: 'tf',
          prompt:
            "In Slack, the fact that a just-sent message takes a second to appear in search results is an example of eventual consistency between the real-time delivery path and the search index.",
          answer: true,
          explain:
            'The message is delivered instantly via WebSocket (the real-time path) but the search index updates a beat later (eventually consistent).',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'real-world.news-feed',
      title: 'Designing a news feed',
      xp: 10,
      intro:
        "A news feed shows each user a personalized stream of posts from people and pages they follow. The core design question is: do you build the feed when the user asks for it (fan-out-on-read), or pre-build it every time someone posts (fan-out-on-write)? Each approach has sharp trade-offs around latency, storage, and write amplification.",
      examples: [
        {
          company: 'Instagram',
          scenario:
            "Instagram uses a hybrid approach. When a normal user with a few hundred followers posts a photo, Instagram pre-computes the feed entry for each follower and writes it into their feed cache (fan-out-on-write). But when a celebrity with 50 million followers posts, fan-out-on-write would mean 50 million writes per post — so Instagram handles those at read time instead, merging the celebrity's latest posts into your feed when you open the app.",
        },
        {
          company: 'Twitter / X',
          scenario:
            "Twitter's original timeline was purely fan-out-on-write: every tweet was pushed into every follower's timeline cache. This worked until users with millions of followers (like Barack Obama) created massive write amplification. Twitter evolved toward a hybrid: high-follower accounts are merged at read time, while normal accounts are still fan-out-on-write for instant delivery.",
        },
      ],
      analogies: [
        {
          title: 'A newspaper editor assembling the front page',
          body: "Fan-out-on-write is like printing a personalized newspaper for each subscriber overnight — fast to read in the morning but expensive to produce. Fan-out-on-read is like each reader walking into a newsroom and asking an editor to compile their personal edition on the spot — cheap to produce but slow to deliver. Real newspapers (and real feeds) mix both strategies.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is "fan-out-on-write"?',
          options: [
            'Building the feed at read time by querying all followed accounts',
            "Pre-computing each follower's feed entry at the moment a post is created, so reading the feed later is just reading from a pre-built cache",
            'Deleting old posts to save space',
            'A type of database sharding',
          ],
          answerIndex: 1,
          explain:
            'Fan-out-on-write pushes the work to write time. Reads are fast because the feed is already assembled.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why does Instagram NOT fan-out-on-write for a celebrity with 50 million followers?',
          options: [
            'Because celebrities post more often',
            "Because writing 50 million feed entries per post is extremely expensive (write amplification) — it's cheaper to merge celebrity posts at read time",
            'Because celebrities do not use feeds',
            'Because fan-out-on-write is always wrong',
          ],
          answerIndex: 1,
          explain:
            '50M writes per post is a classic case of write amplification making fan-out-on-write impractical. The hybrid approach handles it at read time instead.',
        },
        {
          kind: 'tf',
          prompt:
            'In the newspaper analogy, printing a personalized newspaper overnight for each subscriber corresponds to fan-out-on-write.',
          answer: true,
          explain:
            'The work is done at "write time" (overnight printing). The reader just picks up their pre-built copy in the morning (fast read).',
        },
        {
          kind: 'fill',
          prompt:
            'The problem where one post by a user with millions of followers causes millions of write operations is called write ______.',
          answers: ['amplification'],
          explain: 'Write amplification — one logical write causes many physical writes. The bane of fan-out-on-write at scale.',
        },
        {
          kind: 'mcq',
          prompt:
            'Which earlier concept is most relevant to pre-building and storing each user\'s feed for fast reads?',
          options: [
            'Circuit breakers',
            'Caching — the pre-built feed is essentially a per-user cache that is updated on every new post from someone they follow',
            'Consensus algorithms',
            'DNS resolution',
          ],
          answerIndex: 1,
          explain:
            'A pre-built feed is a cache. It is written when content arrives and read when the user opens the app.',
        },
        {
          kind: 'tf',
          prompt:
            'Most large-scale feed systems use a pure fan-out-on-read or pure fan-out-on-write approach, not a hybrid.',
          answer: false,
          explain:
            'Both Instagram and Twitter evolved toward hybrids: fan-out-on-write for normal users, fan-out-on-read for high-follower accounts. Pure approaches break at extreme scale.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'real-world.rate-limiter',
      title: 'Designing a rate limiter',
      xp: 10,
      intro:
        "You learned what rate limiting IS in Unit 8. Now: how do you actually build one? The key decisions are: which algorithm (token bucket, sliding window, fixed window), where the counters live (in-memory, Redis, a database), and how to make it work across multiple servers so a client cannot bypass the limit by hitting different instances.",
      examples: [
        {
          company: 'Cloudflare',
          scenario:
            "Cloudflare's rate limiting runs at the edge — in hundreds of data centers worldwide. They use a sliding-window algorithm backed by distributed counters. When a request arrives at any Cloudflare edge server, it increments a counter for that client in a fast shared store. If the count exceeds the threshold, the request is rejected with a 429. Because the counter is shared, the client cannot dodge the limit by hitting a different edge location.",
        },
        {
          company: 'Stripe',
          scenario:
            "Stripe rate-limits each merchant's API key separately. They use a token-bucket algorithm: each key starts with a bucket of tokens (say, 100). Every request consumes a token. Tokens refill at a steady rate (say, 25 per second). If the bucket is empty, the request gets a 429. The bucket allows short bursts (up to 100 at once) while still enforcing a long-term average rate (25/sec). Stripe stores bucket state in Redis for speed and cross-server consistency.",
        },
      ],
      analogies: [
        {
          title: 'A water faucet with a flow restrictor',
          body: "A flow restrictor inside a faucet limits how much water can come out per second, no matter how hard you turn the handle. You can turn it on and off quickly for short bursts, but over time the average flow is capped. The restrictor (algorithm) and the pipe (server infrastructure) work together to enforce a maximum throughput.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'In a token-bucket rate limiter, what happens when the bucket is empty?',
          options: [
            'The server crashes',
            'The request is rejected (429) until tokens refill',
            'Tokens are borrowed from another client',
            'The bucket automatically doubles in size',
          ],
          answerIndex: 1,
          explain:
            'Empty bucket = rate exceeded. The client has to wait for tokens to refill before new requests are accepted.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why does Cloudflare use a SHARED counter store rather than per-server counters?',
          options: [
            'Per-server counters are faster',
            'Because a client could bypass the limit by sending requests to different edge servers — a shared counter sees the total across all servers',
            'Shared counters are cheaper',
            'Per-server counters violate HTTP standards',
          ],
          answerIndex: 1,
          explain:
            'Distributed rate limiting requires a global view of each client\'s request count. Per-server counters can be gamed by spreading requests across servers.',
        },
        {
          kind: 'tf',
          prompt:
            'In the faucet analogy, the flow restrictor corresponds to the rate-limiting algorithm (token bucket or sliding window).',
          answer: true,
          explain:
            'The restrictor controls the flow rate regardless of how hard you push. The algorithm controls the request rate regardless of how aggressively the client retries.',
        },
        {
          kind: 'fill',
          prompt:
            'A rate-limiting algorithm where each request consumes a token from a bucket that refills at a steady rate is called a ______ bucket.',
          answers: ['token'],
          explain: 'Token bucket — allows bursts (bucket can be full) while capping long-term average rate (refill rate).',
        },
        {
          kind: 'mcq',
          prompt:
            'Why is Redis a common choice for storing rate-limit counters?',
          options: [
            'Because Redis is a relational database',
            'Because Redis is in-memory and extremely fast for increment-and-check operations, and it is shared across all application servers',
            'Because Redis stores data on disk only',
            'Because Redis is the only option',
          ],
          answerIndex: 1,
          explain:
            'Rate limiting needs fast atomic increments on a shared store. Redis is purpose-built for exactly that workload.',
        },
        {
          kind: 'tf',
          prompt:
            'A token-bucket algorithm allows short bursts above the average rate (using saved-up tokens) as long as the long-term average stays within the limit.',
          answer: true,
          explain:
            "That burstiness is token bucket's key feature. A full bucket lets a client send a burst; the refill rate caps the sustained throughput.",
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'real-world.notification-system',
      title: 'Designing a notification system',
      xp: 10,
      intro:
        "A notification system delivers messages to users across multiple channels — push notifications, email, SMS, in-app badges. The design challenges are: routing each notification to the right channel based on user preferences, handling millions of notifications per minute without delays, deduplicating so users do not get the same alert twice, and degrading gracefully when one channel (say, the SMS provider) is down.",
      examples: [
        {
          company: 'Uber',
          scenario:
            "When your Uber ride is arriving, you get a push notification on your phone AND an SMS if push delivery fails. Uber's notification system decides which channel to use based on your device capabilities and delivery confirmation. If the push notification is acknowledged by your device, the SMS is suppressed. If push fails (maybe the app is force-closed), the SMS fires as a fallback. This multi-channel, priority-based routing happens in near real-time for millions of rides per day.",
        },
        {
          company: 'YouTube',
          scenario:
            "YouTube sends notifications for new uploads, live streams, and comments across push, email, and the in-app notification bell. Users can control preferences per channel and per creator ('all notifications', 'personalized', 'none'). YouTube's system has to respect those preferences at send time, batch email digests efficiently, and deduplicate so you do not get the same 'new video' alert three times if you subscribe on multiple devices.",
        },
      ],
      analogies: [
        {
          title: 'A postal service with multiple delivery options',
          body: "Imagine a postal service that offers regular mail, express courier, and carrier pigeon. When you send a letter, you pick the speed. If the express courier fails (road closed), the service automatically falls back to regular mail. The system tracks whether each letter was delivered to avoid sending duplicates. A notification system works the same way — multiple channels, preference-based routing, fallbacks, and delivery tracking.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'What is the biggest architectural challenge in a notification system?',
          options: [
            'Choosing the right font for the notification text',
            'Routing each notification to the right channel(s) based on user preferences, handling fallbacks when a channel fails, and deduplicating across channels and devices',
            'Storing notifications in a SQL database',
            'Rendering the notification bell icon',
          ],
          answerIndex: 1,
          explain:
            'Multi-channel routing, fallback logic, preference enforcement, and deduplication are what make notification systems genuinely complex.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Uber example, why does the system send an SMS only if the push notification fails?',
          options: [
            'Because SMS is free',
            'To avoid annoying the user with duplicate alerts on multiple channels — push is preferred, SMS is the fallback',
            'Because push notifications do not work on phones',
            'Because Uber only has one notification channel',
          ],
          answerIndex: 1,
          explain:
            'Channel priority + fallback: try the best channel first, fall back to the next one only if it fails. Deduplication prevents double-alerting.',
        },
        {
          kind: 'tf',
          prompt:
            'In the postal service analogy, the express courier failing and the system falling back to regular mail corresponds to a notification system falling back from push to SMS.',
          answer: true,
          explain:
            'Multi-channel fallback: try the fast path, fall back gracefully to a slower but reliable path.',
        },
        {
          kind: 'fill',
          prompt:
            'Ensuring a user does not receive the same notification twice (e.g., on both push and email after a fallback) is called ______.',
          answers: ['deduplication', 'dedup'],
          explain: 'Deduplication — making sure each logical notification is delivered at most once per channel.',
        },
        {
          kind: 'mcq',
          prompt:
            'Which pattern from Unit 6 is most relevant to a notification system that needs to process millions of send requests per minute?',
          options: [
            'Strong consistency',
            'An async message queue — notification requests are published to a queue and workers process them in the background',
            'A database index',
            'A load balancer',
          ],
          answerIndex: 1,
          explain:
            'Notification dispatch is a textbook async workload: accept the send request immediately, queue it, and let workers deliver via push/SMS/email in the background.',
        },
        {
          kind: 'tf',
          prompt:
            "YouTube letting users control notification preferences per creator and per channel means the system must check those preferences at send time, adding complexity but preventing notification fatigue.",
          answer: true,
          explain:
            'Per-user, per-creator, per-channel preferences are a real feature users demand. Enforcing them at scale is a major piece of the notification system design.',
        },
      ],
    },
  ],
  finalReview: [
    {
      kind: 'mcq',
      prompt:
        'You are designing a URL shortener. Reads outnumber writes 100:1. Which combination of techniques from earlier units most directly helps?',
      options: [
        'Sharding writes by short code + caching popular mappings for fast reads',
        'Using eventual consistency for all reads and writes',
        'Running everything on a single server with no cache',
        'Using a circuit breaker on every read',
      ],
      answerIndex: 0,
      explain:
        'Shard the database for capacity, cache popular codes for read speed. Classic read-heavy system playbook.',
    },
    {
      kind: 'mcq',
      prompt:
        'A celebrity with 10 million followers posts on your social network. Why is pure fan-out-on-write problematic here?',
      options: [
        'Because fans do not want to see the post',
        'Because it means 10 million write operations for a single post — extreme write amplification that overwhelms the write path',
        'Because fan-out-on-write is always slower than fan-out-on-read',
        'Because celebrities do not use social networks',
      ],
      answerIndex: 1,
      explain:
        'Write amplification: 1 post → 10M writes. The hybrid approach (fan-out-on-write for small accounts, fan-out-on-read for celebrities) is how Instagram and Twitter solved this.',
    },
    {
      kind: 'tf',
      prompt:
        'A notification system that tries push first, falls back to SMS on failure, and deduplicates across channels is applying concepts from multiple earlier units: async queues, pub/sub, and idempotency.',
      answer: true,
      explain:
        'Async processing (Unit 6), channel-based fan-out (pub/sub, Unit 6), and deduplication (idempotency, Unit 6) all come together in a notification system. This is why the real-world designs unit is a capstone.',
    },
    {
      kind: 'mcq',
      prompt:
        'You need a distributed rate limiter that works across 50 servers. Where should the request counters live?',
      options: [
        'In each server\'s local memory (no sharing)',
        'In a fast shared store like Redis, so all 50 servers see the same count and a client cannot bypass the limit by hitting different servers',
        'In a text file on disk',
        'In the client\'s browser',
      ],
      answerIndex: 1,
      explain:
        'Distributed rate limiting needs a shared, fast, atomic counter store. Redis is the go-to. Per-server counters can be circumvented.',
    },
  ],
};
