---
{
  "title": "core",
  "nav_order": 1,
  "parent": "packages",
  "permalink": "/packages/core"
}
---

## index overview

...

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [StateMachine (interface)](#statemachine-interface)
  - [StateMachineSpec (interface)](#statemachinespec-interface)
  - [createStateMachine](#createstatemachine)
- [Util](#util)
  - [EventData (type alias)](#eventdata-type-alias)
  - [InitState (type alias)](#initstate-type-alias)
  - [Name (type alias)](#name-type-alias)
  - [State (type alias)](#state-type-alias)
  - [StateData (type alias)](#statedata-type-alias)
  - [eventIncomingState](#eventincomingstate)
  - [init](#init)
  - [tag](#tag)
  - [typeOf](#typeof)

---

# Constructors

## StateMachine (interface)

A type that describes data relations of a state machine.

**Signature**

```ts
export interface StateMachine<SMS extends StateMachineSpec = StateMachineSpec> {
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
```

Added in v1.0.0

## StateMachineSpec (interface)

Describes state and transition relations of a state machine. Argument fop
`createStateMachine`.

**Signature**

```ts
export interface StateMachineSpec<S extends Name = Name, E extends Name = Name> {
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

## createStateMachine

Creates a state machine, given a data type and a description of valid transitions.

**Signature**

```ts
export declare const createStateMachine: <SMS extends StateMachineSpec<keyof SMS['states'], keyof SMS['events']>>(
  spec: SMS
) => {
  states: {
    [S in keyof SMS['states']]: {
      data: any
      events: Normalize<SMS['states'][S]['events'], []>
      init: Normalize<SMS['states'][S]['init'], false>
    }
  }
  events: {
    [E in keyof SMS['events']]: {
      data: any
      toStates: Normalize<SMS['events'][E]['toStates'], []>
      toEvents: Normalize<SMS['events'][E]['toEvents'], []>
    }
  }
}
```

**Example**

```ts
import { createStateMachine } from '@ts-stadium/core'

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

# Util

## EventData (type alias)

...

**Signature**

```ts
export type EventData<SM extends StateMachine> = Union<
  {
    [E in Event<SM>]: SM['events'][E]['data']
  }
>
```

Added in v1.0.0

## InitState (type alias)

...

**Signature**

```ts
export type InitState<SM extends StateMachine> = Union<
  {
    [S in keyof SM['states']]: true extends SM['states'][S]['init'] ? S : never
  }
>
```

Added in v1.0.0

## Name (type alias)

...

**Signature**

```ts
export type Name = string | symbol | number
```

Added in v1.0.0

## State (type alias)

...

**Signature**

```ts
export type State<SM extends StateMachine> = keyof SM['states']
```

Added in v1.0.0

## StateData (type alias)

...

**Signature**

```ts
export type StateData<SM extends StateMachine> = Union<
  {
    [S in State<SM>]: SM['states'][S]['data']
  }
>
```

Added in v1.0.0

## eventIncomingState

...

**Signature**

```ts
export declare const eventIncomingState: <
  SM extends StateMachine<StateMachineSpec<string | number | symbol, string | number | symbol>>
>(
  stateMachine: SM,
  event: keyof SM['events']
) => (keyof SM['states'])[]
```

Added in v1.0.0

## init

...

**Signature**

```ts
export declare const init: <
  SM extends StateMachine<StateMachineSpec<string | number | symbol, string | number | symbol>>
>(
  stateMachine: SM,
  initState: SM['states'][any]['data']
) => any
```

Added in v1.0.0

## tag

...

**Signature**

```ts
export declare const tag: any
```

Added in v1.0.0

## typeOf

...

**Signature**

```ts
export declare const typeOf: <T>() => T
```

Added in v1.0.0
