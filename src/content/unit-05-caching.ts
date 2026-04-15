import type { Unit } from './types';

export const unit05Caching: Unit = {
  id: 'caching',
  title: 'Unit 5 — Caching',
  description:
    "Don't do work you've already done. The art of making the second request fast.",
  reviewXp: 30,
  lessons: [
    // ---------------------------------------------------------------
    {
      id: 'caching.why-cache',
      title: 'Why cache?',
      xp: 10,
      intro:
        'A cache is a small, fast copy of data placed close to whoever needs it. If the same question gets asked again and again, you can answer from the cache instead of redoing the slow work.',
      examples: [
        {
          company: 'YouTube',
          scenario:
            "YouTube video thumbnails are cached close to viewers. The very first time a thumbnail is shown, it might come from a distant server. After that, copies sit on cache servers nearer to you, so loading your home feed feels instant even though the original image lives far away.",
        },
        {
          company: 'Wikipedia',
          scenario:
            "Almost everyone reads Wikipedia articles — very few people edit them. Wikipedia takes advantage of that by rendering an article once and caching the rendered page. When the next reader asks for it, the server hands out the pre-built copy in milliseconds instead of rebuilding the page from scratch.",
        },
      ],
      analogies: [
        {
          title: 'A snack in your desk drawer',
          body: 'The first time you want a snack, you walk all the way to the kitchen and put some in your drawer. After that, every time you get hungry you just open the drawer — fast and local. The drawer is your cache: slower to fill the first time, much faster to grab from once it is filled.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is a cache?',
          options: [
            'A backup of data in case of a disaster',
            'A small, fast copy of data placed close to whoever needs it',
            'A permanent replacement for the database',
            'A type of encryption',
          ],
          answerIndex: 1,
          explain:
            "A cache is a fast copy held close to the consumer — it does not replace the source of truth, it just saves you a trip to it.",
        },
        {
          kind: 'mcq',
          prompt:
            'In the YouTube thumbnails example, why is caching a win?',
          options: [
            'Because YouTube servers cannot draw images',
            'Because the same thumbnails get requested over and over by many viewers — the second, third, hundredth request can come from a nearby copy instead of the original server',
            'Because caching encrypts the images',
            'Because YouTube runs on a single server',
          ],
          answerIndex: 1,
          explain:
            "Caching helps most when the same answer is computed many times. Popular thumbnails are a perfect fit.",
        },
        {
          kind: 'tf',
          prompt:
            'Wikipedia rebuilds each article page from scratch every single time someone reads it.',
          answer: false,
          explain:
            "Because the read-to-write ratio is enormous, Wikipedia caches rendered articles and serves the cached copy to the next reader. Rebuilding every time would be wasteful.",
        },
        {
          kind: 'fill',
          prompt:
            "In the desk-drawer analogy, the drawer — the fast, nearby copy — represents the ______.",
          answers: ['cache'],
          explain: 'Cache: a small, fast copy close to you.',
        },
        {
          kind: 'mcq',
          prompt:
            'Which of these workloads benefits MOST from caching?',
          options: [
            'A workload where every request computes a unique, one-of-a-kind answer',
            'A workload where the same few answers are computed over and over again',
            'A workload that only does writes, never reads',
            'A workload with a single user making one request per day',
          ],
          answerIndex: 1,
          explain:
            'Caching only pays off when the same work is done repeatedly. If every request is unique, there is nothing to reuse.',
        },
        {
          kind: 'tf',
          prompt:
            'Caches are usually faster to read from than the source of truth they sit in front of.',
          answer: true,
          explain:
            "That is the whole point. A cache trades some freshness (it might be a little behind) for a big speed improvement.",
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'caching.hits-misses',
      title: 'Cache hits and misses',
      xp: 10,
      intro:
        "When you ask a cache for something and it has it, that's a hit. When it doesn't, that's a miss — the system has to go to the slow source, fetch the answer, and usually put it in the cache for next time.",
      examples: [
        {
          company: 'Instagram',
          scenario:
            "The first time you open a friend's profile, their photos are not in your phone's cache yet. That is a miss — Instagram has to fetch them from its servers. The next time you open that same profile, the photos are already cached locally, so it is a hit and the profile pops in almost instantly. That difference is why the second visit feels so much faster than the first.",
        },
        {
          company: 'Spotify',
          scenario:
            "Spotify caches your 'recently played' row on the phone itself. Swipe away from the app and come back and the row is still there — a hit. No need to ask Spotify's servers for it again. If you close the app for a long time and come back, it may have been cleared and Spotify fetches it fresh — a miss.",
        },
      ],
      analogies: [
        {
          title: 'Looking up a phone number',
          body: "The first time you want to call a friend you have to look them up in a directory — that is a miss. Next time you remember the number, so you can dial it instantly — that is a hit. Numbers you dial often become easy to remember; numbers you've never called are always a miss.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is a cache "hit"?',
          options: [
            'When the cache is destroyed',
            "When the cache has the answer you're asking for and returns it immediately",
            'When the cache is full',
            'When the network is down',
          ],
          answerIndex: 1,
          explain: 'Hit = the cache has it. Miss = it does not.',
        },
        {
          kind: 'fill',
          prompt:
            "When the cache does not have what you're asking for, you call that a cache ______.",
          answers: ['miss'],
          explain:
            'Miss — the system has to fall back to the slow source of truth.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Instagram example, why does a friend\'s profile load faster the second time?',
          options: [
            'Because Instagram chooses to slow down first visits on purpose',
            "Because the photos are already cached on your phone from the first visit, so the second load is a hit",
            'Because your phone gets a different IP address',
            "Because Instagram's servers remember you specifically",
          ],
          answerIndex: 1,
          explain:
            'The cache was empty the first time (miss), then got populated, so the second request is a hit and is much faster.',
        },
        {
          kind: 'tf',
          prompt:
            'A cache miss is usually slower than a cache hit for the request that missed.',
          answer: true,
          explain:
            "A miss falls through to the real source. That is almost always slower than reading from the cache.",
        },
        {
          kind: 'mcq',
          prompt:
            'In the phone-number analogy, remembering your friend\'s number and dialing it directly corresponds to:',
          options: [
            'A cache miss',
            'A cache hit',
            'A full table scan',
            'A DNS lookup',
          ],
          answerIndex: 1,
          explain:
            'You had the answer locally and didn\'t need the directory — that is a hit.',
        },
        {
          kind: 'tf',
          prompt:
            'After a miss, a good cache usually remembers the answer so the next identical request becomes a hit.',
          answer: true,
          explain:
            "That 'fetch once, serve many' behaviour is most of what makes caching worthwhile.",
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'caching.invalidation',
      title: 'Cache invalidation',
      xp: 10,
      intro:
        "Cached data can go stale: the real source has changed but the cache still has the old copy. Invalidation is the problem of deciding when to remove or update cached entries. Phil Karlton's famous line sums it up: \"There are only two hard things in computer science: cache invalidation and naming things.\"",
      examples: [
        {
          company: 'Twitter / X',
          scenario:
            "When you change your display name on Twitter, there are cached copies of your old name scattered across tweets, mentions, search results, and notifications. Twitter has to go find and invalidate all of those. If they miss one, your old name will suddenly pop up in some corner of the app even though you changed it yesterday.",
        },
        {
          company: 'Stripe',
          scenario:
            "Stripe caches things that change slowly, like foreign-exchange rates, for a few minutes at a time. But Stripe deliberately does NOT cache card-decline results — a card that was declined a minute ago might be fine now, and serving a stale 'declined' would annoy real customers. Different data gets cached differently.",
        },
      ],
      analogies: [
        {
          title: 'Printed paper menus',
          body: "The kitchen decides at 2pm that it is out of salmon. Now every printed menu in every server's hand is wrong. Updating them all in sync is surprisingly hard — someone has to walk around and swap them. The more copies of the menu are out in the world, the harder it is to keep them consistent with the real kitchen.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is "stale" data in a cache?',
          options: [
            'Data that has been encrypted',
            "Data that used to be correct but the source has changed since — the cache still has the old value",
            'Data that is the wrong file format',
            'Data that no one has ever looked at',
          ],
          answerIndex: 1,
          explain:
            'Stale = the cache has an older value than the source of truth has right now.',
        },
        {
          kind: 'mcq',
          prompt:
            'Phil Karlton is famous for saying there are only two hard things in computer science. What are they?',
          options: [
            'Naming things and debugging things',
            'Cache invalidation and naming things',
            'Testing and deploying',
            'Databases and networks',
          ],
          answerIndex: 1,
          explain:
            '"There are only two hard things in computer science: cache invalidation and naming things." It is a joke, but it is also very real.',
        },
        {
          kind: 'tf',
          prompt:
            'In the Twitter display-name example, a bug where your old name still shows up in one corner of the app is an example of incomplete cache invalidation.',
          answer: true,
          explain:
            "One of the cached copies did not get updated when you changed your name. The source of truth changed; the cache lagged.",
        },
        {
          kind: 'mcq',
          prompt:
            'In the restaurant menu analogy, "updating all the printed menus when the kitchen runs out of salmon" corresponds to:',
          options: [
            'Adding a new dish to the menu',
            'Invalidating every cached copy of now-wrong data',
            'Building a brand new restaurant',
            'Ignoring the change',
          ],
          answerIndex: 1,
          explain:
            'The more copies of the data are out in the world, the harder it is to keep them consistent with the real source — that is exactly what makes invalidation tricky.',
        },
        {
          kind: 'tf',
          prompt:
            'Stripe caches card-decline results aggressively because they rarely change.',
          answer: false,
          explain:
            "Stripe specifically does NOT cache declines. A card that was declined a minute ago might be valid now — serving a stale 'declined' would be worse than re-checking.",
        },
        {
          kind: 'fill',
          prompt:
            'Removing a now-incorrect entry from the cache (or marking it so the next read fetches fresh data) is called cache ______.',
          answers: ['invalidation'],
          explain:
            'Invalidation — the process of saying "this cached value is no longer trustworthy."',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'caching.eviction-lru',
      title: 'Eviction: LRU',
      xp: 10,
      intro:
        'Caches have limited memory. When they fill up, you have to kick something out to make room for new entries. LRU — Least Recently Used — is the classic policy: evict whatever has been touched longest ago, on the theory that whatever you used recently you will probably use again.',
      examples: [
        {
          company: 'Netflix',
          scenario:
            "Your phone and TV keep a small local cache of the shows you've been watching — the next episode of your current series, your continue-watching row, thumbnails of things you keep clicking on. A series you started in January and abandoned by February gets evicted from that local cache first when space is tight. The show you watched five minutes ago stays.",
        },
        {
          company: 'Your computer\'s DNS cache',
          scenario:
            "Your laptop caches DNS answers so every webpage doesn't trigger a fresh DNS lookup. Domains you visit all day (google.com, your email provider) stay comfortably in the cache. A domain you visited once two weeks ago gets pushed out when newer entries need the room.",
        },
      ],
      analogies: [
        {
          title: 'Your kitchen counter',
          body: "You leave the things you're using today — the cutting board, the salt, the coffee maker — out on the counter. When it gets cluttered, you put things away. And you always put away whatever you've touched least recently: the rolling pin from last weekend, not the kettle from five minutes ago.",
        },
      ],
      questions: [
        {
          kind: 'fill',
          prompt: 'LRU stands for ______.',
          answers: ['least recently used'],
          explain:
            'Least Recently Used — evict whatever has not been touched in the longest time.',
        },
        {
          kind: 'mcq',
          prompt: 'When is an eviction policy needed at all?',
          options: [
            'Always, even in infinite-memory caches',
            'Only when the cache has limited memory and must free space for new entries',
            'Only during network outages',
            'Only on Tuesdays',
          ],
          answerIndex: 1,
          explain:
            'If the cache could hold everything forever there would be nothing to evict. Eviction is how finite caches decide what to kick out.',
        },
        {
          kind: 'mcq',
          prompt:
            'Under LRU, which item gets evicted first when the cache is full?',
          options: [
            'The item most recently used',
            'A random item',
            'The item that has been idle the longest',
            'The largest item',
          ],
          answerIndex: 2,
          explain:
            'LRU assumes recency is a good predictor of future use, so it kicks out whatever has been untouched longest.',
        },
        {
          kind: 'tf',
          prompt:
            "In the kitchen counter analogy, the coffee maker you used five minutes ago is exactly the thing you'd put away first.",
          answer: false,
          explain:
            'LRU would put away the thing you touched least recently — the rolling pin from last weekend, not the coffee maker you just used.',
        },
        {
          kind: 'mcq',
          prompt:
            "In the Netflix example, why does a show you abandoned months ago get evicted from the device cache before the show you watched last night?",
          options: [
            'Because Netflix dislikes unfinished shows',
            'Because LRU evicts what was touched longest ago, and you have not touched the abandoned show in months',
            'Because the abandoned show is larger',
            'It is random',
          ],
          answerIndex: 1,
          explain:
            'The show watched last night has very recent use; the abandoned show has very old use. Under LRU, old use gets evicted first.',
        },
        {
          kind: 'tf',
          prompt:
            "LRU works well when recent access is a good predictor of future access — which it often is for real workloads.",
          answer: true,
          explain:
            "Lots of real traffic is 'bursty': the thing you looked at just now is the thing you're likely to look at again. That is exactly what LRU is tuned for.",
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'caching.cdn',
      title: 'CDNs',
      xp: 10,
      intro:
        "A CDN — Content Delivery Network — is a globally distributed cache for the internet. Instead of every user in the world fetching images, CSS, and videos from your origin server, thousands of cache servers scattered around the planet hold copies close to viewers. Most web traffic you see in a day is answered by a CDN, not the original site.",
      examples: [
        {
          company: 'Netflix Open Connect',
          scenario:
            "Netflix physically places their own cache hardware — called Open Connect appliances — inside internet providers' networks. When you hit play on a show, the bytes often travel just a few miles from a nearby Open Connect box to your TV, instead of thousands of miles across the internet from a central data center. That is how Netflix can stream high-quality video to hundreds of millions of people at once without choking.",
        },
        {
          company: 'Cloudflare',
          scenario:
            "Cloudflare runs the world's largest general-purpose CDN, with hundreds of points of presence around the planet. Countless small and medium websites sit behind it — images, CSS, scripts, and even HTML are served from whichever Cloudflare location is closest to each visitor. If the original server goes down for a minute, many requests are still served happily from the CDN cache.",
        },
      ],
      analogies: [
        {
          title: 'A chain bookstore',
          body: "A publisher prints a book once and then ships copies to bookstores in every major city. A reader in Boise does not order directly from the publisher — they walk to the nearest store. A CDN is the internet version of that: the original 'publisher' server produces the content once, and copies get distributed to 'stores' (edge caches) everywhere.",
        },
      ],
      questions: [
        {
          kind: 'fill',
          prompt:
            'A globally distributed cache for web content is commonly called a ______.',
          answers: ['cdn', 'content delivery network'],
          explain: 'CDN — Content Delivery Network.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why does Netflix place Open Connect cache hardware inside ISP networks?',
          options: [
            "To spy on viewers' habits",
            "So that the video bytes physically travel a short distance from a nearby box to the viewer, instead of thousands of miles from a central data center",
            'Because they were required to by law',
            "To replace the viewer's router",
          ],
          answerIndex: 1,
          explain:
            'Distance = latency and network cost. Putting a cache physically close to the viewer makes streaming dramatically cheaper and faster.',
        },
        {
          kind: 'tf',
          prompt:
            'If a site uses Cloudflare and its origin server briefly goes down, many requests can still be served from the CDN cache.',
          answer: true,
          explain:
            "That is one of the classic upsides of a CDN — not just speed, but resilience when the origin is having a bad minute.",
        },
        {
          kind: 'mcq',
          prompt:
            'In the chain-bookstore analogy, what does the local bookstore in your city represent?',
          options: [
            'The user',
            'An edge cache (CDN point of presence) near the user',
            "The publisher's warehouse",
            'The author',
          ],
          answerIndex: 1,
          explain:
            "Each local store is a copy of the book close to readers — exactly the job of a CDN edge cache.",
        },
        {
          kind: 'mcq',
          prompt:
            'CDNs are a specific case of which more general technique from this unit?',
          options: [
            'Transactions',
            'Load balancing',
            'Caching',
            'Indexing',
          ],
          answerIndex: 2,
          explain:
            'A CDN is caching, taken to a planetary scale — fast nearby copies of data, with a slower origin in the background.',
        },
        {
          kind: 'tf',
          prompt:
            'A CDN removes the need for an origin server entirely.',
          answer: false,
          explain:
            "No — the origin is still the source of truth. The CDN just holds fast copies in front of it. If something is not in the CDN cache, the request still falls back to the origin.",
        },
      ],
    },
  ],
  finalReview: [
    {
      kind: 'mcq',
      prompt:
        'Your site recomputes the same expensive list for every visitor and is getting slow. Which pattern from this unit most directly helps?',
      options: [
        'Sharding the database',
        'Adding an index to a new column',
        'Caching the computed list so repeat visitors get a pre-built copy',
        'Buying a more expensive domain name',
      ],
      answerIndex: 2,
      explain:
        "When the same answer is computed many times, caching is the classic fix — compute once, serve many.",
    },
    {
      kind: 'mcq',
      prompt:
        'A read hits the cache and gets the answer immediately. That is a:',
      options: ['Miss', 'Hit', 'Fault', 'Rollback'],
      answerIndex: 1,
      explain: 'Hit = the cache had it. Miss = it did not and we had to go to the slow source.',
    },
    {
      kind: 'tf',
      prompt:
        'Cache invalidation is hard primarily because it is not always obvious when the source of truth has changed, and any stale cached copies anywhere in the system need to be found and updated.',
      answer: true,
      explain:
        'That is exactly why Phil Karlton called it one of the two hardest problems in computer science.',
    },
    {
      kind: 'mcq',
      prompt:
        'Under an LRU eviction policy, which item is LEAST likely to be evicted?',
      options: [
        'The item touched longest ago',
        'A random item',
        'The most recently used item',
        'The largest item',
      ],
      answerIndex: 2,
      explain:
        'LRU keeps recently-used items and evicts whatever has sat untouched the longest.',
    },
  ],
};
