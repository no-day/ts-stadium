/** @since 1.0.0 */

import * as Graphviz from 'ts-graphviz';
import * as R from 'fp-ts/Record';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';

// --------------------------------------------------------------------------------------------------------------------
// Model
// --------------------------------------------------------------------------------------------------------------------

/**
 * A type that describes data relations of a state machine.
 *
 * @since 1.0.0
 * @category Constructors
 */
export type StateMachine<data extends StateMachineData> = {
  states: {
    [key in keyof data['states']]: {
      data: data['states'][key];
      events: (keyof data['events'])[];
    };
  };
  events: {
    [key in keyof data['events']]: {
      data: data['events'][key];
      toStates?: (keyof data['states'])[];
      toEvents?: (keyof data['events'])[];
    };
  };
};

// --------------------------------------------------------------------------------------------------------------------
// Constructors
// --------------------------------------------------------------------------------------------------------------------

/**
 * Describes the data of a state machine. That means, the types for each state plus the payloads for each event.
 *
 * @since 1.0.0
 * @category Constructors
 */
export type StateMachineData = {
  states: Record<string, unknown>;
  events: Record<string, unknown>;
};

/**
 * Describes state and transition relations of a state machine.
 *
 * @since 1.0.0
 * @category Constructors
 */
export type StateMachineSpec<data extends StateMachineData> = {
  states: Record<
    keyof data['states'],
    {
      events: (keyof data['events'])[];
    }
  >;
  events: Record<
    keyof data['events'],
    {
      toStates?: (keyof data['states'])[];
      toEvents?: (keyof data['events'])[];
    }
  >;
};

/**
 * Creates a state machine, given a data type and a description of valid transitions.
 *
 * @since 1.0.0
 * @category Constructors
 * @example
 *   import { createStateMachine } from 'fp-ts-library-template';
 *
 *   type StateMachine = {
 *     states: { On: true; Off: false };
 *     events: { Toggle: null };
 *   };
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
 */
export const createStateMachine = <data extends StateMachineData>() => <spec extends StateMachineSpec<data>>(
  spec: spec
): StateMachine<data> => (spec as unknown) as StateMachine<data>;
