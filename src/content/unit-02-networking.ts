import type { Unit } from './types';

export const unit02Networking: Unit = {
  id: 'networking',
  title: 'Unit 2 — Networking basics',
  description: 'How clients and servers actually find and talk to each other.',
  reviewXp: 25,
  finalReview: [
    {
      kind: 'mcq',
      prompt:
        'You type "netflix.com" in your browser. In what order do these things roughly happen?',
      options: [
        'Browser opens a TCP connection → DNS lookup → HTTPS handshake → GET request',
        'DNS lookup → Browser opens a TCP connection → HTTPS handshake → GET request',
        'GET request → DNS lookup → HTTPS handshake → Browser opens a TCP connection',
        'HTTPS handshake → DNS lookup → GET request → TCP connection',
      ],
      answerIndex: 1,
      explain:
        'DNS first (you need the IP), then TCP connection, then TLS/HTTPS handshake to secure it, then the actual GET request.',
    },
    {
      kind: 'mcq',
      prompt:
        'A live voice call drops a single packet of audio. Why is UDP a better choice than TCP for this case?',
      options: [
        'UDP is faster because it retransmits more aggressively',
        "Missing audio is better than a long pause waiting for a retransmit — UDP doesn't retry",
        'TCP cannot carry audio data',
        'UDP is more reliable than TCP',
      ],
      answerIndex: 1,
      explain:
        'Real-time media prefers freshness over completeness. A quick glitch is better than a visible stall while the network resends old data.',
    },
    {
      kind: 'tf',
      prompt:
        "Even on HTTPS, your internet provider can still see which domain you're visiting, just not the full URL path or response body.",
      answer: true,
      explain:
        'The destination name/IP is visible (so the traffic can be routed). Everything inside the tunnel — path, headers, body — is encrypted.',
    },
    {
      kind: 'mcq',
      prompt:
        'An API you are calling returns 503. What does that most likely mean?',
      options: [
        'You sent a bad request — your fault',
        'The resource does not exist',
        'The server understood you but is temporarily unable to handle the request',
        'The request was successful',
      ],
      answerIndex: 2,
      explain:
        '5xx = server-side problem. 503 Service Unavailable specifically means the server is up but not currently able to serve the request (overloaded, maintenance, etc.).',
    },
  ],
  lessons: [
    // ---------------------------------------------------------------
    {
      id: 'networking.ip-ports',
      title: 'IP addresses and ports',
      xp: 10,
      intro:
        'Every device on a network has an IP address — a number that identifies it. A port is a smaller number that identifies a specific program on that device. Together, an IP + port is like the full mailing address of a running service.',
      examples: [
        {
          company: 'Zoom',
          scenario:
            "When you join a Zoom call, your computer connects to one of Zoom's media servers at a specific IP address. Your audio and video packets are aimed at a specific port on that server where the Zoom audio/video program is listening. Other programs on that same machine listen on different ports and ignore your packets.",
        },
        {
          company: 'Minecraft (multiplayer servers)',
          scenario:
            "To join a friend's Minecraft world you type their server's IP plus port 25565 (the default Minecraft port). If another game were running on the same computer on port 27015, your Minecraft client would ignore it — the port makes sure you connect to the right program.",
        },
      ],
      analogies: [
        {
          title: 'An apartment building',
          body: 'The IP address is the street address of the building. The port is the apartment number inside. Mail addressed only to the building is not enough — the mail carrier needs the apartment number to deliver to the right person.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'In the apartment analogy, what does the port number represent?',
          options: [
            'The street address',
            'The apartment number',
            'The city',
            'The postal code',
          ],
          answerIndex: 1,
          explain:
            'The building address is the IP; the apartment inside is the port.',
        },
        {
          kind: 'mcq',
          prompt:
            "Why do you need a port in addition to an IP address?",
          options: [
            'IP addresses run out quickly',
            'One machine can run many programs, and the port picks which one receives the traffic',
            'Ports encrypt the data',
            'Ports are just a backup in case the IP fails',
          ],
          answerIndex: 1,
          explain:
            "One computer can run a web server, a database, and a game server all at once. The port is how the incoming packet knows which program it's for.",
        },
        {
          kind: 'tf',
          prompt:
            'Two different programs on the same computer can listen on the same port at the same time.',
          answer: false,
          explain:
            'Each port on a given IP can only be "owned" by one listening program at a time.',
        },
        {
          kind: 'fill',
          prompt:
            "The numeric identifier for a specific program on a machine is called a ______.",
          answers: ['port'],
          explain: 'Port = program-level address.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Minecraft example, what role does port 25565 play?',
          options: [
            "It's the IP of the server",
            "It tells the computer which program should receive the incoming game traffic",
            'It encrypts the game data',
            'It limits how many players can join',
          ],
          answerIndex: 1,
          explain:
            '25565 is the port the Minecraft server program listens on. Traffic aimed at that port lands in Minecraft, not some other program.',
        },
        {
          kind: 'tf',
          prompt:
            'An IP address without a port is enough to contact a specific running program.',
          answer: false,
          explain:
            'The IP gets you to the machine; you still need the port to reach the specific program.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'networking.dns',
      title: 'DNS: names into addresses',
      xp: 10,
      intro:
        'Humans remember names like "netflix.com". Computers need numeric IP addresses. DNS (Domain Name System) is the service that translates between them — it\'s basically the phone book of the internet.',
      examples: [
        {
          company: 'Netflix',
          scenario:
            "When you type 'netflix.com' in your browser, the browser first asks a DNS server 'what IP address is netflix.com?' The DNS server replies with one of Netflix's front-door IPs. Only then does your browser open a connection and start asking for the actual page. You never see this step happen — it takes milliseconds.",
        },
        {
          company: 'Airbnb',
          scenario:
            "When Airbnb rolls out a new version of their site, they may change which IP addresses 'airbnb.com' resolves to in DNS. Your browser looks up the name fresh, gets the new IP, and connects to the new infrastructure — no one told you about any of this. The name stays the same; the address behind it moves.",
        },
      ],
      analogies: [
        {
          title: 'A phone book',
          body: "You want to call 'Aunt Priya,' not the number 555-0134. You look up the name in the phone book, get the number, and then dial. DNS is exactly that — you know the name, DNS hands you the number, you connect.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What problem does DNS solve?',
          options: [
            'It encrypts your web traffic',
            'It translates human-friendly names into the numeric IP addresses computers actually use',
            'It stores your passwords',
            "It speeds up video streaming",
          ],
          answerIndex: 1,
          explain:
            'Name → IP. That\'s the one job DNS is famous for.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the phone book analogy, the "number you actually dial" corresponds to:',
          options: ['The domain name', 'The IP address', 'The DNS server', 'The port'],
          answerIndex: 1,
          explain:
            'You look up the name to get the number. The number = the IP address.',
        },
        {
          kind: 'tf',
          prompt:
            'In the Netflix example, your browser needs to do a DNS lookup before it can send any actual request to netflix.com.',
          answer: true,
          explain:
            "It has to know which IP to open a connection to. No IP, no connection.",
        },
        {
          kind: 'fill',
          prompt:
            'The system that turns "google.com" into an IP address is called ______.',
          answers: ['dns', 'domain name system'],
          explain: 'DNS — Domain Name System.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why is it useful that Airbnb can change the IP behind "airbnb.com"?',
          options: [
            'It makes the site look nicer',
            'It lets them move traffic to new servers or regions without users having to learn a new address',
            'It encrypts all traffic',
            'It reduces the number of users',
          ],
          answerIndex: 1,
          explain:
            "DNS decouples the stable public name from the changing back-end IPs. That's huge for operations.",
        },
        {
          kind: 'tf',
          prompt:
            'DNS lookups generally take several seconds per request.',
          answer: false,
          explain:
            'They usually take tens of milliseconds — and results are often cached, so they happen even faster.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'networking.tcp-udp',
      title: 'TCP vs UDP',
      xp: 10,
      intro:
        'TCP and UDP are two ways to send data over a network. TCP guarantees that every piece arrives and in the right order — at the cost of some speed. UDP just fires packets off and does not care if some are lost — but it is much faster and simpler.',
      examples: [
        {
          company: 'Gmail',
          scenario:
            'When Gmail sends or receives your emails, it uses TCP under the hood. You absolutely cannot lose half an email or have paragraphs arrive in the wrong order, so reliability matters more than a few extra milliseconds of delay.',
        },
        {
          company: 'Zoom',
          scenario:
            "Zoom's real-time video and audio typically use UDP. If a single packet of your voice is lost, it's better to skip it and keep going — nobody wants a 2-second pause while the network retransmits the word 'hello.' A small glitch is much better than a long stall.",
        },
      ],
      analogies: [
        {
          title: 'Registered mail vs. shouting across a room',
          body: 'TCP is like registered mail — every letter is tracked, the post office resends anything lost, and the order is preserved. UDP is like shouting across a noisy room — fast, simple, sometimes you lose a word, and that is fine because by the time you repeat it, the conversation has moved on.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'Which protocol would you use if it is critical that every byte arrives in the right order?',
          options: ['UDP', 'TCP', 'DNS', 'HTTPS only'],
          answerIndex: 1,
          explain:
            'TCP = reliable, ordered, acknowledged delivery.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why does live video chat like Zoom prefer UDP over TCP?',
          options: [
            'UDP is encrypted and TCP is not',
            "Retransmitting lost packets would cause big pauses; it's better to skip and move on",
            "TCP doesn't work over the internet",
            "UDP is the only option for audio",
          ],
          answerIndex: 1,
          explain:
            "Real-time media favors freshness over completeness — missing a tiny bit is better than stalling.",
        },
        {
          kind: 'tf',
          prompt:
            'In the analogy, "registered mail" represents UDP.',
          answer: false,
          explain:
            'Registered mail is TCP — tracked and reliable. Shouting across the room is UDP.',
        },
        {
          kind: 'fill',
          prompt:
            'The protocol that does not guarantee delivery but is fast and lightweight is called ______.',
          answers: ['udp'],
          explain: 'UDP — User Datagram Protocol.',
        },
        {
          kind: 'mcq',
          prompt: 'A Gmail message arriving with paragraphs in the wrong order would be:',
          options: [
            'Acceptable — everyone does it',
            'Impossible because TCP ensures correct order',
            'A feature',
            'Expected for long emails',
          ],
          answerIndex: 1,
          explain:
            'TCP reassembles data in the original order before handing it to the application.',
        },
        {
          kind: 'tf',
          prompt:
            'TCP is usually slower per-packet than UDP because it does extra bookkeeping for reliability.',
          answer: true,
          explain:
            'Reliability has a cost: handshakes, acknowledgements, retransmission. UDP skips most of that.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'networking.http-methods',
      title: 'HTTP methods and status codes',
      xp: 10,
      intro:
        'HTTP is the language browsers and servers use to talk on the web. A request has a method — a verb like GET or POST — that says what it wants. The response includes a status code — a three-digit number — that says how it went.',
      examples: [
        {
          company: 'Twitter / X',
          scenario:
            "Loading your timeline is a GET request — 'please give me the latest posts.' Posting a new tweet is a POST request — 'here is some new content, please store it.' If the tweet is accepted, the server responds with a 200 (OK) or 201 (Created); if you are rate-limited, it answers 429 (Too Many Requests) and your client shows that weird 'slow down' message.",
        },
        {
          company: 'Dropbox',
          scenario:
            "Browsing a folder in Dropbox sends GET requests for the list of files. Uploading a new file sends a PUT or POST with the file's contents. Deleting a file sends a DELETE. If you try to open a file you don't have access to, the server replies with 403 (Forbidden) and Dropbox shows the 'you don't have permission' screen.",
        },
      ],
      analogies: [
        {
          title: 'A waiter and a ticket',
          body: 'The HTTP method is like the verb on the order ticket ("bring", "add", "remove", "change"). The status code is like the waiter coming back and telling you "done" (200), "we\'re out of that" (404), or "the kitchen broke" (500). Same ticket form, different verbs, different outcomes.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'Which HTTP method is typically used to fetch data without changing anything?',
          options: ['POST', 'GET', 'DELETE', 'PATCH'],
          answerIndex: 1,
          explain:
            'GET is the "just give me this" verb. It should not cause side effects.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Twitter example, what method is used to publish a new tweet?',
          options: ['GET', 'POST', 'HEAD', 'OPTIONS'],
          answerIndex: 1,
          explain: 'POST: "here is new content, please store it."',
        },
        {
          kind: 'mcq',
          prompt: 'A 404 status code means:',
          options: [
            'The server is down',
            'The request was forbidden',
            'The requested thing was not found',
            'Everything is fine',
          ],
          answerIndex: 2,
          explain: '404 = Not Found.',
        },
        {
          kind: 'fill',
          prompt:
            'The HTTP status code for a normal successful response is ______.',
          answers: ['200'],
          explain: '200 OK is the classic happy-path code.',
        },
        {
          kind: 'tf',
          prompt:
            "In the Dropbox example, trying to open a file you don't have permission for returns a 403.",
          answer: true,
          explain:
            '403 = Forbidden. The server understood you but is refusing.',
        },
        {
          kind: 'mcq',
          prompt:
            'A status code in the 500s generally means:',
          options: [
            'The client did something wrong',
            'The request was redirected',
            'The server itself broke while handling the request',
            'Everything is fine, just slow',
          ],
          answerIndex: 2,
          explain:
            '5xx = server-side error. 4xx = client-side error. 2xx = success. 3xx = redirect.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'networking.https',
      title: 'HTTPS and encryption',
      xp: 10,
      intro:
        'HTTPS is HTTP with encryption added. It makes sure nobody in between you and the server can read or secretly change your traffic. The little padlock in your browser means you are on HTTPS.',
      examples: [
        {
          company: 'Your bank',
          scenario:
            "When you log in to your bank's website, HTTPS encrypts everything between your browser and the bank's server — your password, your account numbers, your balances. Without it, anyone sharing the same coffee-shop Wi-Fi could read it off the air.",
        },
        {
          company: 'Google Search',
          scenario:
            'Google search uses HTTPS by default. Without it, your internet service provider could see every search query you ever typed. With HTTPS, your ISP can see that you contacted google.com, but it cannot see what you searched for.',
        },
      ],
      analogies: [
        {
          title: 'A sealed envelope vs. a postcard',
          body: 'Plain HTTP is like a postcard — the mail carrier and anyone who handles it can read the whole message. HTTPS is like a sealed tamper-evident envelope — the mail carrier still sees where it is going, but cannot read what is inside, and would notice if someone tried to swap the contents.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is the main thing HTTPS adds on top of HTTP?',
          options: [
            'Faster downloads',
            'Encryption and integrity of the data in transit',
            'Better image quality',
            'A prettier URL bar',
          ],
          answerIndex: 1,
          explain:
            'HTTPS = HTTP over TLS. The point is encryption + tamper detection.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the postcard analogy, HTTPS is:',
          options: [
            'The postcard',
            'The sealed envelope',
            'The mail carrier',
            'The recipient',
          ],
          answerIndex: 1,
          explain:
            'The sealed envelope represents HTTPS — readable outside address, unreadable contents.',
        },
        {
          kind: 'tf',
          prompt:
            'With HTTPS, your ISP can still see that you visited google.com, but not what you searched for.',
          answer: true,
          explain:
            'The destination (name / IP) is visible, but the request path and body are encrypted.',
        },
        {
          kind: 'fill',
          prompt:
            'The "S" in HTTPS stands for ______.',
          answers: ['secure'],
          explain: 'HyperText Transfer Protocol Secure.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why does it matter that your bank uses HTTPS in the coffee-shop Wi-Fi example?',
          options: [
            "Because plain HTTP would let other people on the Wi-Fi read your password off the air",
            'Because HTTPS makes the site load faster',
            'Because HTTPS reduces the amount of data used',
            'Because HTTPS is required for images',
          ],
          answerIndex: 0,
          explain:
            'On an open network, unencrypted traffic is readable by anyone sharing the network. HTTPS prevents that.',
        },
        {
          kind: 'tf',
          prompt:
            'HTTPS only protects against eavesdropping; it does nothing against tampering.',
          answer: false,
          explain:
            'HTTPS also guarantees integrity — if anyone modifies the traffic in transit, the browser detects it and the connection breaks.',
        },
      ],
    },
  ],
};
