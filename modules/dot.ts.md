---
title: dot.ts
nav_order: 1
parent: Modules
---

## dot overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructor](#constructor)
  - [renderDot](#renderdot)
- [Model](#model)
  - [Dot (type alias)](#dot-type-alias)

---

# Constructor

## renderDot

Renders a state machine graph to a dot file

**Signature**

```ts
export declare const renderDot: (graph: StateMachineGraph) => Dot
```

Added in v1.0.0

# Model

## Dot (type alias)

Branded type for dot files

**Signature**

```ts
export type Dot = string & { readonly Dot: unique symbol }
```

Added in v1.0.0
