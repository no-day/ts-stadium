/** @since 1.0.0 */

import * as Graphviz from 'ts-graphviz';
import * as R from 'fp-ts/Record';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';

// --------------------------------------------------------------------------------------------------------------------
// Util
// --------------------------------------------------------------------------------------------------------------------

/**
 * It's a greeting
 *
 * @since 1.0.0
 * @category Util
 * @example
 *   import { createStateMachine } from 'fp-ts-library-template';
 *
 *   type StateMachine = { states: { On: true; Off: false }; events: { Toggle: null } };
 *
 *   const stateMachine = createStateMachine<StateMachine>()({
 *     states: { On: { events: ['Toggle'] }, Off: { events: ['Toggle'] } },
 *     events: { Toggle: { toStates: ['On', 'Off'] } },
 *   });
 */
export const createStateMachine = <T extends TSpec>() => <spec extends Spec<T>>(spec: spec): StateMachine<T> =>
  (spec as unknown) as StateMachine<T>;

/**
 * It's a greeting
 *
 * @since 1.0.0
 * @category Util
 */
export const toGraph = (stateMachine: StateMachine<any>): Graph => ({
  nodes: [
    ...pipe(
      stateMachine.states,
      R.keys,
      A.map((id) => ({ tag: 'State' as const, id }))
    ),
    ...pipe(
      stateMachine.events,
      R.keys,
      A.map((id) => ({ tag: 'Event' as const, id }))
    ),
  ],
  edges: [
    ...pipe(
      stateMachine.states,
      R.collect((key, val) => [key, val] as const),
      A.chain(([from, { events }]) =>
        pipe(
          events,
          A.map((to) => ({ from: from.toString(), to: to.toString() }))
        )
      )
    ),
    ...pipe(
      stateMachine.events,
      R.collect((key, val) => [key, val] as const),
      A.chain(([from, { toStates, toEvents }]) =>
        pipe(
          [...(toStates || []), ...(toEvents || [])],
          A.map((to) => ({ from: from.toString(), to: to.toString() }))
        )
      )
    ),
  ],
});

/**
 * It's a greeting
 *
 * @since 1.0.0
 * @category Util
 */
export const graphToDot = (graph: Graph): string => {
  const g = Graphviz.digraph();

  graph.nodes.forEach((node) =>
    g.createNode(
      node.id,
      {
        State: { shape: 'box', style: 'rounded, filled', fillcolor: '#82E0AA' },
        Event: { shape: 'box', style: 'filled', fillcolor: '#F6DDCC', height: 0.2 },
      }[node.tag]
    )
  );

  graph.edges.forEach((edge) => g.createEdge([edge.from, edge.to]));

  return Graphviz.toDot(g);
};

// --------------------------------------------------------------------------------------------------------------------
// Internal
// --------------------------------------------------------------------------------------------------------------------

type TSpec = { states: Record<any, any>; events: Record<any, any> };

type Spec<T extends TSpec> = {
  states: Record<keyof T['states'], { events: (keyof T['events'])[] }>;
  events: Record<keyof T['events'], { toStates?: (keyof T['states'])[]; toEvents?: (keyof T['events'])[] }>;
};

type StateMachine<T extends TSpec> = {
  states: {
    [key in keyof T['states']]: {
      data: T['states'][key];
      events: (keyof T['events'])[];
    };
  };
  events: {
    [key in keyof T['events']]: {
      data: T['events'][key];
      toStates?: (keyof T['states'])[];
      toEvents?: (keyof T['events'])[];
    };
  };
};

type Graph = {
  nodes: { tag: 'Event' | 'State'; id: string }[];
  edges: { from: string; to: string }[];
};
