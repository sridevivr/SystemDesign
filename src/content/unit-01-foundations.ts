import type { Unit } from './types';

export const unit01Foundations: Unit = {
  id: 'foundations',
  title: 'Unit 1 — Foundations',
  description: 'The very first ideas behind every app you use.',
  reviewXp: 25,
  finalReview: [
    {
      kind: 'mcq',
      prompt:
        'You are describing a chat app at a high level. Which sentence correctly uses the words client and server?',
      options: [
        'The server sends a request and the client replies with a response.',
        'The client sends a request and the server replies with a response.',
        'The client and server each send requests to a third party.',
        'There is no client or server in a chat app.',
      ],
      answerIndex: 1,
      explain:
        'Client asks, server answers. This is the fundamental shape of almost every app.',
    },
    {
      kind: 'tf',
      prompt:
        'A system can have very low latency but still fall over the moment thousands of users hit it at once.',
      answer: true,
      explain:
        'Latency (one request) and throughput (many requests) are independent. Low latency per request says nothing about capacity.',
    },
    {
      kind: 'mcq',
      prompt:
        'Your manager says the new service needs "four nines" of availability. That is closest to how much downtime per year?',
      options: [
        'About 87 hours',
        'About 8 hours',
        'About 53 minutes',
        'About 5 minutes',
      ],
      answerIndex: 2,
      explain:
        '99.99% = 0.01% downtime = roughly 52.6 minutes per year. Each extra nine is ~10x less downtime.',
    },
    {
      kind: 'mcq',
      prompt:
        'Which design is easier to scale horizontally (adding more copies of the same server)?',
      options: [
        'A stateful service that keeps each user session in memory',
        'A stateless service where every request carries what it needs',
        'A service that only accepts one client at a time',
        'A service that stores data only on one physical disk',
      ],
      answerIndex: 1,
      explain:
        'Stateless services can be cloned freely — any copy can handle any request. Stateful services require careful routing to the copy that has your data.',
    },
  ],
  lessons: [
    // ---------------------------------------------------------------
    {
      id: 'foundations.client-server',
      title: 'Client and server',
      xp: 10,
      intro:
        'A client is the device or app that asks for something. A server is a computer somewhere else that answers. Almost every app you use is a conversation between clients and servers.',
      examples: [
        {
          company: 'Netflix',
          scenario:
            "When you open Netflix on your TV, the TV is the client. It asks Netflix's servers 'what should I show on the home row for this user?' Netflix's servers look up your watch history, pick recommendations, and send a list back. The video itself then streams from a different set of servers placed physically close to you.",
        },
        {
          company: 'Instagram',
          scenario:
            "Tapping the heart on a post: your phone (client) sends a tiny message to Instagram's servers saying 'user 123 liked post 456.' The server writes that to a database and replies 'ok.' Your phone then shows the heart filled in. The server is the source of truth — if you reinstall the app, your likes are still there because they live on the server, not the phone.",
        },
      ],
      analogies: [
        {
          title: 'Ordering at a restaurant',
          body: 'You (the client) tell the waiter what you want. The kitchen (the server) actually makes the food and sends it back. You do not need to know how the kitchen works — you just need to know how to order. Many customers can order from the same kitchen at once.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'In the Netflix example, which part is the client?',
          options: [
            "Netflix's recommendation servers",
            'The TV you are watching on',
            'The database of watch history',
            'The CDN edge servers',
          ],
          answerIndex: 1,
          explain:
            'The client is whatever asks for something. The TV is asking "what should I show this user?", so it is the client.',
        },
        {
          kind: 'mcq',
          prompt: 'In the restaurant analogy, what does the kitchen represent?',
          options: ['The client', 'The server', 'The network', 'The database'],
          answerIndex: 1,
          explain:
            'The kitchen actually does the work of making the food and sending it back, just like a server does the work of fulfilling a request.',
        },
        {
          kind: 'tf',
          prompt:
            'When you like an Instagram post, the like is stored only on your phone.',
          answer: false,
          explain:
            'The like is sent to Instagram\'s servers and stored there. That is why your likes survive reinstalling the app — the server is the source of truth.',
        },
        {
          kind: 'mcq',
          prompt: 'Which of these is acting as a client?',
          options: [
            'A database holding user profiles',
            'A web browser loading a page',
            'A backend service answering API calls',
            'A file storage system returning an image',
          ],
          answerIndex: 1,
          explain:
            'A browser loading a page is asking a server for HTML, CSS, images, etc. Asking = client.',
        },
        {
          kind: 'fill',
          prompt:
            'The computer that answers requests from other devices is called a ______.',
          answers: ['server'],
          explain: 'Server: the computer on the other end that responds to requests.',
        },
        {
          kind: 'tf',
          prompt:
            'A single server can only be talking to one client at a time.',
          answer: false,
          explain:
            'Just like one restaurant kitchen can cook for many tables, one server can handle many clients at the same time.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'foundations.request-response',
      title: 'Requests and responses',
      xp: 10,
      intro:
        'Clients and servers talk in a simple pattern: the client sends a request, the server sends back a response. Each request is like a question, and each response is an answer.',
      examples: [
        {
          company: 'Google Maps',
          scenario:
            "When you search 'coffee near me', your phone sends a request to Google's servers with your location and the word 'coffee.' The server runs the search and sends back a response: a list of coffee shops with their names, distances, and ratings. Your phone draws the pins on the map.",
        },
        {
          company: 'Stripe',
          scenario:
            "When a store charges your card, the store's server sends a request to Stripe's servers that says 'charge card ending 4242 for $25.00.' Stripe responds with either 'approved, here is a receipt ID' or 'declined, reason: insufficient funds.' The store shows you the result based on that response.",
        },
      ],
      analogies: [
        {
          title: 'Asking a librarian',
          body: 'You walk up to the desk and ask "do you have The Great Gatsby?" (request). The librarian checks and replies "yes, aisle 4" or "no, all checked out" (response). Every trip to the desk is one request and one response.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'In the Google Maps example, what does the server send back as the response?',
          options: [
            'Just the word "coffee"',
            'A list of coffee shops with names, distances, ratings',
            'The GPS coordinates of your phone',
            'A new map of the entire city',
          ],
          answerIndex: 1,
          explain:
            'The client asked "find me coffee near here", and the server answered with the list of coffee shops.',
        },
        {
          kind: 'tf',
          prompt:
            'In the librarian analogy, the librarian is acting like a server.',
          answer: true,
          explain:
            'You ask a question, the librarian answers. The librarian is playing the server role.',
        },
        {
          kind: 'mcq',
          prompt: 'What usually comes first in a normal interaction?',
          options: [
            'The response',
            'The request',
            'They happen at the same time',
            'Neither — servers just push data whenever',
          ],
          answerIndex: 1,
          explain:
            "The client asks first. The server cannot answer a question it hasn't been asked.",
        },
        {
          kind: 'fill',
          prompt:
            "When the server's answer comes back to the client, we call that a ______.",
          answers: ['response'],
          explain: 'Request goes out, response comes back.',
        },
        {
          kind: 'mcq',
          prompt:
            "In the Stripe example, which of these is part of the server's response?",
          options: [
            'The card number',
            'The store\'s shipping address',
            '"Approved" or "declined"',
            'The customer\'s phone model',
          ],
          answerIndex: 2,
          explain:
            "Stripe's job is to answer 'did the charge go through?' That approved/declined result is the response.",
        },
        {
          kind: 'tf',
          prompt: 'Every request must eventually get some kind of response.',
          answer: true,
          explain:
            "Even an error ('not found', 'unauthorized') is a response. If a request gets no response at all, something went wrong — the client is left hanging.",
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'foundations.latency-throughput',
      title: 'Latency vs throughput',
      xp: 10,
      intro:
        'Latency is how long one request takes. Throughput is how many requests you can handle per second. They sound similar but they are very different things.',
      examples: [
        {
          company: 'YouTube',
          scenario:
            'When you click a video, latency is how long you wait before it starts playing — ideally well under a second. Throughput is how many viewers YouTube can serve at once — billions of video starts per day across the whole system. YouTube cares about both, but they are tuned separately.',
        },
        {
          company: 'Uber',
          scenario:
            "When you tap 'Request ride', latency is how many seconds until you see 'driver found.' Throughput is how many ride requests Uber can process per second globally during a Friday night rush. A fast individual match (low latency) does not automatically mean the system can handle a million people tapping at once (high throughput).",
        },
      ],
      analogies: [
        {
          title: 'Highway traffic',
          body: 'Latency is how long your single car takes to drive from point A to point B. Throughput is how many cars per minute the highway can move in total. A wider highway (more lanes) improves throughput without making any one car faster.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'On YouTube, the time between clicking a video and the first frame appearing is best described as:',
          options: ['Throughput', 'Latency', 'Bandwidth', 'Uptime'],
          answerIndex: 1,
          explain: 'Latency = how long one request takes.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the highway analogy, adding more lanes primarily improves:',
          options: [
            'Latency',
            'Throughput',
            'The speed of each individual car',
            'The distance between cities',
          ],
          answerIndex: 1,
          explain:
            'More lanes mean more cars can travel at once. That is throughput. Any single car is not faster.',
        },
        {
          kind: 'tf',
          prompt:
            'Low latency automatically means high throughput.',
          answer: false,
          explain:
            "Not at all. A system can respond to one request very fast but still fall over when many requests arrive at once. They are independent.",
        },
        {
          kind: 'fill',
          prompt:
            'The number of requests a system can handle per second is called its ______.',
          answers: ['throughput'],
          explain: 'Throughput is volume over time.',
        },
        {
          kind: 'mcq',
          prompt: 'Which scenario describes a throughput problem, not a latency problem?',
          options: [
            'Your search result comes back in 3 seconds instead of 200ms.',
            'The site is fine with 10 users but crashes with 10,000.',
            'A single page takes too long to load first paint.',
            'The video buffers once at the very start.',
          ],
          answerIndex: 1,
          explain:
            'Failing under many concurrent users is a throughput (capacity) issue.',
        },
        {
          kind: 'tf',
          prompt:
            'Uber cares about latency because users hate waiting, and about throughput because a lot of people request rides at the same time.',
          answer: true,
          explain:
            'Real systems care about both — one without the other is not enough.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'foundations.availability',
      title: 'Availability and reliability',
      xp: 10,
      intro:
        'Availability is the percentage of the time a system is up and working. Engineers talk about it in "nines" — 99%, 99.9%, 99.99%. More nines means less downtime per year.',
      examples: [
        {
          company: 'WhatsApp',
          scenario:
            'WhatsApp aims for very high availability — you expect to be able to send a message basically any time. If WhatsApp is down for even 30 minutes, it is global news. Their target is somewhere around 99.99% availability, which works out to less than ~53 minutes of downtime per year.',
        },
        {
          company: 'Amazon',
          scenario:
            "Amazon's checkout service is famously tuned for availability. Every extra minute of downtime on Prime Day can cost millions of dollars in lost orders, so the checkout path is engineered to keep working even when parts of Amazon's own infrastructure are unhealthy.",
        },
      ],
      analogies: [
        {
          title: 'A 24-hour diner',
          body: 'A 24-hour diner advertises "always open." If it is closed even for one hour a month, regulars notice and stop trusting the sign. Availability is exactly this — it is about trust that the system will be there when you need it.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            '99.9% availability means roughly how much downtime per year?',
          options: [
            'About 5 minutes',
            'About 9 hours',
            'About 3.5 days',
            'About a month',
          ],
          answerIndex: 1,
          explain:
            '99.9% = 0.1% downtime. 0.1% of a year is about 8.76 hours. So "three nines" ≈ 9 hours/year.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the diner analogy, a diner that is closed one hour a month would have availability closest to:',
          options: ['100%', '99.9%', '99.86%', '50%'],
          answerIndex: 2,
          explain:
            '1 hour closed out of ~720 hours in a month ≈ 0.14% downtime, which is ~99.86% availability.',
        },
        {
          kind: 'tf',
          prompt:
            'Amazon cares a lot about checkout availability because outages directly cost money.',
          answer: true,
          explain:
            'Every minute of checkout downtime is lost orders. That is why the checkout path gets extreme reliability engineering.',
        },
        {
          kind: 'fill',
          prompt:
            'Engineers informally count availability in "______", e.g. 99.99% is "four of them".',
          answers: ['nines'],
          explain: '"Four nines" = 99.99%.',
        },
        {
          kind: 'mcq',
          prompt: 'Which system probably has the HIGHEST availability target?',
          options: [
            'A personal blog hobby site',
            'A student project due next week',
            "WhatsApp's messaging service",
            'A one-off internal dashboard used once a month',
          ],
          answerIndex: 2,
          explain:
            'Global messaging apps users rely on every minute demand the highest availability.',
        },
        {
          kind: 'tf',
          prompt:
            'Going from 99% to 99.9% to 99.99% each removes most of the remaining downtime, and each step is much harder than the last.',
          answer: true,
          explain:
            'Each extra nine is ~10x less downtime allowed and usually requires significantly more engineering work (redundancy, failover, testing).',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'foundations.stateless-stateful',
      title: 'Stateless vs stateful',
      xp: 10,
      intro:
        'A stateless server does not remember anything about you between requests — each request has to carry everything the server needs. A stateful server does remember — it holds on to information about who you are and what you were doing.',
      examples: [
        {
          company: 'Slack',
          scenario:
            "Slack's web API is mostly stateless: every request your browser sends includes a token that says 'I am user U123 in workspace W456.' The server does not remember you between requests — it re-reads the token each time. That way any Slack server can handle any request.",
        },
        {
          company: 'Discord',
          scenario:
            "Discord's voice chat is stateful: when you join a voice channel, a specific voice server holds on to your audio session. It remembers you are in that channel and knows who to mix your audio with. If that specific server restarts, your connection drops — you feel it.",
        },
      ],
      analogies: [
        {
          title: 'Hotel front desk vs. your personal butler',
          body: 'At a big hotel front desk, every time you walk up you show your room key — they do not remember you from last time. That is stateless. A personal butler, by contrast, already knows your name and preferences — that is stateful. Stateless scales easily (any clerk can help you); stateful is more personal but breaks if the one person who knows you is unavailable.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'A stateless server is one that:',
          options: [
            'Stores all user data in memory forever',
            'Does not remember anything about the client between requests',
            'Cannot handle more than one user at a time',
            'Refuses to respond until it has state',
          ],
          answerIndex: 1,
          explain:
            'Stateless = no memory between requests. Everything needed must come in the request itself.',
        },
        {
          kind: 'mcq',
          prompt:
            "In the Slack example, how does the server know who you are on each request?",
          options: [
            'It remembers you from earlier requests in memory',
            'Each request carries a token identifying the user',
            'It guesses based on your IP address',
            'It asks Slack HQ every time',
          ],
          answerIndex: 1,
          explain:
            'That token-per-request pattern is the trick that lets Slack\'s API stay stateless.',
        },
        {
          kind: 'tf',
          prompt:
            'In the hotel analogy, showing your room key every visit is the stateless pattern.',
          answer: true,
          explain:
            "Each interaction includes everything needed (the key). The clerk doesn't need to remember you.",
        },
        {
          kind: 'fill',
          prompt:
            'Servers that DO keep information about the client between requests are called ______ servers.',
          answers: ['stateful'],
          explain: 'State = remembered information.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why is Discord voice chat naturally stateful?',
          options: [
            'Because each voice packet has to be mixed with other active callers, so the server must remember who is in the call.',
            'Because Discord cannot support more than 10 users.',
            'Because voice chat never uses the network.',
            'Because Discord is written in Rust.',
          ],
          answerIndex: 0,
          explain:
            'The server has to hold live audio state for everyone in the call right now. That is intrinsically stateful.',
        },
        {
          kind: 'tf',
          prompt:
            'Stateless services are usually easier to scale horizontally (add more copies) than stateful ones.',
          answer: true,
          explain:
            'Because any copy can handle any request, you can add servers freely. Stateful services need careful routing so you land on the server that actually has your state.',
        },
      ],
    },
  ],
};
