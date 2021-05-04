---
{
  "title": "type-utils",
  "nav_order": 1,
  "parent": "packages",
  "permalink": "/packages/type-utils"
}
---

## index overview

...

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Util](#util)
  - [typeOf](#typeof)
- [utils](#utils)
  - [Extract (type alias)](#extract-type-alias)
  - [IsAny (type alias)](#isany-type-alias)
  - [NoData (type alias)](#nodata-type-alias)
  - [Normalize (type alias)](#normalize-type-alias)
  - [RecordVal (type alias)](#recordval-type-alias)
  - [Tagged (type alias)](#tagged-type-alias)
  - [Tuple (type alias)](#tuple-type-alias)
  - [TupleToUnion (type alias)](#tupletounion-type-alias)
  - [Union (type alias)](#union-type-alias)
  - [tag](#tag)

---

# Util

## typeOf

...

**Signature**

```ts
export declare const typeOf: <T>() => T
```

Added in v1.0.0

# utils

## Extract (type alias)

...

**Signature**

```ts
export type Extract<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
```

Added in v1.0.0

## IsAny (type alias)

...

**Signature**

```ts
export type IsAny<T> = 0 extends 1 & T ? true : false
```

Added in v1.0.0

## NoData (type alias)

...

**Signature**

```ts
export type NoData = void
```

Added in v1.0.0

## Normalize (type alias)

...

**Signature**

```ts
export type Normalize<T, A> = IsAny<T> extends false
  ? NormalizeUnknown<NormalizeUndefined<T, A>, A>
  : T
```

Added in v1.0.0

## RecordVal (type alias)

...

**Signature**

```ts
export type RecordVal<R> = R extends Record<infer K, infer V> ? V : never
```

Added in v1.0.0

## Tagged (type alias)

...

**Signature**

```ts
export type Tagged<T, D> = { tag: T; data: D }
```

Added in v1.0.0

## Tuple (type alias)

...

**Signature**

```ts
export type Tuple<T> =
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
  | [T, T, T, T, T, T, T, T, T, T]
```

Added in v1.0.0

## TupleToUnion (type alias)

...

**Signature**

```ts
export type TupleToUnion<T extends any[]> = T[number]
```

Added in v1.0.0

## Union (type alias)

...

**Signature**

```ts
export type Union<T> = T[keyof T]
```

Added in v1.0.0

## tag

...

**Signature**

```ts
export declare const tag: {
  <Tag extends string, Data>(tag: Tag, data: Data): Tagged<Tag, Data>
  <Tag extends string>(tag: Tag): Tagged<Tag, void>
}
```

Added in v1.0.0
