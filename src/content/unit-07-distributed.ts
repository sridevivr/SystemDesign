import type { Unit } from './types';

export const unit07Distributed: Unit = {
  id: 'distributed',
  title: 'Unit 7 — Distributed systems',
  description:
    'What happens when your data lives on more than one machine — and those machines disagree.',
  reviewXp: 30,
  lessons: [
    // ---------------------------------------------------------------
    {
      id: 'distributed.replication',
      title: 'Replication',
      xp: 10,
      intro:
        'Replication means keeping copies of the same data on multiple machines. If one machine dies, another already has the data. It also lets you spread read traffic across copies so no single machine is the bottleneck.',
      examples: [
        {
          company: 'Netflix',
          scenario:
            "Netflix replicates its catalog metadata — titles, descriptions, artwork URLs — across multiple data centers around the world. If the US-East copy goes down, US-West and Europe each have their own replica and keep serving. Users never see an outage because the data already exists in more than one place.",
        },
        {
          company: 'PostgreSQL (streaming replication)',
          scenario:
            "Many production PostgreSQL setups have one primary database that accepts writes and one or more read replicas that stream a copy of every write. Your app sends writes to the primary and reads to the replicas. This means a single write-heavy primary is not also crushed under millions of reads — the replicas absorb that load.",
        },
      ],
      analogies: [
        {
          title: 'Photocopying important documents',
          body: "You photocopy a critical contract and store copies in three different offices. If one office floods, you walk to another and get the copy. No single disaster can destroy all versions. That is replication — multiple copies in multiple places so you survive losing any one of them.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is database replication?',
          options: [
            'Deleting old data to save space',
            'Keeping copies of the same data on multiple machines for durability and read scalability',
            'Encrypting data before storing it',
            'Compressing data to reduce storage costs',
          ],
          answerIndex: 1,
          explain:
            'Replication = multiple copies on multiple machines. It buys you both survival (if one dies) and throughput (reads can spread across copies).',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Netflix example, why does replicating catalog data across multiple data centers help availability?',
          options: [
            'Because it makes the data smaller',
            'Because if one data center goes down, another already has a full copy and keeps serving users',
            'Because it encrypts the data',
            'Because Netflix only has one data center',
          ],
          answerIndex: 1,
          explain:
            'The whole point is redundancy. Losing one copy is fine because others exist.',
        },
        {
          kind: 'tf',
          prompt:
            'In the photocopying analogy, storing the contract in only one office is like running a database with no replication.',
          answer: true,
          explain:
            'One copy = one flood away from total loss. No replication = one machine failure away from downtime.',
        },
        {
          kind: 'fill',
          prompt:
            'A database copy that accepts reads but not writes is commonly called a read ______.',
          answers: ['replica'],
          explain: 'Read replica — it mirrors the primary and serves read queries.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the PostgreSQL example, why send reads to replicas instead of the primary?',
          options: [
            'Replicas are always faster',
            'So the primary is not overwhelmed by both writes AND millions of reads — the replicas absorb the read load',
            'Because the primary cannot serve reads at all',
            'Because replicas have more storage',
          ],
          answerIndex: 1,
          explain:
            'Splitting read traffic to replicas takes pressure off the primary, which can focus on writes.',
        },
        {
          kind: 'tf',
          prompt:
            'A downside of replication is that you now have to keep multiple copies in sync, which adds complexity.',
          answer: true,
          explain:
            'Replication is not free. Keeping copies consistent — especially across regions — is one of the hardest problems in distributed systems.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'distributed.sharding',
      title: 'Sharding (partitioning)',
      xp: 10,
      intro:
        'When your data is too large or too hot for one machine, you split it across many machines by some key. Each machine holds a slice — called a shard or partition. Sharding is how systems handle data sets that outgrow any single server.',
      examples: [
        {
          company: 'Discord',
          scenario:
            "Discord shards its message storage by guild (server) ID. All messages for guild 12345 live on shard A; messages for guild 67890 live on shard B. This means no single database machine has to hold every message from every Discord server in the world. When you send a message, Discord looks up which shard owns your guild and writes there.",
        },
        {
          company: 'Instagram',
          scenario:
            "Instagram shards user data — photos, likes, follows — by user ID. When you open someone's profile, Instagram hashes their user ID to figure out which shard holds their data. Each shard is a smaller, faster database that only knows about a slice of the total user population.",
        },
      ],
      analogies: [
        {
          title: 'Splitting a library across buildings by genre',
          body: "Imagine a library so big that no single building can hold all the books. So you put fiction in Building A, science in Building B, and history in Building C. Each building is smaller and easier to manage. When a reader wants a book, you look at the genre to know which building to visit. That is sharding — splitting by a key (genre) so each location holds a manageable slice.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is the core idea of sharding?',
          options: [
            'Making one server as big as possible',
            'Splitting data across multiple machines by a key so no single machine holds everything',
            'Deleting old records to save space',
            'Encrypting data at rest',
          ],
          answerIndex: 1,
          explain:
            'Sharding = horizontal split of data by key. Each shard is responsible for a subset.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Discord example, what is the shard key?',
          options: [
            'The message text',
            'The guild (server) ID',
            'The timestamp',
            "The user's email address",
          ],
          answerIndex: 1,
          explain:
            'Discord uses guild ID to decide which shard holds a given guild\'s messages. All messages for one guild land on the same shard.',
        },
        {
          kind: 'tf',
          prompt:
            'In the library analogy, splitting books by genre across buildings is analogous to sharding by a key.',
          answer: true,
          explain:
            'Genre is the shard key. Each building is a shard that holds one slice of the total collection.',
        },
        {
          kind: 'fill',
          prompt:
            'Splitting a database across multiple machines by a key so each machine holds a slice of the data is called ______.',
          answers: ['sharding', 'partitioning'],
          explain: 'Sharding (also called partitioning) — horizontal data splitting.',
        },
        {
          kind: 'mcq',
          prompt:
            'What is a major challenge that sharding introduces?',
          options: [
            'Data becomes encrypted automatically',
            'Queries that need data from multiple shards (cross-shard joins) become much harder or impossible',
            'Each shard runs faster than the original single server',
            'Backups become unnecessary',
          ],
          answerIndex: 1,
          explain:
            "Once data is split, pulling it back together across shards is expensive. That is the classic sharding trade-off: you gain capacity but lose easy cross-shard queries.",
        },
        {
          kind: 'tf',
          prompt:
            'Sharding and replication solve different problems: sharding splits data for capacity; replication copies data for durability and read throughput. Real systems often do both.',
          answer: true,
          explain:
            'They are complementary. A common pattern: shard your data across N machines, then replicate each shard so no single machine failure loses a slice.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'distributed.cap',
      title: 'The CAP theorem',
      xp: 10,
      intro:
        "The CAP theorem says that during a network partition (when two parts of your system cannot talk to each other), you have to choose: keep serving requests with the risk that answers might be stale (Availability), or refuse to serve until the partition heals so every answer is correct (Consistency). You cannot have both at the same time during a partition. The three letters stand for Consistency, Availability, and Partition tolerance.",
      examples: [
        {
          company: 'Amazon DynamoDB (AP)',
          scenario:
            "DynamoDB is designed to favor availability over strong consistency by default. During a network partition, DynamoDB keeps accepting reads and writes on both sides of the split, even though the two sides cannot sync with each other. You might read slightly stale data for a moment, but you are never told 'service unavailable.' Amazon made that trade-off because for a shopping cart, showing a slightly old item count is far less harmful than the whole cart page going down.",
        },
        {
          company: 'Google Spanner (CP)',
          scenario:
            "Google Spanner chose the other side: it guarantees strong consistency (externally consistent transactions) even across continents. During a partition, Spanner may refuse or delay a write rather than risk two sides disagreeing. Google built special hardware (TrueTime, GPS + atomic clocks) to keep the consistency penalty as small as possible, but they accept that availability can suffer briefly when the network splits.",
        },
      ],
      analogies: [
        {
          title: '"Fast, cheap, good — pick two"',
          body: "You have heard the saying 'fast, cheap, good — pick any two.' CAP is the distributed-systems version: consistency, availability, partition tolerance — pick two. Since network partitions are a fact of life you cannot opt out of, the real choice comes down to C or A during a partition.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What does the "P" in CAP stand for?',
          options: [
            'Performance',
            'Persistence',
            'Partition tolerance',
            'Privacy',
          ],
          answerIndex: 2,
          explain:
            'C = Consistency, A = Availability, P = Partition tolerance.',
        },
        {
          kind: 'mcq',
          prompt:
            'During a network partition, an AP system like DynamoDB will:',
          options: [
            'Stop all reads and writes until the partition heals',
            'Keep serving requests even though some answers might be stale',
            'Delete all data',
            'Automatically switch to a CP model',
          ],
          answerIndex: 1,
          explain:
            'AP systems favor uptime. They stay available at the cost of possibly returning data that is not perfectly up to date.',
        },
        {
          kind: 'tf',
          prompt:
            'Google Spanner favors availability over consistency — it will always return an answer, even if it might be wrong.',
          answer: false,
          explain:
            'Spanner is CP: it favors consistency. It may delay or refuse a request during a partition rather than risk returning inconsistent data.',
        },
        {
          kind: 'fill',
          prompt:
            'The CAP theorem says that during a network partition you must choose between ______ and availability.',
          answers: ['consistency'],
          explain: 'Consistency or availability — that is the real binary choice CAP surfaces.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why does the "pick two" framing of CAP reduce to "pick C or A" in practice?',
          options: [
            'Because partition tolerance is optional',
            'Because network partitions are a fact of life — you cannot opt out of P, so the real choice is between C and A during a partition',
            'Because consistency and availability are the same thing',
            'Because no real system uses partitions',
          ],
          answerIndex: 1,
          explain:
            'Networks WILL split. You must tolerate that (P is mandatory). So the question becomes: when it happens, do you pick C or A?',
        },
        {
          kind: 'tf',
          prompt:
            'In the "fast, cheap, good" analogy, network partitions correspond to the constraint you cannot remove — just like you cannot build something for free with zero time.',
          answer: true,
          explain:
            'Partition tolerance is the non-negotiable. Like time and money, you have to live with it and choose what to optimize within that reality.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'distributed.consistency-models',
      title: 'Consistency models',
      xp: 10,
      intro:
        "How quickly must all copies of your data agree? Strong consistency means every read sees the most recent write, everywhere, instantly. Eventual consistency means replicas will converge eventually, but for a brief window you might read stale data. Most real systems pick a point on this spectrum based on what the feature can tolerate.",
      examples: [
        {
          company: 'Amazon shopping cart (eventual consistency)',
          scenario:
            "Amazon's shopping cart is famously eventually consistent. If you add an item on your phone, your laptop might take a second to show it. Amazon decided that a momentary stale view is fine for a cart — far better than making the 'Add to Cart' button slow or unavailable. The copies converge within seconds and nobody notices.",
        },
        {
          company: 'Banking / wire transfers (strong consistency)',
          scenario:
            "A bank wire transfer absolutely must be strongly consistent. If you transfer $1,000 from savings to checking, no read — from any branch, ATM, or app, anywhere in the world — should ever see the old balance after the transfer commits. Banks pay for this in latency and complexity, but a stale bank balance would be genuinely dangerous.",
        },
      ],
      analogies: [
        {
          title: 'A shared Google Doc vs. a locked Word file on a USB stick',
          body: "A Google Doc with multiple editors is eventually consistent in practice — when two people type at the same moment in different places, each sees the other's change show up a beat later, and the doc converges. A locked Word file on a USB stick is strongly consistent — only the person holding the stick can read or write, so the file is always up to date, but nobody else can access it simultaneously.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What does "strong consistency" guarantee?',
          options: [
            'That data is encrypted',
            'That every read, from any replica, returns the most recent write — there is no stale window',
            'That data is stored on only one machine',
            'That the system never goes down',
          ],
          answerIndex: 1,
          explain:
            'Strong consistency = every reader sees the latest write immediately. Expensive but correct.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why is eventual consistency acceptable for a shopping cart but not for a bank balance?',
          options: [
            'Because carts are faster than banks',
            "Because a momentarily stale cart is a minor nuisance, but a stale bank balance could cause real financial damage — the cost of staleness is very different",
            'Because shopping carts never use databases',
            'Because banks have more servers',
          ],
          answerIndex: 1,
          explain:
            'The choice between strong and eventual consistency depends on what happens when a user sees stale data. Cart: mild confusion. Bank: real money risk.',
        },
        {
          kind: 'tf',
          prompt:
            'In the Google Doc analogy, two editors seeing each other\'s changes after a brief delay is an example of eventual consistency.',
          answer: true,
          explain:
            'The doc converges — eventually every copy agrees — but there is a short window where the two views differ. That is the essence of eventual consistency.',
        },
        {
          kind: 'fill',
          prompt:
            'A consistency model where replicas may temporarily disagree but will converge over time is called ______ consistency.',
          answers: ['eventual'],
          explain: 'Eventual consistency — replicas converge, but not instantly.',
        },
        {
          kind: 'mcq',
          prompt:
            'What is the main trade-off of choosing strong consistency?',
          options: [
            'Data is never stored',
            'Higher latency and potentially lower availability — the system may need to coordinate across replicas before responding',
            'Data becomes unreadable',
            'The system uses less storage',
          ],
          answerIndex: 1,
          explain:
            'Strong consistency often requires coordinating across nodes before acknowledging a write, which takes time and can reduce availability during partitions.',
        },
        {
          kind: 'tf',
          prompt:
            'Most real systems pick one consistency model and use it everywhere for all features.',
          answer: false,
          explain:
            'Real systems often mix models. A user\'s account balance might be strongly consistent while their notification count is eventually consistent. Each feature picks the right trade-off.',
        },
      ],
    },

    // ---------------------------------------------------------------
    {
      id: 'distributed.consensus',
      title: 'Consensus',
      xp: 10,
      intro:
        "When you have multiple copies of data and one of them needs to accept a write, how do they all agree on which write happened and in what order? That is the consensus problem. Algorithms like Raft and Paxos let a group of machines elect a leader and agree on a sequence of operations — even if some machines crash.",
      examples: [
        {
          company: 'etcd / Kubernetes (Raft)',
          scenario:
            "Kubernetes stores its entire cluster state (what pods are running, on which nodes) in etcd, a key-value store that uses the Raft consensus algorithm. etcd runs on 3 or 5 machines. They elect a leader; the leader accepts writes. If the leader crashes, the remaining machines hold an election and a new leader takes over within seconds. As long as a majority (e.g. 3 of 5) are up, the cluster keeps working.",
        },
        {
          company: 'Google Chubby / Paxos',
          scenario:
            "Google's internal lock service, Chubby, uses the Paxos consensus algorithm to coordinate access to shared resources across data centers. Paxos guarantees that even if some machines crash or network messages are delayed, the surviving machines agree on the same sequence of decisions. Google published their experience with Paxos in a famous paper, noting that getting consensus right in production is extremely hard.",
        },
      ],
      analogies: [
        {
          title: 'A jury reaching a verdict',
          body: "A jury of 12 needs a majority to agree on a verdict. If a few jurors are absent, the remaining ones can still reach agreement as long as enough are present. If they cannot form a quorum (too many absent), they cannot decide. Consensus algorithms work the same way: a majority of nodes must agree on each decision. A minority crashing does not stop the group.",
        },
      ],
      questions: [
        {
          kind: 'mcq',
          prompt: 'What problem does consensus solve?',
          options: [
            'How to compress data',
            'How a group of machines agrees on the same sequence of operations, even if some crash',
            'How to encrypt network traffic',
            'How to balance load across servers',
          ],
          answerIndex: 1,
          explain:
            'Consensus = agreement across multiple machines on what happened and in what order, despite failures.',
        },
        {
          kind: 'mcq',
          prompt:
            'In the Kubernetes/etcd example, what happens if the Raft leader crashes?',
          options: [
            'The entire cluster shuts down permanently',
            'The remaining machines hold an election and a new leader takes over within seconds',
            'All data is lost',
            'The system switches to a different database',
          ],
          answerIndex: 1,
          explain:
            'Raft is designed to survive leader failure. A new election happens automatically as long as a majority of nodes are still up.',
        },
        {
          kind: 'tf',
          prompt:
            'In the jury analogy, a quorum is needed for a decision — if too many jurors are absent, no verdict can be reached.',
          answer: true,
          explain:
            'Consensus algorithms need a majority to agree. If the majority is down, the system cannot make progress — it sacrifices availability to preserve correctness.',
        },
        {
          kind: 'fill',
          prompt:
            'The consensus algorithm used by etcd (the state store behind Kubernetes) is called ______.',
          answers: ['raft'],
          explain: 'Raft — designed to be understandable, unlike its predecessor Paxos.',
        },
        {
          kind: 'mcq',
          prompt:
            'Why do consensus systems typically run an odd number of nodes (3, 5, 7)?',
          options: [
            'Because even numbers are unlucky',
            'Because an odd number ensures there is always a clear majority — no ties during elections',
            'Because odd numbers use less memory',
            'Because the algorithm only works with prime numbers',
          ],
          answerIndex: 1,
          explain:
            '3 nodes = majority is 2. 5 nodes = majority is 3. An odd count avoids split-brain ties during leader elections.',
        },
        {
          kind: 'tf',
          prompt:
            'Google\'s Paxos paper noted that implementing consensus correctly in production is extremely hard, even for experienced engineers.',
          answer: true,
          explain:
            'Consensus is conceptually simple (majority agrees) but operationally brutal. Edge cases around timing, network delays, and partial failures make real implementations notoriously difficult.',
        },
      ],
    },
  ],
  finalReview: [
    {
      kind: 'mcq',
      prompt:
        'Your database is getting too large for one machine. You want to split the data across several machines by user ID. What is this technique called?',
      options: [
        'Replication',
        'Caching',
        'Sharding (partitioning)',
        'Load balancing',
      ],
      answerIndex: 2,
      explain:
        'Splitting data by a key (user ID) across machines is sharding. Replication copies data; sharding splits it.',
    },
    {
      kind: 'tf',
      prompt:
        'During a network partition, a CP system will stay available at the cost of potentially stale reads, while an AP system will refuse requests to preserve consistency.',
      answer: false,
      explain:
        'It is the other way around. CP refuses or delays to preserve consistency. AP stays available at the cost of staleness. A common trick question in interviews.',
    },
    {
      kind: 'mcq',
      prompt:
        "You're designing a feature where a user's notification badge count can be a second behind but must never show 'service unavailable.' Which consistency model fits?",
      options: [
        'Strong consistency — every read must reflect the latest write',
        'Eventual consistency — replicas converge quickly and brief staleness is acceptable',
        'No consistency — data can be randomly wrong forever',
        'Linearizable consistency with a 2-phase commit',
      ],
      answerIndex: 1,
      explain:
        'A notification count that is a second behind is fine; downtime is not. Eventual consistency fits perfectly.',
    },
    {
      kind: 'mcq',
      prompt:
        'A Raft cluster has 5 nodes and 2 crash. Can the remaining 3 still reach consensus?',
      options: [
        'No — any crash stops the cluster',
        'Yes — 3 out of 5 is still a majority, so consensus can continue',
        'Only if all 3 agree unanimously',
        'Only if the crashed nodes come back within 10 seconds',
      ],
      answerIndex: 1,
      explain:
        '3 of 5 is a majority. The cluster can elect a leader and process writes. This is exactly why consensus clusters run with an odd number of nodes.',
    },
  ],
};
