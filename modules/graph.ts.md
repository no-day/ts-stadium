---
title: graph.ts
nav_order: 2
parent: Modules
---

## graph overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [createGraph](#creategraph)
- [Model](#model)
  - [StateMachineGraph (type alias)](#statemachinegraph-type-alias)
- [Util](#util)
  - [graphToDot](#graphtodot)

---

# Constructors

## createGraph

Creates a graph representation of a state machine. Suitable for any renderer.

**Signature**

```ts
export declare const createGraph: (stateMachine: StateMachine<any>) => StateMachineGraph
```

**Example**

```ts
import { createStateMachine } from 'fp-ts-library-template'
import { createGraph } from 'fp-ts-library-template/graph'

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

assert.deepStrictEqual(createGraph(stateMachine), {
  edges: [
    { from: 'Off', to: 'Toggle' },
    { from: 'On', to: 'Toggle' },
    { from: 'Toggle', to: 'On' },
    { from: 'Toggle', to: 'Off' },
  ],
  nodes: [
    { id: 'Off', tag: 'State' },
    { id: 'On', tag: 'State' },
    { id: 'Toggle', tag: 'Event' },
  ],
})
```

Added in v1.0.0

# Model

## StateMachineGraph (type alias)

Graph representation of a state machine

**Signature**

```ts
export type StateMachineGraph = {
  nodes: Array<{
    tag: 'Event' | 'State'
    id: string
  }>
  edges: Array<{
    from: string
    to: string
  }>
}
```

Added in v1.0.0

# Util

## graphToDot

It's a greeting

**Signature**

```ts
export declare const graphToDot: (graph: StateMachineGraph) => string
```

Added in v1.0.0
