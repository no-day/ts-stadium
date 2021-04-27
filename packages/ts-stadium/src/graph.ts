/** @since 1.0.0 */

import * as Graphviz from 'ts-graphviz';
import * as R from 'fp-ts/Record';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import { StateMachine, StateMachineSpec, Name } from '.';
import * as S from 'fp-ts/Semigroup';
import { tag, Tagged, Union } from './types';

// --------------------------------------------------------------------------------------------------------------------
// Model
// --------------------------------------------------------------------------------------------------------------------

type NodeCommon = {
  id: string;
};

type Node_ = {
  State: NodeCommon & {
    isSelected: boolean;
    isInit: boolean;
  };
  Event: NodeCommon & {
    isReachable: boolean;
  };
};

export type Node = TaggedUnion<Node_>;

type EdgeCommon = {
  from: string;
  to: string;
  isReachable: boolean;
};

type Edge_ = {
  FromState: EdgeCommon;
  FromEvent: EdgeCommon;
};

export type Edge = TaggedUnion<Edge_>;

/**
 * Graph representation of a state machine
 *
 * @since 1.0.0
 * @category Model
 */
export type StateMachineGraph = {
  nodes: Array<Node>;
  edges: Array<Edge>;
};

// --------------------------------------------------------------------------------------------------------------------
// Constructors
// --------------------------------------------------------------------------------------------------------------------

const createNodes = (
  stateMachine: StateMachine
): StateMachineGraph['nodes'] => [
  ...pipe(
    stateMachine.states,
    R.collect((id, node) =>
      tag('State', {
        isSelected: false,
        isInit: node.init,
        id,
      })
    )
  ),
  ...pipe(
    stateMachine.events,
    R.keys,
    A.map((id) =>
      tag('Event', {
        isReachable: true,
        id,
      })
    )
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
        A.map((to) =>
          tag('FromState', {
            from: (from as Name).toString(),
            to: to.toString(),
            isReachable: true,
          })
        )
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
        A.map((to) =>
          tag('FromEvent', {
            from: (from as Name).toString(),
            to: to.toString(),
            isReachable: true,
          })
        )
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
 *   import { createStateMachine } from '@no-day/ts-stadium';
 *   import { createGraph } from '@no-day/ts-stadium/graph';
 *
 *   const stateMachine = createStateMachine({
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

// --------------------------------------------------------------------------------------------------------------------
// Constructors
// --------------------------------------------------------------------------------------------------------------------

type TaggedUnion<T> = Union<{ [key in keyof T]: Tagged<key, T[key]> }>;
