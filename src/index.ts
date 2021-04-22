/** @since 1.0.0 */

import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/HKT';
import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';

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

const normailizeSMState = ({
  events = [],
  data,
}: RecordVal<StateMachineSpec['states']>): RecordVal<
  StateMachine['states']
> => ({ data, events });

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
 *   import { createStateMachine } from 'fp-ts-library-template';
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
  S extends keyof SMS['states'],
  E extends keyof SMS['events'],
  SMS extends StateMachineSpec<S, E>
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
  <R extends URIS>(): <SM extends StateMachine>(
    stateMachine: SM,
    renderStates: RenderStates<R, SM>
  ) => (state: StateData<SM>) => Kind<R, EventData<SM>>;
  <R extends URIS2, B>(): <SM extends StateMachine>(
    stateMachine: SM,
    renderStates: RenderStates2<R, B, SM>
  ) => (state: StateData<SM>) => Kind2<R, B, EventData<SM>>;
} = 1 as any;

type Render<R extends URIS, SM extends StateMachine> = (
  state: StateData<SM>
) => Kind<R, EventData<SM>>;

// ----------------------------------------------------------------------------
// Callback
// ----------------------------------------------------------------------------

export type CallbackEvent<B, A> = (onEvent: (event: A) => void) => B;

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    CallbackEvent: CallbackEvent<E, A>;
  }
  interface URItoKind<A> {
    Promise: Promise<A>;
  }
}

type UncurryToOptions<K, F, O = {}> = F extends (x: infer A) => infer B
  ? K extends [infer headK, ...infer tailK]
    ? headK extends string
      ? UncurryToOptions<tailK, B, O & Record<headK, A>>
      : never
    : (opts: Extract<O>) => F
  : (opts: Extract<O>) => F;

export const createCallbackRender: {
  <B>(): <SM extends StateMachine>(
    stateMachine: SM,
    renderStates: RenderStates2<'CallbackEvent', B, SM>
  ) => (opts: {
    state: StateData<SM>;
    onEvent: (event: EventData<SM>) => void;
  }) => B;
} = 1 as any;

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

export type StateData<SM extends StateMachine> = Union<
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

type RecordVal<R> = R extends Record<infer K, infer V> ? V : never;
