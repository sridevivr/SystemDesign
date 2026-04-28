import type { Unit } from './types';
import { unit01Foundations } from './unit-01-foundations';
import { unit02Networking } from './unit-02-networking';
import { unit03Scaling } from './unit-03-scaling';
import { unit04Databases } from './unit-04-databases';
import { unit05Caching } from './unit-05-caching';
import { unit06AsyncQueues } from './unit-06-async-queues';
import { unit07Distributed } from './unit-07-distributed';
import { unit08DesignPatterns } from './unit-08-design-patterns';
import { unit09RealWorld } from './unit-09-real-world';

// Ordered curriculum. Units are played in array order. Lessons inside
// each unit are played in their own array order. The "next lesson" is
// always the first incomplete lesson in this flat sequence.
export const curriculum: Unit[] = [
  unit01Foundations,
  unit02Networking,
  unit03Scaling,
  unit04Databases,
  unit05Caching,
  unit06AsyncQueues,
  unit07Distributed,
  unit08DesignPatterns,
  unit09RealWorld,
];

export type { Unit, Lesson, Question, RealWorldExample, Analogy } from './types';
