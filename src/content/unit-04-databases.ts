import type { Unit } from './types';

export const unit04Databases: Unit = {
  id: 'databases',
  title: 'Unit 4 — Databases',
  description:
    'How systems remember things. The place where all the important stuff actually lives.',
  reviewXp: 30,
  lessons: [
    // ---------------------------------------------------------------
    {
      id: 'databases.what-is-a-database',
      title: 'What is a database?',
      xp: 10,
      intro:
        "A database is a program whose whole job is to store information reliably and answer questions about it later. Every app you use has one (usually several) quietly doing this work in the background.",
      examples: [
        {
          company: 'Instagram',
          scenario:
            "Your profile, your followers, every photo caption, every like — all of it lives in Instagram's databases, not on your phone. That is why if you uninstall the app and reinstall it on a different device, everything is still there. Your phone is just a window into the database.",
        },
        {
          company: 'Uber',
          scenario:
            "Every completed trip, every driver rating, every receipt gets written to Uber's databases and stays there. Years after a ride is over, Uber can still look it up. The phones and cars are temporary; the database is where the history lives.",
        },
      ],
      analogies: [
        {
          title: 'A filing cabinet with an extremely organized clerk',
          body: 'You hand documents to the clerk and they put them away in the right place. Later you can walk up and ask "find me all orange envelopes from 2019" and the clerk goes and gets them. You never touch the cabinet directly — you just ask the clerk.',
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is the core job of a database?',
          options: [
            'To display web pages to users',
            'To store information reliably and answer questions about it later',
            'To encrypt traffic on the network',
            'To run background jobs on a schedule',
          ],
          answerIndex: 1,
          explain:
            'A database is a specialised program for durable storage and efficient lookup. That is its entire purpose.',
        },
        {
          kind: 'tf',
          prompt:
            'In the Instagram example, your likes and followers are primarily stored on your phone.',
          answer: false,
          explain:
            "They live in Instagram's databases. Your phone is just a window — that's why reinstalling the app on a new device doesn't lose any of it.",
        },
        {
          kind: 'mcq',
          prompt:
            'In the filing cabinet analogy, what does the clerk represent?',
          options: [
            'The user of the app',
            'The database itself',
            'The network',
            'The operating system',
          ],
          answerIndex: 1,
          explain:
            'You never touch the cabinet directly — you ask the clerk (the database) to put things away and fetch them back. That interface is the whole point.',
        },
        {
          kind: 'fill',
          prompt:
            'A program whose whole job is to store information and answer questions about it is called a ______.',
          answers: ['database'],
          explain: 'Database — the system of record.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why is it useful that Uber keeps every completed trip in a database long after the ride is over?',
          options: [
            'So they can draw nice graphics on the map',
            'So riders and drivers can look up history, receipts, and disputes later — the data outlives the ride',
            'Because the app would crash otherwise',
            "Because Uber doesn't actually use databases",
          ],
          answerIndex: 1,
          explain:
            'Durability matters because the real-world value of the data often shows up much later than the moment it was written.',
        },
        {
          kind: 'tf',
          prompt:
            'Most real apps have more than one database behind the scenes.',
          answer: true,
          explain:
            "Big apps routinely split their data across several databases — often specialised for different jobs (user profiles in one, search in another, analytics in a third).",
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'databases.tables-rows-queries',
      title: 'Tables, rows, and queries',
      xp: 10,
      intro:
        'Most databases organise data into tables. A table is like a spreadsheet: the columns describe what kind of thing it stores, and each row is one actual thing. A query is a question you ask the database — "show me the rows that match this filter."',
      examples: [
        {
          company: 'Airbnb',
          scenario:
            "Airbnb has a `listings` table. The columns might be something like title, city, price_per_night, and host_id. Each row is one rental. Searching for 'listings in Lisbon under $100' is a query that says 'give me all rows where city = Lisbon and price_per_night < 100.'",
        },
        {
          company: 'Twitter / X',
          scenario:
            "Twitter stores tweets in a table with columns like author, text, timestamp, and likes. Each row is one tweet. Loading your profile page roughly runs a query: 'give me all rows where author = me, in reverse timestamp order, limited to the most recent 50.'",
        },
      ],
      analogies: [
        {
          title: 'Highlighting rows in a spreadsheet',
          body: "Imagine a giant spreadsheet. SELECT is like typing a filter: 'show me all rows where column X matches this.' The database hands you back just those rows. You are not reading the whole spreadsheet — just the parts you asked for.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'In a relational database, what best describes a "table"?',
          options: [
            'A single value stored by itself',
            'A spreadsheet-like structure with columns describing the kind of data and rows holding the actual records',
            'A connection between two servers',
            'A cache of recent requests',
          ],
          answerIndex: 1,
          explain:
            'Tables are the basic shape of relational data: named columns + rows of records.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Airbnb example, what does one row in the `listings` table represent?',
          options: [
            'One city',
            'One host',
            'One individual rental',
            'One search query',
          ],
          answerIndex: 2,
          explain:
            'Each row is one actual listing — one rental property with its own title, price, and so on.',
        },
        {
          kind: 'tf',
          prompt:
            'A query always has to return every row in the table it reads from.',
          answer: false,
          explain:
            'Queries almost always include filters. The database only returns the rows that match what you asked for.',
        },
        {
          kind: 'fill',
          prompt:
            'In a relational database, the named fields like "title" and "price_per_night" are called ______.',
          answers: ['columns'],
          explain: 'Columns describe the shape of the data; rows hold the records.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the spreadsheet analogy, "highlighting only the rows where column X matches" is most like which SQL operation?',
          options: [
            'CREATE',
            'SELECT with a WHERE filter',
            'DELETE',
            'INSERT',
          ],
          answerIndex: 1,
          explain:
            'SELECT ... WHERE asks the database to return just the rows that match the condition — highlighting, in spreadsheet terms.',
        },
        {
          kind: 'tf',
          prompt:
            "Loading your Twitter profile page almost certainly runs at least one query against a tweets table.",
          answer: true,
          explain:
            'Your list of recent tweets has to come from somewhere. A query against a tweets table (filtered by author and sorted by time) is the natural way to build it.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'databases.indexes',
      title: 'Indexes',
      xp: 10,
      intro:
        'Without help, finding a specific row in a table means scanning through every row top to bottom. An index is a separate, sorted data structure the database keeps on the side — like a lookup table — that lets it jump straight to the matching rows instead of reading everything.',
      examples: [
        {
          company: 'LinkedIn',
          scenario:
            "When you search for a person by name on LinkedIn, the database does not read through every one of its nearly 900 million profiles. It uses an index on the name column to jump directly to matches. Without that index, one search would take forever.",
        },
        {
          company: 'Amazon',
          scenario:
            "Amazon's product search supports filters like 'shirts under $30 rated 4+ stars.' The product database has indexes on columns like category, price, and average rating so those filters narrow the search in milliseconds instead of scanning the full catalog for every query.",
        },
      ],
      analogies: [
        {
          title: 'The index at the back of a textbook',
          body: "Finding every mention of 'mitochondria' by reading the whole textbook cover-to-cover would take hours. Instead, you flip to the back, find 'mitochondria' in the alphabetical index, and jump straight to page 247. The index is a separate structure you maintain so lookups are cheap.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            'What problem does an index primarily solve?',
          options: [
            'It keeps data backed up to a second disk',
            'It lets the database find matching rows quickly without scanning the whole table',
            'It encrypts data at rest',
            'It decides which user has permission to read what',
          ],
          answerIndex: 1,
          explain:
            'An index turns "find the matching rows" from a full table scan into a direct lookup — often by many orders of magnitude.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the textbook analogy, flipping through the whole book page by page corresponds to which database behaviour?',
          options: [
            'A primary key lookup',
            'A full table scan',
            'An encrypted query',
            'A transaction',
          ],
          answerIndex: 1,
          explain:
            'Reading every page = reading every row = a full table scan. That is exactly what an index exists to avoid.',
        },
        {
          kind: 'tf',
          prompt:
            'Adding an index to a column makes every possible query against the table faster.',
          answer: false,
          explain:
            'Indexes only speed up the queries whose filters match the indexed columns. And because the index has to be updated on every write, inserts and updates actually get a bit slower.',
        },
        {
          kind: 'fill',
          prompt:
            'A sorted data structure the database keeps on the side so lookups can skip the full table scan is called an ______.',
          answers: ['index'],
          explain: 'Index — and most tables have several, one per lookup pattern.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why does LinkedIn specifically need an index on the name column?',
          options: [
            "So users can't search by name",
            'Because scanning nearly 900M rows for every name search would be impossibly slow',
            'Because names take too much storage',
            'Because indexes make data smaller',
          ],
          answerIndex: 1,
          explain:
            'The huge scale is exactly the point: at 900M rows, an unindexed search is not "slow", it is unusable.',
        },
        {
          kind: 'tf',
          prompt:
            'Every index has a cost — it takes up extra storage and makes writes a little slower.',
          answer: true,
          explain:
            'Indexes are a classic speed / space trade-off. Reads get faster; writes and storage get a little heavier. You index the columns you actually query on.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'databases.acid-transactions',
      title: 'ACID and transactions',
      xp: 10,
      intro:
        "A transaction is a group of database changes that must either all happen or none happen. ACID is the four-letter promise relational databases make about transactions: Atomic, Consistent, Isolated, and Durable. In this lesson we focus mostly on the 'A'.",
      examples: [
        {
          company: 'Stripe',
          scenario:
            "When Stripe transfers $100 from account A to account B, it does two writes: subtract $100 from A, then add $100 to B. Those two writes are wrapped in a transaction. If the power cuts between them, neither write sticks — otherwise $100 would vanish into thin air, or money would appear from nowhere. Transactions are what make that impossible.",
        },
        {
          company: 'Venmo',
          scenario:
            "Sending $20 on Venmo is the same pattern: decrement the sender, increment the recipient. Wrapped in a transaction, they either both commit or both get rolled back. You can't ever end up in a state where the sender paid but the recipient never got it.",
        },
      ],
      analogies: [
        {
          title: 'A marriage ceremony',
          body: "Either both people say 'I do' and the marriage is valid, or something goes wrong and neither of them is married. There is no legal state where one person is married and the other is not. That is what atomicity means: all-or-nothing, no weird in-between.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is a database transaction?',
          options: [
            'A backup of a table to another disk',
            'A group of database changes that must either all happen or none happen',
            'A password reset email',
            'A query that reads a single row',
          ],
          answerIndex: 1,
          explain:
            'A transaction bundles several changes into one unit with an all-or-nothing guarantee.',
        },
        {
          kind: 'fill',
          prompt:
            "The 'A' in ACID stands for ______, the property that says a transaction is all-or-nothing.",
          answers: ['atomicity', 'atomic'],
          explain:
            "Atomicity — either every change in the transaction takes effect, or none of them do.",
        },
        {
          kind: 'mcq',
          prompt:
            "In the Stripe example, what does atomicity specifically prevent?",
          options: [
            'Users from ever creating an account',
            'Money disappearing or appearing because only one of the two writes stuck',
            'The database from running out of disk space',
            "Duplicate emails from being sent",
          ],
          answerIndex: 1,
          explain:
            'Without atomicity you could debit A without ever crediting B (or vice versa). Transactions exist exactly to make that impossible.',
        },
        {
          kind: 'tf',
          prompt:
            'In the marriage analogy, "one person is married and the other is not" is a legal state.',
          answer: false,
          explain:
            'That is the analogy: there is no valid half-married state. A transaction either fully commits or fully rolls back — there is no half-committed state either.',
        },
        {
          kind: 'mcq',
          prompt:
            "The 'D' in ACID stands for Durable. What does that mean?",
          options: [
            'The database is shiny and hard to scratch',
            "Once a transaction commits, the changes survive a crash or a power outage",
            'Only durable goods can be stored',
            'The data can be deleted at any time',
          ],
          answerIndex: 1,
          explain:
            'Durability: a committed transaction is not lost, even if the server crashes a millisecond later.',
        },
        {
          kind: 'tf',
          prompt:
            'Wrapping multiple changes in a single transaction is the standard way banking-style systems avoid inconsistent money states.',
          answer: true,
          explain:
            'Any time you have two writes that have to succeed together — transfer, order + inventory, payment + receipt — a transaction is the right tool.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'databases.sql-vs-nosql',
      title: 'SQL vs NoSQL',
      xp: 10,
      intro:
        'SQL databases store data in tables with strict schemas and are great for structured data with clear relationships (users, posts, orders). NoSQL databases come in many flavours and trade some of that strictness for flexibility, massive scale, or a specific access pattern.',
      examples: [
        {
          company: 'Reddit',
          scenario:
            "Reddit's core data — users, subreddits, posts, comments, votes — is stored in PostgreSQL, a classic SQL database. Those things have real relationships (a comment belongs to a post, which belongs to a subreddit) and Reddit relies heavily on transactions to keep votes and scores consistent.",
        },
        {
          company: 'Discord',
          scenario:
            "Discord stores its enormous history of chat messages in ScyllaDB, a NoSQL wide-column database. They write billions of messages per day, and the access pattern is mostly simple ('give me the last 50 messages in this channel'), so they chose a database optimized for that exact shape — at the cost of fancier joins or cross-table transactions.",
        },
      ],
      analogies: [
        {
          title: 'A formal library vs. a well-labelled warehouse',
          body: "A SQL database is like a library with the Dewey Decimal System — strict rules, every book in a specific place, easy to answer arbitrary cross-references. A NoSQL database is like a warehouse with clearly labelled bins — less formal, incredibly good at getting you a specific thing fast, but harder to do unplanned cross-lookups across bins.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt:
            "Which of these is a reasonable reason to pick a SQL (relational) database?",
          options: [
            "You need extreme write throughput and only ever look things up by a single key",
            "Your data has clear relationships between entities and you rely on multi-row transactions",
            "You don't want to model your data at all",
            "You only need to store log lines",
          ],
          answerIndex: 1,
          explain:
            'Clear relationships + transactions is the classic home turf of SQL. Reddit is a textbook example.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why did Discord choose a NoSQL wide-column database for their messages?',
          options: [
            "Because SQL databases can't store text",
            "Because their access pattern is simple and predictable, and they need enormous write throughput, which matches what that NoSQL engine is built for",
            "To avoid using indexes",
            "Because relational databases are illegal",
          ],
          answerIndex: 1,
          explain:
            'When the workload is narrow and huge, you can pick a database purpose-built for that shape. That was the tradeoff Discord made.',
        },
        {
          kind: 'tf',
          prompt:
            '"NoSQL" is a single, specific database engine.',
          answer: false,
          explain:
            'NoSQL is an umbrella. It includes key-value stores, document stores, wide-column stores, graph databases, and more — each very different from the others.',
        },
        {
          kind: 'fill',
          prompt:
            'Relational databases that organise data into tables with strict schemas are broadly called ______ databases.',
          answers: ['sql', 'relational'],
          explain: 'SQL / relational — they speak the SQL query language and model data as tables.',
        },
        {
          kind: 'mcq',
          prompt:
            "In the library vs. warehouse analogy, 'doing an unplanned cross-reference across many different kinds of data' is easier in:",
          options: [
            'The library (SQL)',
            'The warehouse (NoSQL)',
            'Neither — both forbid it',
            'Both, equally',
          ],
          answerIndex: 0,
          explain:
            'SQL is designed for flexible joins across related tables. NoSQL often trades that away to optimise one specific access pattern.',
        },
        {
          kind: 'tf',
          prompt:
            'Most large systems use only one database engine for everything.',
          answer: false,
          explain:
            'In practice, big systems mix and match: a SQL database for the relational core, a key-value store for caching, a search index for search, and so on. Different tools for different jobs.',
        },
      ],
    },
  ],
  finalReview: [
    {
      kind: 'mcq',
      prompt:
        'You run a SELECT query filtered by email, but the email column has no index. What is the database most likely doing?',
      options: [
        'Returning no rows at all',
        'Using a secret backup index',
        "A full table scan — reading every row looking for matches",
        'Crashing',
      ],
      answerIndex: 2,
      explain:
        'Without an index, the database has no shortcut — it has to look at every row and check the filter. That is exactly the behaviour indexes exist to avoid.',
    },
    {
      kind: 'tf',
      prompt:
        'Adding an index to a column makes reads faster for queries that filter on it, but slows down writes to that table.',
      answer: true,
      explain:
        'Every insert or update has to keep the index in sync, which costs a little. The read speedup is usually worth it, but only for columns you actually query.',
    },
    {
      kind: 'mcq',
      prompt:
        'A money transfer does two writes: debit the sender, credit the recipient. Why wrap them in a transaction?',
      options: [
        'To make the request faster',
        'So both happen together, or neither does — you never end up with money missing or doubled',
        'To log the request to disk',
        'To encrypt the amount',
      ],
      answerIndex: 1,
      explain:
        "That all-or-nothing guarantee is atomicity — the 'A' in ACID.",
    },
    {
      kind: 'mcq',
      prompt:
        'You need to store billions of chat messages per day with simple access patterns ("recent messages in this channel"). Which type of database is the better starting point?',
      options: [
        'A classic relational SQL database with many joins',
        'A NoSQL wide-column database purpose-built for high write throughput and simple key-based access',
        'A spreadsheet file',
        'An in-memory cache only',
      ],
      answerIndex: 1,
      explain:
        'When the workload is huge and the access pattern is narrow, a NoSQL engine tuned for that shape (like the one Discord uses for messages) often wins.',
    },
  ],
};
