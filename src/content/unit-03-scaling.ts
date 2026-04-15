import type { Unit } from './types';

export const unit03Scaling: Unit = {
  id: 'scaling',
  title: 'Unit 3 — Scale and distribution',
  description: 'How systems grow from one server to many — and stay up.',
  reviewXp: 30,
  lessons: [
    // ---------------------------------------------------------------
    {
      id: 'scaling.vertical-horizontal',
      title: 'Vertical vs horizontal scaling',
      xp: 10,
      intro:
        'When your system gets more load, you have two ways to handle it. Vertical scaling means making one machine bigger — more CPU, more memory. Horizontal scaling means adding more machines that work in parallel.',
      examples: [
        {
          company: 'Stack Overflow',
          scenario:
            'For years Stack Overflow famously ran on a surprisingly small number of very powerful servers — classic vertical scaling. One beefy database server, a handful of big web servers. It works great until the single biggest machine you can buy is not enough.',
        },
        {
          company: 'Netflix',
          scenario:
            'Netflix runs on thousands of relatively ordinary servers across many regions — classic horizontal scaling. No single machine is special. If one dies, its share of the work gets spread across the others and users never notice.',
        },
      ],
      analogies: [
        {
          title: 'One giant chef vs. many regular chefs',
          body: "Vertical scaling is hiring one superhuman chef who can cook 10x faster. It works, but eventually you cannot find a faster chef. Horizontal scaling is hiring 10 regular chefs and giving each of them their own station. If one calls in sick, the other nine keep the kitchen running.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'Which of these is vertical scaling?',
          options: [
            'Adding five more web servers behind a load balancer',
            'Upgrading the database machine from 16 GB of RAM to 128 GB',
            'Moving the app to a different region',
            "Caching database results in Redis",
          ],
          answerIndex: 1,
          explain:
            'Vertical = make one machine bigger. Horizontal = add more machines.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the chef analogy, what does horizontal scaling correspond to?',
          options: [
            'Hiring one superhuman chef',
            'Hiring more regular chefs with their own stations',
            'Firing the slowest chef',
            'Replacing the oven',
          ],
          answerIndex: 1,
          explain:
            'Many independent chefs = many independent servers. If one is out, the others keep going.',
        },
        {
          kind: 'tf',
          prompt:
            'An advantage of horizontal scaling is that you are not limited by the biggest single machine you can buy.',
          answer: true,
          explain:
            'Vertical scaling eventually hits a hardware ceiling. Horizontal scaling can keep going by just adding more boxes.',
        },
        {
          kind: 'fill',
          prompt:
            'Adding more servers that share the load is called ______ scaling.',
          answers: ['horizontal'],
          explain: 'Horizontal = outward (more machines).',
        },
        {
          kind: 'mcq',
          prompt: 'Which scenario is most likely to favor horizontal scaling?',
          options: [
            'A small internal tool used by 20 employees',
            'A global streaming service serving millions of concurrent viewers',
            'A one-off weekend hackathon demo',
            'A static personal blog with 100 visitors a day',
          ],
          answerIndex: 1,
          explain:
            'Horizontal scaling shines when you need far more capacity than any single machine can provide, and when failure of any one node must not take everyone down.',
        },
        {
          kind: 'tf',
          prompt:
            'If one machine in a vertically scaled system fails, the whole service goes down.',
          answer: true,
          explain:
            'That is vertical scaling\'s big weakness: the single machine is a single point of failure.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'scaling.load-balancer',
      title: 'Load balancers',
      xp: 10,
      intro:
        'Once you have many servers doing the same job, you need something that decides which server each incoming request should go to. That is a load balancer — a traffic cop that spreads requests across your pool of servers.',
      examples: [
        {
          company: 'Amazon',
          scenario:
            "Every time you load amazon.com, your request hits one of Amazon's load balancers first. It looks at the pool of healthy web servers, picks one (often the least busy), and forwards your request to it. You never know which specific server answered — and if one server is removed, the next request just goes to a different one without you noticing.",
        },
        {
          company: 'Discord',
          scenario:
            "Discord has millions of people sending messages every second. A load balancer sits in front of its message API and distributes each incoming send/read request across many backend servers. As message volume spikes on a Friday night, the load balancer keeps each server's queue roughly even — no single server gets hammered while others sit idle.",
        },
      ],
      analogies: [
        {
          title: 'Airport security with multiple lanes',
          body: "At airport security you see many identical lanes and a staff member at the front directing each traveler to the shortest line. That person is the load balancer. Without them, everyone would pile into the first lane they saw, and the other lanes would go unused.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is the job of a load balancer?',
          options: [
            'To store data across many disks',
            'To decide which backend server should handle each incoming request',
            'To encrypt user traffic',
            'To cache responses so requests never reach a server',
          ],
          answerIndex: 1,
          explain:
            'Load balancers route incoming traffic across a pool of servers. That is their one core job.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the airport analogy, who represents the load balancer?',
          options: [
            'The travelers',
            'The security lanes',
            'The staff member directing travelers to lanes',
            "The airline's check-in desk",
          ],
          answerIndex: 2,
          explain:
            'The person at the front of the line pointing you to the least-busy lane is exactly what a load balancer does.',
        },
        {
          kind: 'tf',
          prompt:
            'A client usually knows exactly which backend server answered its request.',
          answer: false,
          explain:
            'The client talks to the load balancer. Which backend handled the request is invisible to the client — and often changes from request to request.',
        },
        {
          kind: 'fill',
          prompt:
            'The component that distributes incoming requests across many identical backend servers is called a ______.',
          answers: ['load balancer'],
          explain: 'Load balancer — sometimes abbreviated LB.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why do load balancers only really make sense with horizontal scaling?',
          options: [
            'Because vertical scaling is always faster',
            'Because a load balancer needs many servers to spread work across',
            'Because vertical scaling has no clients',
            'Because load balancers are expensive',
          ],
          answerIndex: 1,
          explain:
            'With only one server, there is nothing to balance across. Load balancing is the natural partner to horizontal scaling.',
        },
        {
          kind: 'tf',
          prompt:
            'If one backend server is removed from the pool, a good load balancer simply stops sending new requests to it and continues serving users from the others.',
          answer: true,
          explain:
            'That ability to transparently route around a missing server is a huge reason load balancers exist in the first place.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'scaling.health-checks',
      title: 'Health checks',
      xp: 10,
      intro:
        'How does the load balancer know which servers are healthy? It asks them. A health check is a simple, repeated "are you OK?" ping sent to each server. If a server stops answering correctly, the load balancer quietly removes it from rotation.',
      examples: [
        {
          company: 'Slack',
          scenario:
            "Slack's infrastructure continuously pings each message-delivery server every few seconds with a small health-check request. If a server starts returning errors — say, because its database connection is broken — the load balancer sees three failed health checks in a row and stops sending it real user traffic. Engineers get paged, the server is replaced, and users never notice anything beyond maybe a single retry.",
        },
        {
          company: 'Cloudflare',
          scenario:
            "Cloudflare sits in front of millions of websites. It constantly probes each origin server (the website's real backend) from multiple locations. If an origin stops responding from several probes, Cloudflare marks it unhealthy and serves a cached or error page instead of sending users to a broken server.",
        },
      ],
      analogies: [
        {
          title: 'A bouncer checking the staff',
          body: "Imagine a bouncer walking around a restaurant every few minutes tapping each cook on the shoulder to check that they are still awake and working. If a cook does not respond three times in a row, the bouncer stops sending orders to their station and tells the manager. The food keeps coming out of the other stations like nothing happened.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is a health check, in load-balancer terms?',
          options: [
            'A nightly backup of the database',
            'A periodic ping to each server to confirm it is still serving requests correctly',
            'An encryption protocol for secure traffic',
            'A test written by developers before deploying',
          ],
          answerIndex: 1,
          explain:
            'Health checks are tiny, constant "are you OK?" requests the load balancer sends to each backend.',
        },
        {
          kind: 'mcq',
          prompt:
            "In the bouncer analogy, what does 'three failed shoulder taps in a row' correspond to?",
          options: [
            'A successful deployment',
            'A threshold of failed health checks, after which the server is taken out of rotation',
            'Routine traffic',
            'A new server joining the pool',
          ],
          answerIndex: 1,
          explain:
            'Production health checks almost always use a threshold (several failures in a row) to avoid over-reacting to a single blip.',
        },
        {
          kind: 'tf',
          prompt:
            "When a server fails its health checks, a good load balancer keeps sending user traffic to it just in case.",
          answer: false,
          explain:
            'The whole point of health checks is the opposite — stop sending traffic to an unhealthy server so users do not see errors.',
        },
        {
          kind: 'fill',
          prompt:
            'A ______ check is a small, repeated request the load balancer sends to each backend to confirm it is still working.',
          answers: ['health'],
          explain: 'Health check. Some systems also call it a liveness probe.',
        },
        {
          kind: 'mcq',
          prompt:
            "Why don't we just use a single failed request to a server as evidence that it is unhealthy?",
          options: [
            'Single requests fail all the time for unrelated reasons — network blips, a momentary garbage collection, a slow disk. You need a threshold to avoid false alarms.',
            'Because load balancers cannot see individual failures',
            "Because servers don't report errors",
            "Because health checks aren't used in practice",
          ],
          answerIndex: 0,
          explain:
            'Flapping in and out of the pool on every blip would be worse than the occasional real fault. Thresholds smooth that out.',
        },
        {
          kind: 'tf',
          prompt:
            'Once a server has been marked unhealthy, health checks can also detect when it becomes healthy again and put it back into rotation.',
          answer: true,
          explain:
            'Health checks are continuous. A server that starts passing again is brought back automatically — no human needed.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'scaling.autoscaling',
      title: 'Autoscaling',
      xp: 10,
      intro:
        'Traffic is not constant. You usually have quiet hours and busy hours. Autoscaling is the system automatically adding more servers when demand goes up, and removing them when demand drops — so you pay for what you actually need.',
      examples: [
        {
          company: 'DoorDash',
          scenario:
            "DoorDash's traffic follows meals. Dinner time on a Friday is roughly 10x the traffic of a Tuesday at 3pm. Their infrastructure autoscales to match: starting around 5pm it spins up hundreds of extra backend servers, and by 11pm it spins most of them back down. They only pay for the capacity they actually used.",
        },
        {
          company: 'Zoom',
          scenario:
            'When the pandemic started, Zoom went from a few million concurrent users to hundreds of millions in a matter of weeks. Autoscaling let them keep adding servers in response to each day\'s new load, rather than trying to pre-provision for a peak nobody had predicted.',
        },
      ],
      analogies: [
        {
          title: 'Opening more checkout lanes',
          body: 'A grocery store with one cashier is fine at 9am. By 5pm the line is out the door. A good manager opens extra lanes when the line gets long and closes them when it gets quiet. Autoscaling is the same idea, but the manager is a program and the lanes are servers.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is autoscaling?',
          options: [
            'Manually provisioning more servers every morning',
            "Automatically adding and removing servers based on the system's current demand",
            'Running one giant server all the time',
            'Restarting the database on a schedule',
          ],
          answerIndex: 1,
          explain:
            'Autoscaling = automatic capacity changes driven by actual load.',
        },
        {
          kind: 'mcq',
          prompt:
            "In the grocery store analogy, what does 'closing a lane when the line gets quiet' correspond to?",
          options: [
            'A security incident',
            'Scaling down — removing servers you no longer need so you stop paying for them',
            'Upgrading a single cashier',
            'Adding a new product aisle',
          ],
          answerIndex: 1,
          explain:
            'Scaling down is half of autoscaling. Systems that only scale up end up paying for idle capacity.',
        },
        {
          kind: 'tf',
          prompt:
            'Autoscaling works well with stateless servers because any new copy can immediately start handling requests.',
          answer: true,
          explain:
            'This is a big reason stateless design matters — autoscaling only really sings when the new server does not need to be carefully loaded with state first.',
        },
        {
          kind: 'fill',
          prompt:
            'Automatically removing unused servers when traffic drops is called scaling ______.',
          answers: ['down', 'in'],
          explain: 'Scaling down (or sometimes "scaling in") is the opposite of scaling up.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why does DoorDash care about scaling down at night, not just up at dinner?',
          options: [
            'To save money — idle servers still cost money even when nobody is using them',
            'To force users to stop ordering',
            'Because servers break if left running',
            'To make the website faster',
          ],
          answerIndex: 0,
          explain:
            'Cloud capacity is usually billed by the minute. Removing unused servers overnight is literally cheaper.',
        },
        {
          kind: 'tf',
          prompt:
            'Autoscaling makes vertical scaling (bigger single machine) unnecessary in every situation.',
          answer: false,
          explain:
            "Plenty of things still live on beefy single machines — some databases, legacy apps, workloads with very chatty in-memory state. Autoscaling helps most for the horizontally-scaled parts of your system.",
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'scaling.multi-region',
      title: 'Multi-region',
      xp: 10,
      intro:
        'Running your whole system in one data center is risky and slow for faraway users. Multi-region means running copies of your system in several physical locations around the world — so users get faster responses, and one region\'s outage does not take everyone down.',
      examples: [
        {
          company: 'Spotify',
          scenario:
            "When you hit play on Spotify from Tokyo, your app does not reach all the way to a data center in Virginia. It talks to Spotify's Asia-Pacific region, which is physically much closer. The round trip is dozens of milliseconds instead of hundreds. Users in Europe hit European regions, and so on.",
        },
        {
          company: 'Slack (us-east-1 outage, 2017)',
          scenario:
            "When a large AWS region (us-east-1) had a big S3 outage in 2017, companies that ran only in that region went dark for hours. Companies that had already gone multi-region could fail over to another region and keep serving users — a vivid demonstration of why multi-region matters for availability.",
        },
      ],
      analogies: [
        {
          title: 'A chain of coffee shops',
          body: "A single coffee shop in one city serves one neighborhood well but is useless if you are across the country. A chain with a shop in every major city gives everyone a nearby shop — and if one location has a bad day and closes, customers can walk to another one.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'Why do large systems run in multiple regions?',
          options: [
            'To deliberately slow down users in one region',
            'For lower latency to distant users and resilience against a single region failing',
            'Because servers only work in specific countries',
            'To make the database smaller',
          ],
          answerIndex: 1,
          explain:
            'The two big reasons: closer = faster, and more locations = harder to take everything down at once.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the coffee shop chain analogy, what does "one location has a bad day and closes" correspond to?',
          options: [
            'A small bug in the code',
            'A region-level outage — users get routed to another, still-healthy region',
            'A new feature being launched',
            "A customer deciding not to buy coffee",
          ],
          answerIndex: 1,
          explain:
            'Losing a region is rare but real. Multi-region architectures treat it as an expected failure mode.',
        },
        {
          kind: 'tf',
          prompt:
            'Serving Tokyo users from a data center in Virginia is usually faster than serving them from Tokyo.',
          answer: false,
          explain:
            'Physical distance costs you latency you cannot fight. Closer is almost always faster when measured in round-trip time.',
        },
        {
          kind: 'fill',
          prompt:
            'Running your system in several physical locations around the world is called ______-region deployment.',
          answers: ['multi'],
          explain: 'Multi-region (as opposed to single-region).',
        },
        {
          kind: 'mcq',
          prompt:
            'What is one tricky thing that becomes harder in a multi-region setup?',
          options: [
            'Everything is simpler',
            'Keeping data consistent across regions — writes in one region have to propagate to the others',
            'Users become faster',
            'Servers never fail',
          ],
          answerIndex: 1,
          explain:
            'Multi-region amplifies consistency questions: if a user writes a message in Tokyo, when exactly do users in London see it? This is a whole topic of its own (we\'ll get into it later).',
        },
        {
          kind: 'tf',
          prompt:
            'A system that is only deployed in one region can still claim to be "highly available" no matter how reliable that single region is.',
          answer: false,
          explain:
            'If your only region goes down, you go down. Truly high availability almost always requires more than one location.',
        },
      ],
    },
  ],
  finalReview: [
    {
      kind: 'mcq',
      prompt:
        'Your web service is a single beefy server that is running out of CPU at peak. Which is usually the better long-term answer?',
      options: [
        'Keep buying bigger single machines forever',
        'Switch to horizontal scaling behind a load balancer so you can add more average-sized servers as demand grows',
        'Remove all caching',
        'Reduce the number of users',
      ],
      answerIndex: 1,
      explain:
        'Vertical scaling eventually runs out of bigger machines. Horizontal scaling + a load balancer is the standard path to growth and to surviving individual server failures.',
    },
    {
      kind: 'mcq',
      prompt:
        'A load balancer notices one of its backend servers has failed health checks three times in a row. What should it do?',
      options: [
        'Keep sending user traffic to it — the check might be wrong',
        'Stop sending new user traffic to that server until it passes health checks again',
        'Shut down every other server',
        'Page the on-call engineer and do nothing until they arrive',
      ],
      answerIndex: 1,
      explain:
        'Routing away from an unhealthy server is exactly the value of health checks. If it recovers later, health checks also bring it back automatically.',
    },
    {
      kind: 'tf',
      prompt:
        'Autoscaling pairs especially well with stateless services, because new server copies can start serving traffic immediately without being carefully loaded with state.',
      answer: true,
      explain:
        'This is one of the biggest practical reasons to design services stateless — you can spin instances up and down freely.',
    },
    {
      kind: 'mcq',
      prompt:
        'Your app is currently hosted in a single region. Which claim is most likely to be TRUE?',
      options: [
        "Users on the other side of the world get noticeably higher latency, and a region-level outage takes your whole service down",
        'You automatically survive any data center outage',
        'You get the lowest possible latency for every user on Earth',
        'You cannot add horizontal scaling',
      ],
      answerIndex: 0,
      explain:
        'Single-region deployments have two classic weaknesses: physical distance hurts distant users, and the single region is a single point of failure.',
    },
  ],
};
