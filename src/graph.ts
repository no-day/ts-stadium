/** @since 1.0.0 */

import * as Graphviz from 'ts-graphviz';
import * as R from 'fp-ts/Record';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import { StateMachine, StateMachineSpec, Name } from '.';
import * as S from 'fp-ts/Semigroup';

// --------------------------------------------------------------------------------------------------------------------
// Model
// --------------------------------------------------------------------------------------------------------------------

/**
 * Graph representation of a state machine
 *
 * @since 1.0.0
 * @category Model
 */
export type StateMachineGraph = {
  nodes: Array<{
    tag: 'Event' | 'State';
    id: string;
  }>;
  edges: Array<{
    from: string;
    to: string;
  }>;
};

// --------------------------------------------------------------------------------------------------------------------
// Constructors
// --------------------------------------------------------------------------------------------------------------------

const createNodes = (
  stateMachine: StateMachine
): StateMachineGraph['nodes'] => [
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
];

const createEdgesFromStates = (
  stateMachine: StateMachine
): StateMachineGraph['edges'] =>
  pipe(
    stateMachine.states,
    R.collect((key, val) => [key, val] as const),
    A.chain(([from, { events }]) =>
      pipe(
        events as Name[],
        A.map((to) => ({ from: (from as Name).toString(), to: to.toString() }))
      )
    )
  );

const createEdgesFromEvents = (
  stateMachine: StateMachine
): StateMachineGraph['edges'] =>
  pipe(
    stateMachine.events,
    R.collect((key, val) => [key, val] as const),
    A.chain(([from, { toStates, toEvents }]) =>
      pipe(
        [...toStates, ...toEvents],
        A.map((to) => ({ from: (from as Name).toString(), to: to.toString() }))
      )
    )
  );

const createEdges = (
  stateMachine: StateMachine
): StateMachineGraph['edges'] => [
  ...createEdgesFromStates(stateMachine),
  ...createEdgesFromEvents(stateMachine),
];

/**
 * Creates a graph representation of a state machine. Suitable for any renderer.
 *
 * @since 1.0.0
 * @category Constructors
 * @example
 *   import { createStateMachine } from 'fp-ts-library-template';
 *   import { createGraph } from 'fp-ts-library-template/graph';
 *
 *   const stateMachine = createStateMachine<StateMachine>()({
 *     states: {
 *       On: { events: ['Toggle'] },
 *       Off: { events: ['Toggle'] },
 *     },
 *     events: {
 *       Toggle: { toStates: ['On', 'Off'] },
 *     },
 *   });
 *
 *   assert.deepStrictEqual(createGraph(stateMachine), {
 *     edges: [
 *       { from: 'Off', to: 'Toggle' },
 *       { from: 'On', to: 'Toggle' },
 *       { from: 'Toggle', to: 'On' },
 *       { from: 'Toggle', to: 'Off' },
 *     ],
 *     nodes: [
 *       { id: 'Off', tag: 'State' },
 *       { id: 'On', tag: 'State' },
 *       { id: 'Toggle', tag: 'Event' },
 *     ],
 *   });
 */
export const createGraph = (stateMachine: StateMachine): StateMachineGraph => ({
  nodes: createNodes(stateMachine),
  edges: createEdges(stateMachine),
});

/**
 * It's a greeting
 *
 * @since 1.0.0
 * @category Util
 */
export const graphToDot = (graph: StateMachineGraph): string => {
  const g = Graphviz.digraph();

  graph.nodes.forEach((node) =>
    g.createNode(
      node.id,
      {
        State: {
          shape: 'box',
          style: 'rounded, filled',
          fillcolor: '#82E0AA',
        },
        Event: {
          shape: 'box',
          style: 'filled',
          fillcolor: '#F6DDCC',
          height: 0.2,
        },
      }[node.tag]
    )
  );

  graph.edges.forEach((edge) => g.createEdge([edge.from, edge.to]));

  return Graphviz.toDot(g);
};
