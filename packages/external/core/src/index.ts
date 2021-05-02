/** @since 1.0.0 */

import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/HKT';
import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import { eqStrict } from 'fp-ts/Eq';
import { Monad1 } from 'fp-ts/Monad';
import { NoData, Tagged, Union } from '@ts-stadium/type-utils';

// ----------------------------------------------------------------------------
// Model
// ----------------------------------------------------------------------------

/**
 * A type that describes data relations of a state machine.
 *
 * @since 1.0.0
 * @category Constructors
 */
export interface StateMachine<SMS extends StateMachineSpec = StateMachineSpec> {
  states: {
    [S in keyof SMS['states']]: {
      data: Tagged<S, Normalize<SMS['states'][S]['data'], NoData>>;
      events: Normalize<SMS['states'][S]['events'], []>;
      init: Normalize<SMS['states'][S]['init'], false>;
    };
  };

  events: {
    [E in keyof SMS['events']]: {
      data: Tagged<E, Normalize<SMS['events'][E]['data'], NoData>>;
      toStates: Normalize<SMS['events'][E]['toStates'], []>;
      toEvents: Normalize<SMS['events'][E]['toEvents'], []>;
    };
  };
}

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
export interface StateMachineSpec<
  S extends Name = Name,
  E extends Name = Name
> {
  states: Record<
    S,
    {
      data?: any;
      events?: Tuple<E>;
      init?: boolean;
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
}

const normailizeSMState = ({
  events = [],
  data,
  init = false,
}: RecordVal<StateMachineSpec['states']>): RecordVal<
  StateMachine['states']
> => ({ data, events, init });

const normailizeSMEvent = ({
  data,
  toEvents = [],
  toStates = [],
}: RecordVal<StateMachineSpec['events']>): RecordVal<
  StateMachine['events']
> => ({ data, toEvents, toStates });

const unsafeCreateStateMachine = (
  data: Omit<StateMachine, 'StateMachine'>
): StateMachine => data as StateMachine;

/**
 * Creates a state machine, given a data type and a description of valid transitions.
 *
 * @since 1.0.0
 * @category Constructors
 * @example
 *   import { createStateMachine } from '@no-day/ts-stadium';
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
 */
export const createStateMachine = <
  SMS extends StateMachineSpec<keyof SMS['states'], keyof SMS['events']>
>(
  spec: SMS
): Extract<StateMachine<SMS>> =>
  unsafeCreateStateMachine({
    states: pipe(spec.states, R.map(normailizeSMState)) as any,
    events: pipe(spec.events, R.map(normailizeSMEvent)) as any,
  }) as StateMachine<SMS>;

// ----------------------------------------------------------------------------
// Control
// ----------------------------------------------------------------------------

type ControlEvents<C extends URIS, SM extends StateMachine> = {
  [E in Event<SM>]: (
    state: SM['states'][EventIncomingState<E, SM>]['data']
  ) => Kind<
    C,
    (
      state: SM['states'][EventIncomingState<E, SM>]['data']
    ) => {
      event?: SM['states'][EventOutgoingEvent<E, SM>]['data'];
      state?: SM['states'][EventOutgoingState<E, SM>]['data'];
    }
  >;
};

/**
 * @since 1.0.0
 * @category Control
 * @example
 *   import * as SM from '@no-day/ts-stadium';
 *
 *   const stateMachine = SM.createStateMachine({
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
export const createControl = <SM extends StateMachine>(stateMachine: SM) => <
  C extends URIS
>(
  C: Monad1<C>
) => (controlEvents: ControlEvents<C, SM>) => (
  event: Extract<EventData<SM>>,
  state: Extract<StateData<SM>>
): Kind<C, GetNext<SM>> =>
  A.elem(eqStrict)(event.tag, stateMachine.states[state.tag].events)
    ? // Capture Event
      controlEvents[event.tag](state)
    : // Drop Event
      C.of({} as GetNext<SM>);

// ----------------------------------------------------------------------------
// Render
// ----------------------------------------------------------------------------

type RenderStates<R extends URIS, SM extends StateMachine> = {
  [S in State<SM>]: (
    state: SM['states'][S]['data']
  ) => Kind<R, SM['events'][StateOutgoingEvent<S, SM>]['data']>;
};

type RenderStates2<R extends URIS2, B, SM extends StateMachine> = {
  [S in State<SM>]: (
    state: SM['states'][S]['data']
  ) => Kind2<R, B, SM['events'][StateOutgoingEvent<S, SM>]['data']>;
};

/**
 * @since 1.0.0
 * @category Render
 */
export const createRender: {
  <SM extends StateMachine>(stateMachine: SM): <R extends URIS2, B>(
    renderStates: RenderStates2<R, B, SM>
  ) => (state: StateData<SM>) => Kind2<R, B, EventData<SM>>;

  <SM extends StateMachine>(stateMachine: SM): <R extends URIS>(
    renderStates: RenderStates<R, SM>
  ) => (state: StateData<SM>) => Kind<R, EventData<SM>>;
} = (stateMachine: any) => (renderStates: any) => (state: any) =>
  renderStates[state.tag](state);

// ----------------------------------------------------------------------------
// Util
// ----------------------------------------------------------------------------

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export const init = <SM extends StateMachine>(
  stateMachine: SM,
  initState: SM['states'][InitState<SM>]['data']
): StateData<SM> => initState;

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export const typeOf = <T>() => ({} as T);

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export type Name = string | symbol | number;

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export type StateData<SM extends StateMachine> = Union<
  {
    [S in State<SM>]: SM['states'][S]['data'];
  }
>;

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export type EventData<SM extends StateMachine> = Union<
  {
    [E in Event<SM>]: SM['events'][E]['data'];
  }
>;

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export type InitState<SM extends StateMachine> = Union<
  {
    [S in keyof SM['states']]: true extends SM['states'][S]['init'] ? S : never;
  }
>;

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export { tag } from '@ts-stadium/type-utils';

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

export type State<SM extends StateMachine> = keyof SM['states'];

type Event<SM extends StateMachine> = keyof SM['events'];

type StateOutgoingEvent<
  S extends State<SM>,
  SM extends StateMachine
> = TupleToUnion<SM['states'][S]['events']>;

const stateOutgoingEvent = <SM extends StateMachine>(
  stateMachine: SM,
  state: State<SM>
): Event<SM>[] => stateMachine.states[state].events;

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

export const eventIncomingState = <SM extends StateMachine>(
  stateMachine: SM,
  event: Event<SM>
): State<SM>[] =>
  pipe(
    stateMachine.states,
    R.collect((k, v) => [k, v] as const),
    A.filterMap(([k, { events }]) =>
      A.elem(eqStrict)(event)(events as Event<SM>[]) ? O.some(k) : O.none
    )
  );

type Extract<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type Normalize<T, A> = IsAny<T> extends false
  ? NormalizeUnknown<NormalizeUndefined<T, A>, A>
  : T;

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

type RecordVal<R> = R extends Record<infer K, infer V> ? V : never;

type IsAny<T> = 0 extends 1 & T ? true : false;

type GetNext<SM extends StateMachine> = (
  state: StateData<SM>
) => {
  event?: EventData<SM>;
  state?: StateData<SM>;
};
