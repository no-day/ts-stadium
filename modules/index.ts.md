---
title: index.ts
nav_order: 3
parent: Modules
---

## index overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [StateMachine (type alias)](#statemachine-type-alias)
  - [StateMachineData (type alias)](#statemachinedata-type-alias)
  - [StateMachineSpec (type alias)](#statemachinespec-type-alias)
  - [createStateMachine](#createstatemachine)

---

# Constructors

## StateMachine (type alias)

A type that describes data relations of a state machine.

**Signature**

```ts
export type StateMachine<data extends StateMachineData> = {
  states: {
    [key in keyof data['states']]: {
      data: data['states'][key]
      events: (keyof data['events'])[]
    }
  }
  events: {
    [key in keyof data['events']]: {
      data: data['events'][key]
      toStates?: (keyof data['states'])[]
      toEvents?: (keyof data['events'])[]
    }
  }
}
```

Added in v1.0.0

## StateMachineData (type alias)

Describes the data of a state machine. That means, the types for each state plus the payloads for each event.

**Signature**

```ts
export type StateMachineData = {
  states: Record<string, unknown>
  events: Record<string, unknown>
}
```

Added in v1.0.0

## StateMachineSpec (type alias)

Describes state and transition relations of a state machine.

**Signature**

```ts
export type StateMachineSpec<data extends StateMachineData> = {
  states: Record<
    keyof data['states'],
    {
      events: (keyof data['events'])[]
    }
  >
  events: Record<
    keyof data['events'],
    {
      toStates?: (keyof data['states'])[]
      toEvents?: (keyof data['events'])[]
    }
  >
}
```

Added in v1.0.0

## createStateMachine

Creates a state machine, given a data type and a description of valid transitions.

**Signature**

```ts
export declare const createStateMachine: <data extends StateMachineData>() => <spec extends StateMachineSpec<data>>(
  spec: spec
) => StateMachine<data>
```

**Example**

```ts
import { createStateMachine } from 'fp-ts-library-template'

type StateMachine = {
  states: { On: true; Off: false }
  events: { Toggle: null }
}

const stateMachine = createStateMachine<StateMachine>()({
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
