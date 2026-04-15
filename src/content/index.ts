import type { Unit } from './types';
import { unit01Foundations } from './unit-01-foundations';
import { unit02Networking } from './unit-02-networking';
import { unit03Scaling } from './unit-03-scaling';

// Ordered curriculum. Units are played in array order. Lessons inside
// each unit are played in their own array order. The "next lesson" is
// always the first incomplete lesson in this flat sequence.
export const curriculum: Unit[] = [
  unit01Foundations,
  unit02Networking,
  unit03Scaling,
];

// Future units — not shipped yet, just a roadmap visible in code.
//
// - Unit 4: Databases (SQL vs NoSQL, indexing, ACID, transactions)
// - Unit 5: Caching (strategies, eviction, CDNs)
// - Unit 6: Async & queues (pub/sub, idempotency)
// - Unit 7: Distributed systems (replication, sharding, CAP, consistency)
// - Unit 8: Design patterns (rate limiting, circuit breakers)
// - Unit 9: Real-world designs (URL shortener, chat, feed, rate limiter)

export type { Unit, Lesson, Question, RealWorldExample, Analogy } from './types';
