/** @since 1.0.0 */

import { Kind, URIS } from 'fp-ts/HKT';
import { StateMachineGraph } from './graph';

// ----------------------------------------------------------------------------
// Model
// ----------------------------------------------------------------------------

/**
 * A type that describes data relations of a state machine.
 *
 * @since 1.0.0
 * @category Constructors
 */
export type StateMachine<
  SMS extends StateMachineSpec<any, any> = StateMachineSpec<any, any>
> = {
  readonly StateMachine: unique symbol;

  states: {
    [S in keyof SMS['states']]: {
      data: Tagged<S, SMS['states'][S]['data']>;
      events: SMS['states'][S]['events'];
    };
  };

  events: {
    [E in keyof SMS['events']]: {
      data: Tagged<E, SMS['events'][E]['data']>;
      toStates: SMS['events'][E]['toStates'];
      toEvents: SMS['events'][E]['toEvents'];
    };
  };
};

// ----------------------------------------------------------------------------
// Constructors
// ----------------------------------------------------------------------------

/**
 * Describes state and transition relations of a state machine. Argument fop
 * `createStateMachine`.
 *
 * @since 1.0.0
 * @category Constructors
 */
export type StateMachineSpec<S extends Name, E extends Name> = {
  states: Record<
    S,
    {
      events?: Tuple<E>;
      data?: any;
    }
  >;

  events: Record<
    E,
    {
      toStates?: Tuple<S>;
      toEvents?: Tuple<E>;
      data?: any;
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
export const createStateMachine = <
  spec extends StateMachineSpec<keyof spec['states'], keyof spec['events']>
>(
  spec: spec
): StateMachine<spec> => spec as any;

// ----------------------------------------------------------------------------
// Control
// ----------------------------------------------------------------------------

type ControlEvents<C extends URIS, SM extends StateMachine> = {
  [E in Event<SM>]: (
    state: SM['states'][EventIncomingState<E, SM>]['data']
  ) => Kind<
    C,
    {
      event?: SM['states'][EventOutgoingEvent<E, SM>]['data'];
      state?: SM['states'][EventOutgoingState<E, SM>]['data'];
    }
  >;
};

export const createControl = <C extends URIS>() => <SM extends StateMachine>(
  stateMachine: SM,
  controlEvents: ControlEvents<C, SM>
): ((
  event: EventData<SM>,
  state: StateData<SM>
) => Kind<
  C,
  {
    event?: EventData<SM>;
    state?: StateData<SM>;
  }
>) => 1 as any;

// ----------------------------------------------------------------------------
// Render
// ----------------------------------------------------------------------------

type RenderStates<R extends URIS, SM extends StateMachine> = {
  [S in State<SM>]: (
    state: SM['states'][S]['data']
  ) => Kind<R, StateOutgoingEvent<S, SM>>;
};

export const createRender = <R extends URIS>() => <SM extends StateMachine>(
  stateMachine: SM,
  renderStates: RenderStates<R, SM>
): ((state: StateData<SM>) => Kind<R, EventData<SM>>) => 1 as any;

// ----------------------------------------------------------------------------
// Util
// ----------------------------------------------------------------------------

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export const tag = <Tag extends string, Data>(tag: Tag, data?: Data) => ({
  tag,
  data,
});

// ----------------------------------------------------------------------------
// Internal
// ----------------------------------------------------------------------------

type UndefinedToEmptyTuple<T> = T extends undefined ? [] : T;

type TupleToUnion<T extends any[]> = T[number];

type TupleOrUndefinedToUnion<T extends any[] | undefined> = TupleToUnion<
  UndefinedToEmptyTuple<T>
>;

type Name = string | symbol | number;

type Tuple<T> =
  | []
  | [T]
  | [T, T]
  | [T, T, T]
  | [T, T, T, T]
  | [T, T, T, T, T]
  | [T, T, T, T, T, T]
  | [T, T, T, T, T, T, T]
  | [T, T, T, T, T, T, T, T]
  | [T, T, T, T, T, T, T, T, T]
  | [T, T, T, T, T, T, T, T, T, T];

type Tagged<T, D> = { tag: T; data: D };

type Union<T> = T[keyof T];

type StateData<SM extends StateMachine> = Union<
  {
    [S in State<SM>]: SM['states'][S]['data'];
  }
>;

type EventData<SM extends StateMachine> = Union<
  {
    [E in Event<SM>]: SM['events'][E]['data'];
  }
>;

type State<SM extends StateMachine> = keyof SM['states'];

type Event<SM extends StateMachine> = keyof SM['events'];

type StateOutgoingEvent<
  S extends State<SM>,
  SM extends StateMachine
> = TupleOrUndefinedToUnion<SM['states'][S]['events']>;

type EventOutgoingEvent<
  E extends Event<SM>,
  SM extends StateMachine
> = TupleOrUndefinedToUnion<SM['events'][E]['toEvents']>;

type EventOutgoingState<
  E extends Event<SM>,
  SM extends StateMachine
> = TupleOrUndefinedToUnion<SM['events'][E]['toStates']>;

type EventIncomingState<E extends Event<SM>, SM extends StateMachine> = Union<
  {
    [S in State<SM>]: StateOutgoingEvent<S, SM> extends E ? S : never;
  }
>;
