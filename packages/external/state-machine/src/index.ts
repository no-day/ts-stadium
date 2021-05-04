/** @since 1.0.0 */

import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/HKT'
import { pipe } from 'fp-ts/function'
import * as R from 'fp-ts/Record'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import { eqStrict } from 'fp-ts/Eq'
import { Monad1 } from 'fp-ts/Monad'
import {
  NoData,
  Tagged,
  Union,
  TupleToUnion,
  Normalize,
  Tuple,
  RecordVal,
} from '@ts-stadium/type-utils'

// ----------------------------------------------------------------------------
// Model
// ----------------------------------------------------------------------------

/**
 * ...
 *
 * @since 1.0.0
 * @category Model
 */
export interface StateMachine<SMS extends StateMachineSpec = StateMachineSpec>
  extends ImplStateMachine<SMS> {
  readonly StateMachine: unique symbol
}

interface ImplStateMachine<SMS extends StateMachineSpec = StateMachineSpec> {
  states: {
    [S in keyof SMS['states']]: {
      data: Tagged<S, Normalize<SMS['states'][S]['data'], NoData>>
      events: Normalize<SMS['states'][S]['events'], []>
      init: Normalize<SMS['states'][S]['init'], false>
    }
  }

  events: {
    [E in keyof SMS['events']]: {
      data: Tagged<E, Normalize<SMS['events'][E]['data'], NoData>>
      toStates: Normalize<SMS['events'][E]['toStates'], []>
      toEvents: Normalize<SMS['events'][E]['toEvents'], []>
    }
  }
}

type StateMachine_ = StateMachine<StateMachineSpec>

/**
 * ...
 *
 * @since 1.0.0
 * @category Model
 */
export type Name = string | symbol | number

/**
 * Describes state and transition relations of a state machine. Argument fop
 * `createStateMachine`.
 *
 * @since 1.0.0
 * @category Model
 */
export interface StateMachineSpec<
  S extends Name = Name,
  E extends Name = Name
> {
  states: Record<
    S,
    {
      data?: any
      events?: Tuple<E>
      init?: boolean
    }
  >

  events: Record<
    E,
    {
      data?: any
      toStates?: Tuple<S>
      toEvents?: Tuple<E>
    }
  >
}

// ----------------------------------------------------------------------------
// Constructors
// ----------------------------------------------------------------------------

const normailizeSMState = ({
  events = [],
  data,
  init = false,
}: RecordVal<StateMachineSpec['states']>): RecordVal<
  StateMachine['states']
> => ({ data, events, init })

const normailizeSMEvent = ({
  data,
  toEvents = [],
  toStates = [],
}: RecordVal<StateMachineSpec['events']>): RecordVal<
  StateMachine['events']
> => ({ data, toEvents, toStates })

const unsafeCreateStateMachine = (
  data: Omit<StateMachine, 'StateMachine'>
): StateMachine => data as StateMachine

/**
 * Creates a state machine, given a data type and a description of valid transitions.
 *
 * @since 1.0.0
 * @category Constructors
 * @example
 *   import { createStateMachine } from '@no-day/ts-stadium'
 *
 *   const stateMachine = createStateMachine({
 *     states: {
 *       On: { events: ['Toggle'] },
 *       Off: { events: ['Toggle'] },
 *     },
 *     events: {
 *       Toggle: { toStates: ['On', 'Off'] },
 *     },
 *   })
 */
export const createStateMachine = <
  SMS extends StateMachineSpec<keyof SMS['states'], keyof SMS['events']>
>(
  spec: SMS
): StateMachine<SMS> =>
  unsafeCreateStateMachine({
    states: pipe(spec.states, R.map(normailizeSMState)) as any,
    events: pipe(spec.events, R.map(normailizeSMEvent)) as any,
  }) as StateMachine<SMS>

// ----------------------------------------------------------------------------
// Util
// ----------------------------------------------------------------------------

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export const init = <SM extends StateMachine_>(
  stateMachine: SM,
  initState: InitState<SM['states']>
): StateData<SM> => initState

// ----------------------------------------------------------------------------
// Destructors
// ----------------------------------------------------------------------------

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export type CoStateToEvent<
  SM extends StateMachine,
  E extends Event<SM>
> = ExtendsGuard<ImplCoStateToEvent<SM, E>, State<SM>>

type ImplCoStateToEvent<SM extends StateMachine, E extends Event<SM>> = Union<
  {
    [S in State<SM>]: StateToEvent<S, SM> extends E ? S : never
  }
>

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export type Event<SM extends StateMachine> = ExtendsGuard<ImplEvent<SM>, Name>

type ImplEvent<SM extends StateMachine> = keyof SM['events']

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export type EventData<SM extends StateMachine> = ImplEventData<SM>

type ImplEventData<SM extends StateMachine> = Union<MapData<SM['events']>>

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export type EventToEvent<
  SM extends StateMachine,
  E extends Event<SM>
> = ExtendsGuard<ImplEvenToEvent<SM, E>, Event<SM>>

type ImplEvenToEvent<
  SM extends StateMachine,
  E extends Event<SM>
> = TupleToUnion<SM['events'][E]['toEvents']>

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export type EventToState<
  SM extends StateMachine,
  E extends Event<SM>
> = ExtendsGuard<ImplEventToState<SM, E>, State<SM>>

type ImplEventToState<
  SM extends StateMachine,
  E extends Event<SM>
> = TupleToUnion<SM['events'][E]['toStates']>

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export type InitState<T extends StateMachine['states']> = T[Union<
  InitStates<T>
>]['data']

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export type InitStates<T extends StateMachine['states']> = {
  [S in keyof T]: true extends T[S]['init'] ? S : never
}

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export type State<T extends { states: Record<Name, any> }> = keyof T['states']

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export type StateData<SM extends StateMachine> = ImplStateData<SM>

type ImplStateData<SM extends StateMachine> = Union<MapData<SM['states']>>

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export type StateToEvent<
  S extends State<SM>,
  SM extends StateMachine
> = TupleToUnion<SM['states'][S]['events']>

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export const stateToEvents = <SM extends StateMachine>(
  stateMachine: SM,
  state: State<SM>
): Event<SM>[] => stateMachine.states[state].events

/**
 * ...
 *
 * @since 1.0.0
 * @category Destructors
 */
export const coStateToEvent = <SM extends StateMachine_>(
  stateMachine: SM,
  event: Event<SM>
): State<SM>[] =>
  pipe(
    stateMachine.states,
    R.collect((k, v) => [k, v] as const),
    A.filterMap(([k, { events }]) =>
      A.elem(eqStrict)(event)(events as Event<SM>[]) ? O.some(k) : O.none
    )
  )

// ----------------------------------------------------------------------------
// Internal
// ----------------------------------------------------------------------------

/**
 * ...
 *
 * @since 1.0.0
 * @category Internal
 */
export type MapData<T extends Record<Name, { data: any }>> = {
  [E in keyof T]: T[E]['data']
}

type ExtendsGuard<T extends G, G> = T
