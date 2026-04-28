import type { Unit } from './types';

export const unit08DesignPatterns: Unit = {
  id: 'design-patterns',
  title: 'Unit 8 — Design patterns',
  description:
    'Practical engineering moves that keep systems stable under pressure.',
  reviewXp: 30,
  lessons: [
    // ---------------------------------------------------------------
    {
      id: 'patterns.rate-limiting',
      title: 'Rate limiting',
      xp: 10,
      intro:
        'Rate limiting means capping how many requests a client can make in a given time window. It protects your system from being overwhelmed — whether by a buggy script, a surge of traffic, or a deliberate attack.',
      examples: [
        {
          company: 'GitHub',
          scenario:
            "GitHub's REST API allows 60 requests per hour for unauthenticated clients and 5,000 per hour for authenticated ones. If you exceed the limit, you get a 429 Too Many Requests response with a header telling you when the window resets. This stops a single runaway script from hammering their API and degrading service for everyone else.",
        },
        {
          company: 'Twitter / X',
          scenario:
            "Twitter rate-limits tweet creation, timeline reads, and search queries per user. If a bot tries to post 1,000 tweets in a minute, it gets throttled after the first few. This protects Twitter's infrastructure and prevents spam from flooding the platform.",
        },
      ],
      analogies: [
        {
          title: 'A bouncer at a club',
          body: "The bouncer only lets a certain number of people in per hour. If you have already entered three times tonight, you are turned away until the next hour starts. It does not matter who you are — the limit applies. The club stays at a manageable capacity and everyone inside has a good time.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is the purpose of rate limiting?',
          options: [
            'To make every request faster',
            'To cap how many requests a client can make in a time window, protecting the system from overload',
            'To encrypt traffic between client and server',
            'To sort requests by priority',
          ],
          answerIndex: 1,
          explain:
            'Rate limiting is about protection — keeping any single client from consuming more than its fair share of capacity.',
        },
        {
          kind: 'mcq',
          prompt:
            "In the GitHub example, what HTTP status code does a rate-limited client receive?",
          options: ['200 OK', '404 Not Found', '429 Too Many Requests', '500 Internal Server Error'],
          answerIndex: 2,
          explain:
            '429 is the standard HTTP code for "you have sent too many requests." GitHub also includes headers telling you when you can try again.',
        },
        {
          kind: 'tf',
          prompt:
            'In the bouncer analogy, the bouncer enforces a per-person limit regardless of who the person is.',
          answer: true,
          explain:
            'Rate limits are typically per client (per API key, per IP, per user). The system does not care about intent — just volume.',
        },
        {
          kind: 'fill',
          prompt:
            'Capping the number of requests a client can make per time window is called ______ limiting.',
          answers: ['rate'],
          explain: 'Rate limiting — requests per second, per minute, or per hour.',
        },
        {
          kind: 'mcq',
          prompt:
            'Which scenario is rate limiting most useful for?',
          options: [
            'A single user making one request per day',
            'A buggy script accidentally sending 10,000 requests per second to your API',
            'A user reading a static HTML page',
            'A database running a nightly backup',
          ],
          answerIndex: 1,
          explain:
            'Rate limiting shines when a client is sending far more traffic than expected — whether by accident (bug) or on purpose (abuse).',
        },
        {
          kind: 'tf',
          prompt:
            'Rate limiting only protects against malicious attacks and has no value for accidental overload.',
          answer: false,
          explain:
            'Buggy clients, retry storms, and misconfigured cron jobs are far more common causes of overload than deliberate attacks. Rate limiting catches them all.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'patterns.circuit-breaker',
      title: 'Circuit breakers',
      xp: 10,
      intro:
        "A circuit breaker sits between your service and a downstream dependency. If the dependency starts failing repeatedly, the circuit breaker 'trips open' and stops sending requests for a while — giving the failing service time to recover instead of piling on more load.",
      examples: [
        {
          company: 'Netflix (Hystrix)',
          scenario:
            "Netflix built Hystrix, the library that popularized the circuit breaker pattern. If the recommendation service starts timing out, Hystrix trips the circuit open after a threshold of failures. For the next 30 seconds, requests to the recommendation service return a fallback (like a generic 'Top 10' list) instead of waiting for a response that will probably fail. After the cooldown, Hystrix lets a few test requests through. If they succeed, the circuit closes and normal traffic resumes.",
        },
        {
          company: 'Stripe',
          scenario:
            "Stripe integrates with many third-party payment processors worldwide. If a particular processor starts returning errors, Stripe's internal circuit breaker trips and stops routing new charges to that processor for a cooldown period. Charges get routed to an alternative processor or returned with a clear error, rather than piling thousands of doomed requests onto an already-struggling service.",
        },
      ],
      analogies: [
        {
          title: 'An electrical circuit breaker in your house',
          body: "When too much current flows through a circuit — a surge — the breaker trips and cuts the power. This protects the wiring from catching fire. After the problem is fixed, you flip the breaker back on. The software version works the same way: too many failures trip the breaker, stopping traffic. After a cooldown, the system tests whether the problem is resolved before fully restoring traffic.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What does a circuit breaker do when the downstream service starts failing?',
          options: [
            'It retries every request as fast as possible',
            'It stops sending requests to the failing service for a cooldown period, returning a fallback or error instead',
            'It deletes the failing service',
            'It doubles the timeout on every request',
          ],
          answerIndex: 1,
          explain:
            'The breaker "trips open" to protect both the caller AND the failing service. Piling on more requests only makes a struggling service worse.',
        },
        {
          kind: 'mcq',
          prompt:
            "In the Netflix/Hystrix example, what happens during the cooldown period when the recommendation service is down?",
          options: [
            'The entire Netflix site goes offline',
            "Users see a fallback like a generic 'Top 10' list while the recommendation service recovers",
            'Netflix switches to a completely different streaming platform',
            'All user data is deleted',
          ],
          answerIndex: 1,
          explain:
            "A degraded experience (generic list) is far better than no experience (site down). Circuit breakers enable this graceful fallback.",
        },
        {
          kind: 'tf',
          prompt:
            'In the electrical breaker analogy, the breaker trips to protect the wiring from damage — just as a software circuit breaker trips to protect a struggling service from being overwhelmed.',
          answer: true,
          explain:
            'Both cut the flow to prevent cascading damage. Both can be reset once the underlying problem is fixed.',
        },
        {
          kind: 'fill',
          prompt:
            'A pattern that stops sending requests to a failing service after a threshold of errors, giving it time to recover, is called a ______ breaker.',
          answers: ['circuit'],
          explain: 'Circuit breaker — named directly after the electrical component.',
        },
        {
          kind: 'mcq',
          prompt:
            'After a circuit breaker trips, what typically happens next?',
          options: [
            'It stays open forever',
            'After a cooldown period, it lets a few test requests through; if they succeed, it closes and resumes normal traffic',
            'It immediately closes and sends all queued traffic at once',
            'It restarts the entire server',
          ],
          answerIndex: 1,
          explain:
            'The "half-open" state: a few probe requests test whether recovery happened. If yes, close the circuit. If no, keep it open for another cooldown cycle.',
        },
        {
          kind: 'tf',
          prompt:
            'Without a circuit breaker, a failing downstream service can cause cascading failures — the caller waits, ties up its own resources, and starts failing too.',
          answer: true,
          explain:
            'That cascading effect is exactly what circuit breakers prevent. They fail fast so the caller can serve fallbacks instead of hanging.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'patterns.backpressure',
      title: 'Backpressure',
      xp: 10,
      intro:
        "Backpressure is a signal from a consumer to a producer saying 'slow down — I can't keep up.' Instead of the producer blindly flooding the consumer until something breaks, the consumer pushes back and the producer adjusts its pace. It is how healthy systems stay stable under uneven load.",
      examples: [
        {
          company: 'Kafka (consumer lag)',
          scenario:
            "In a Kafka pipeline, if a consumer falls behind and its 'consumer lag' (the gap between the latest message and the last one it processed) grows, monitoring fires an alert. The system can respond by scaling the consumer, pausing the producer, or shedding low-priority messages. The lag metric IS the backpressure signal — it tells the operator the consumer cannot keep up.",
        },
        {
          company: 'TCP flow control',
          scenario:
            "TCP has backpressure built into the protocol. Every TCP receiver tells the sender how much buffer space it has left (the 'receive window'). If the receiver's buffer fills up, the window shrinks to zero and the sender stops transmitting until space opens up. You use this every day without knowing — it is why downloads slow down gracefully instead of crashing your computer.",
        },
      ],
      analogies: [
        {
          title: 'A kitchen telling the waitstaff to slow down',
          body: "If the kitchen is backed up and orders are piling up faster than the cooks can handle them, the head chef tells the waitstaff to stop taking new orders for a few minutes. The dining room might have to wait a bit, but the kitchen does not collapse. Once the backlog clears, orders resume. That is backpressure: the overwhelmed consumer signals the producer to slow down.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is backpressure?',
          options: [
            'A signal from a consumer to a producer saying "slow down, I cannot keep up"',
            'A way to encrypt data in transit',
            'A type of database index',
            'A method for compressing log files',
          ],
          answerIndex: 0,
          explain:
            'Backpressure flows in the opposite direction from data: the consumer tells the producer to reduce its rate.',
        },
        {
          kind: 'mcq',
          prompt:
            "In the Kafka example, what does growing 'consumer lag' indicate?",
          options: [
            'The producer has stopped sending messages',
            'The consumer is falling behind — messages are arriving faster than it can process them',
            'Kafka is running out of disk space',
            'The consumer has processed all messages',
          ],
          answerIndex: 1,
          explain:
            'Consumer lag is the backpressure signal in Kafka. A growing gap between produced and consumed offsets means the consumer needs help.',
        },
        {
          kind: 'tf',
          prompt:
            "In the kitchen analogy, the head chef telling waitstaff to stop taking orders is an example of backpressure.",
          answer: true,
          explain:
            'The overwhelmed consumer (kitchen) sends a signal upstream (waitstaff) to slow the inflow. Classic backpressure.',
        },
        {
          kind: 'fill',
          prompt:
            "TCP's mechanism where the receiver tells the sender how much buffer space remains is called the ______ window.",
          answers: ['receive'],
          explain: 'The receive window — TCP\'s built-in backpressure signal.',
        },
        {
          kind: 'mcq',
          prompt:
            'What happens in a system with NO backpressure when the consumer is slower than the producer?',
          options: [
            'Everything is fine — the system self-balances',
            'Buffers fill up, memory is exhausted, and eventually the system crashes or starts dropping data uncontrollably',
            'The producer automatically speeds up',
            'The consumer automatically speeds up',
          ],
          answerIndex: 1,
          explain:
            'Without backpressure, the producer blindly floods the consumer. Buffers fill, OOM errors fire, things break in ugly ways.',
        },
        {
          kind: 'tf',
          prompt:
            'Backpressure is only relevant for message queues and has no application in network protocols.',
          answer: false,
          explain:
            'TCP flow control is one of the oldest and most important backpressure mechanisms in computing. The concept applies anywhere a producer can outpace a consumer.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'patterns.api-gateway',
      title: 'API gateways',
      xp: 10,
      intro:
        "An API gateway is a single front door that sits between clients and your backend services. Instead of clients talking directly to dozens of internal services, every request goes through the gateway first. It handles cross-cutting concerns — authentication, rate limiting, routing, logging — in one place, so individual services don't each have to implement them.",
      examples: [
        {
          company: 'AWS API Gateway',
          scenario:
            "AWS API Gateway lets you define a public API that maps incoming HTTP requests to Lambda functions, ECS containers, or other AWS services behind the scenes. It handles auth (API keys, JWT validation), throttling, request/response transformation, and CORS — all configured in one place. Your backend services just receive clean, authenticated requests and never deal with that overhead themselves.",
        },
        {
          company: 'Netflix Zuul',
          scenario:
            "Netflix built Zuul as the front door for all API traffic. Every request from a Netflix app on your TV, phone, or browser hits Zuul first. Zuul does authentication, routes the request to the right microservice, applies rate limits, collects metrics, and can even run A/B tests by routing a fraction of traffic to a canary service. The hundreds of microservices behind it never see unauthenticated or unrouted traffic.",
        },
      ],
      analogies: [
        {
          title: 'A hotel concierge',
          body: "Guests do not wander into the kitchen, the laundry room, and the accounting office. They go to the concierge. The concierge checks that they are a real guest, figures out what they need, and routes the request to the right department. If a guest is being unreasonable, the concierge handles it. The internal departments never have to deal with random strangers walking in.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is the primary role of an API gateway?',
          options: [
            'To store data in a database',
            'To be a single entry point that handles cross-cutting concerns (auth, rate limiting, routing) so individual backend services do not have to',
            'To replace all backend services with one monolith',
            'To serve static files like images and CSS',
          ],
          answerIndex: 1,
          explain:
            'The gateway centralizes concerns that every service would otherwise have to implement independently.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Netflix/Zuul example, what does Zuul do BEFORE a request reaches a backend microservice?',
          options: [
            'Nothing — it passes requests through unchanged',
            'Authentication, routing, rate limiting, and metrics collection',
            'It compresses the video stream',
            'It translates the request into a different programming language',
          ],
          answerIndex: 1,
          explain:
            'Zuul is the single checkpoint. By the time a request reaches a microservice, it is already authenticated, routed, and counted.',
        },
        {
          kind: 'tf',
          prompt:
            'In the concierge analogy, the concierge checking that someone is a real guest before routing their request corresponds to authentication at the gateway.',
          answer: true,
          explain:
            'Auth at the gateway means internal services only ever see verified, legitimate requests.',
        },
        {
          kind: 'fill',
          prompt:
            'A single entry point that handles auth, rate limiting, and routing for all backend services is called an API ______.',
          answers: ['gateway'],
          explain: 'API gateway — the front door for your service mesh.',
        },
        {
          kind: 'mcq',
          prompt:
            'What is a key benefit of centralizing rate limiting in an API gateway rather than implementing it in each service?',
          options: [
            'Each service can have its own conflicting rate limits',
            'You implement the logic once in one place instead of duplicating it across every service, and you get a consistent view of each client\'s total traffic',
            'Rate limiting is impossible without a gateway',
            'It makes rate limiting slower',
          ],
          answerIndex: 1,
          explain:
            'Centralizing cross-cutting logic in the gateway avoids duplication, reduces bugs, and gives a global view of traffic.',
        },
        {
          kind: 'tf',
          prompt:
            'An API gateway replaces the need for any backend services — it handles all business logic itself.',
          answer: false,
          explain:
            'The gateway handles infrastructure concerns (auth, routing, throttling). Business logic still lives in the backend services it routes to.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'patterns.load-shedding',
      title: 'Load shedding and graceful degradation',
      xp: 10,
      intro:
        "When a system is overloaded, trying to serve every request equally means everything is slow and many requests fail anyway. Load shedding means deliberately dropping low-priority requests so that high-priority ones still succeed. Graceful degradation means returning a simpler, cheaper response instead of the full one — worse than normal, but far better than an error.",
      examples: [
        {
          company: 'Google Search',
          scenario:
            "Under extreme load, Google can return results from a smaller, cached index instead of the full live index. You still get a search results page — it is just slightly less fresh or comprehensive than usual. Most users never notice. Google decided that a slightly stale answer is infinitely better than a timeout error.",
        },
        {
          company: 'Twitter (the Fail Whale era)',
          scenario:
            "In its early days, Twitter would regularly exceed its capacity and show the famous 'Fail Whale' error page. Over time they built load-shedding systems: under extreme load, Twitter would stop rendering personalized timelines (expensive) and show a cached or trending-only version instead. The site stayed up for the majority of users even when the backend was under severe pressure.",
        },
      ],
      analogies: [
        {
          title: 'An ER triage nurse',
          body: "When the emergency room is overwhelmed, the triage nurse does not try to treat everyone at once. They prioritize life-threatening cases and ask people with minor injuries to wait longer. The ER does not 'crash' — it degrades gracefully by focusing limited resources on what matters most.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is load shedding?',
          options: [
            'Adding more servers to handle load',
            'Deliberately dropping low-priority requests during overload so high-priority ones can still succeed',
            'Shutting down the entire system when load exceeds capacity',
            'Moving the database to a faster disk',
          ],
          answerIndex: 1,
          explain:
            'Load shedding is a deliberate, strategic decision: sacrifice some requests to save the rest.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Google Search example, what does the system do under extreme load?',
          options: [
            'It stops serving results entirely',
            'It returns results from a smaller, cached index — slightly less fresh but still useful',
            'It redirects users to a competitor',
            'It doubles the price of ads',
          ],
          answerIndex: 1,
          explain:
            'That is graceful degradation in action: a cheaper, slightly worse answer is better than no answer.',
        },
        {
          kind: 'tf',
          prompt:
            'In the ER triage analogy, treating life-threatening cases first while asking minor injuries to wait is an example of load shedding / graceful degradation.',
          answer: true,
          explain:
            'Limited resources are directed where they matter most. Low-priority work waits (or is dropped) so critical work continues.',
        },
        {
          kind: 'fill',
          prompt:
            'Returning a simpler, cheaper version of a response instead of failing entirely is called graceful ______.',
          answers: ['degradation'],
          explain: 'Graceful degradation — worse than normal, but still functional.',
        },
        {
          kind: 'mcq',
          prompt:
            "Why is load shedding better than treating all requests equally during overload?",
          options: [
            'It makes all requests equally slow',
            'Because trying to serve everything equally when you are overloaded means EVERYTHING is slow or fails — shedding low-priority work lets high-priority work actually succeed',
            'Load shedding is always cheaper',
            'Users prefer seeing more errors',
          ],
          answerIndex: 1,
          explain:
            'Uniform degradation under overload often means total failure. Strategic shedding preserves the most important work.',
        },
        {
          kind: 'tf',
          prompt:
            "Twitter's evolution from the Fail Whale to serving cached timelines under load is an example of replacing a hard failure with graceful degradation.",
          answer: true,
          explain:
            'A cached/trending timeline is not ideal, but it is infinitely better than a whale-shaped error page.',
        },
      ],
    },
  ],
  finalReview: [
    {
      kind: 'mcq',
      prompt:
        'A buggy client is sending 50,000 requests per second to your API, overwhelming the service for other users. Which pattern directly addresses this?',
      options: [
        'Sharding',
        'Rate limiting',
        'Replication',
        'Eventual consistency',
      ],
      answerIndex: 1,
      explain:
        'Rate limiting caps per-client request volume. The buggy client gets throttled; everyone else is unaffected.',
    },
    {
      kind: 'tf',
      prompt:
        'A circuit breaker and a rate limiter solve the same problem from the same direction.',
      answer: false,
      explain:
        'Rate limiting protects YOUR service from clients. A circuit breaker protects your service from a failing DOWNSTREAM dependency. Same family, different direction.',
    },
    {
      kind: 'mcq',
      prompt:
        'Your system is severely overloaded. You can either serve every request slowly (most will timeout) or drop non-critical requests and serve critical ones at normal speed. The second approach is:',
      options: [
        'Replication',
        'Backpressure',
        'Load shedding / graceful degradation',
        'DNS resolution',
      ],
      answerIndex: 2,
      explain:
        'Strategically dropping low-priority work to keep high-priority work healthy is load shedding.',
    },
    {
      kind: 'mcq',
      prompt:
        'You want to centralize authentication, rate limiting, and routing so your 20 backend microservices do not each have to implement them. Which pattern fits?',
      options: [
        'A dead-letter queue',
        'An API gateway',
        'A read replica',
        'A consensus algorithm',
      ],
      answerIndex: 1,
      explain:
        'An API gateway is the single front door that handles cross-cutting concerns for all services behind it.',
    },
  ],
};
