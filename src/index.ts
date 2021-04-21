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
export type StateMachine<SMS extends StateMachineSpec = StateMachineSpec> = {
  readonly StateMachine: unique symbol;

  states: {
    [S in keyof SMS['states']]: {
      data: Tagged<S, SMS['states'][S]['data']>;
      events: Normalize<SMS['states'][S]['events'], []>;
    };
  };

  events: {
    [E in keyof SMS['events']]: {
      data: Tagged<E, SMS['events'][E]['data']>;
      toStates: Normalize<SMS['events'][E]['toStates'], []>;
      toEvents: Normalize<SMS['events'][E]['toEvents'], []>;
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
export type StateMachineSpec<S extends Name = Name, E extends Name = Name> = {
  states: Record<
    S,
    {
      data?: any;
      events?: Tuple<E>;
    }
  >;

  events: Record<
    E,
    {
      data?: any;
      toStates?: Tuple<S>;
      toEvents?: Tuple<E>;
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
  S extends keyof SMS['states'],
  E extends keyof SMS['events'],
  SMS extends StateMachineSpec<S, E>
>(
  spec: SMS
): Extract<StateMachine<SMS>> => spec as any;

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

/**
 * @since 1.0.0
 * @category Control
 * @example
 *   import * as SM from 'fp-ts-library-template';
 *
 *   const stateMachine = SM.createStateMachine<StateMachine>()({
 *     states: {
 *       On: { events: ['Toggle'] },
 *       Off: { events: ['Toggle'] },
 *     },
 *     events: {
 *       Toggle: { toStates: ['On', 'Off'] },
 *     },
 *   });
 *
 *   const control = SM.createControl(stateMachine, {
 *     Toggle: () => Promise.resolve(SM.tag('On')),
 *   });
 */
export const createControl = <C extends URIS>() => <SM extends StateMachine>(
  stateMachine: SM,
  controlEvents: ControlEvents<C, SM>
): ((
  event: Extract<EventData<SM>>,
  state: Extract<StateData<SM>>
) => Kind<
  C,
  {
    event?: Extract<EventData<SM>>;
    state?: Extract<StateData<SM>>;
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

/**
 * @since 1.0.0
 * @category Render
 */
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

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export type Name = string | symbol | number;

// ----------------------------------------------------------------------------
// Internal
// ----------------------------------------------------------------------------

type TupleToUnion<T extends any[]> = T[number];

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
> = TupleToUnion<SM['states'][S]['events']>;

type EventOutgoingEvent<
  E extends Event<SM>,
  SM extends StateMachine
> = TupleToUnion<SM['events'][E]['toEvents']>;

type EventOutgoingState<
  E extends Event<SM>,
  SM extends StateMachine
> = TupleToUnion<SM['events'][E]['toStates']>;

type EventIncomingState<E extends Event<SM>, SM extends StateMachine> = Union<
  {
    [S in State<SM>]: StateOutgoingEvent<S, SM> extends E ? S : never;
  }
>;

type Extract<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type Normalize<T, A> = NormalizeUnknown<NormalizeUndefined<T, A>, A>;

type NormalizeUndefined<T, A> = T extends undefined
  ? undefined extends T
    ? A
    : T
  : T;

type NormalizeUnknown<T, A> = T extends unknown
  ? unknown extends T
    ? A
    : T
  : T;
