---
{
  "title": "state-machine",
  "nav_order": 1,
  "parent": "packages",
  "permalink": "/packages/state-machine"
}
---

## index overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [createStateMachine](#createstatemachine)
- [Destructors](#destructors)
  - [CoStateToEvent (type alias)](#costatetoevent-type-alias)
  - [Event (type alias)](#event-type-alias)
  - [EventData (type alias)](#eventdata-type-alias)
  - [EventToEvent (type alias)](#eventtoevent-type-alias)
  - [EventToState (type alias)](#eventtostate-type-alias)
  - [InitState (type alias)](#initstate-type-alias)
  - [InitStates (type alias)](#initstates-type-alias)
  - [State (type alias)](#state-type-alias)
  - [StateData (type alias)](#statedata-type-alias)
  - [StateToEvent (type alias)](#statetoevent-type-alias)
  - [coStateToEvent](#costatetoevent)
  - [stateToEvents](#statetoevents)
- [Internal](#internal)
  - [MapData (type alias)](#mapdata-type-alias)
- [Model](#model)
  - [Name (type alias)](#name-type-alias)
  - [StateMachine (interface)](#statemachine-interface)
  - [StateMachineSpec (interface)](#statemachinespec-interface)
- [Util](#util)
  - [init](#init)

---

# Constructors

## createStateMachine

Creates a state machine, given a data type and a description of valid transitions.

**Signature**

```ts
export declare const createStateMachine: <
  SMS extends StateMachineSpec<keyof SMS['states'], keyof SMS['events']>
>(
  spec: SMS
) => StateMachine<SMS>
```

**Example**

```ts
import { createStateMachine } from '@ts-stadium/state-machine'

const stateMachine = createStateMachine({
  states: {
    On: { events: ['Toggle'] },
    Off: { events: ['Toggle'] },
  },
  events: {
    Toggle: { toStates: ['On', 'Off'] },
  },
})
```

Added in v1.0.0

# Destructors

## CoStateToEvent (type alias)

...

**Signature**

```ts
export type CoStateToEvent<
  SM extends StateMachine,
  E extends Event<SM>
> = ExtendsGuard<ImplCoStateToEvent<SM, E>, State<SM>>
```

Added in v1.0.0

## Event (type alias)

...

**Signature**

```ts
export type Event<SM extends StateMachine> = ExtendsGuard<ImplEvent<SM>, Name>
```

Added in v1.0.0

## EventData (type alias)

...

**Signature**

```ts
export type EventData<SM extends StateMachine> = ImplEventData<SM>
```

Added in v1.0.0

## EventToEvent (type alias)

...

**Signature**

```ts
export type EventToEvent<
  SM extends StateMachine,
  E extends Event<SM>
> = ExtendsGuard<ImplEvenToEvent<SM, E>, Event<SM>>
```

Added in v1.0.0

## EventToState (type alias)

...

**Signature**

```ts
export type EventToState<
  SM extends StateMachine,
  E extends Event<SM>
> = ExtendsGuard<ImplEventToState<SM, E>, State<SM>>
```

Added in v1.0.0

## InitState (type alias)

...

**Signature**

```ts
export type InitState<T extends StateMachine['states']> = T[Union<
  InitStates<T>
>]['data']
```

Added in v1.0.0

## InitStates (type alias)

...

**Signature**

```ts
export type InitStates<T extends StateMachine['states']> = {
  [S in keyof T]: true extends T[S]['init'] ? S : never
}
```

Added in v1.0.0

## State (type alias)

...

**Signature**

```ts
export type State<T extends { states: Record<Name, any> }> = keyof T['states']
```

Added in v1.0.0

## StateData (type alias)

...

**Signature**

```ts
export type StateData<SM extends StateMachine> = ImplStateData<SM>
```

Added in v1.0.0

## StateToEvent (type alias)

...

**Signature**

```ts
export type StateToEvent<
  S extends State<SM>,
  SM extends StateMachine
> = TupleToUnion<SM['states'][S]['events']>
```

Added in v1.0.0

## coStateToEvent

...

**Signature**

```ts
export declare const coStateToEvent: <SM extends StateMachine_>(
  stateMachine: SM,
  event: keyof SM['events']
) => (keyof SM['states'])[]
```

Added in v1.0.0

## stateToEvents

...

**Signature**

```ts
export declare const stateToEvents: <
  SM extends StateMachine<
    StateMachineSpec<string | number | symbol, string | number | symbol>
  >
>(
  stateMachine: SM,
  state: keyof SM['states']
) => (keyof SM['events'])[]
```

Added in v1.0.0

# Internal

## MapData (type alias)

...

**Signature**

```ts
export type MapData<T extends Record<Name, { data: any }>> = {
  [E in keyof T]: T[E]['data']
}
```

Added in v1.0.0

# Model

## Name (type alias)

...

**Signature**

```ts
export type Name = string | symbol | number
```

Added in v1.0.0

## StateMachine (interface)

...

**Signature**

```ts
export interface StateMachine<SMS extends StateMachineSpec = StateMachineSpec>
  extends ImplStateMachine<SMS> {
  readonly StateMachine: unique symbol
}
```

Added in v1.0.0

## StateMachineSpec (interface)

Describes state and transition relations of a state machine. Argument fop
`createStateMachine`.

**Signature**

```ts
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
```

Added in v1.0.0

# Util

## init

...

**Signature**

```ts
export declare const init: <SM extends StateMachine_>(
  stateMachine: SM,
  initState: InitState<SM['states']>
) => Union<MapData<SM['states']>>
```

Added in v1.0.0
