/**
 * ...
 *
 * @since 1.0.0
 */

/**
 * ...
 *
 * @since 1.0.0
 */
export type Tagged<T, D> = { tag: T; data: D }

/**
 * ...
 *
 * @since 1.0.0
 */
export type Union<T> = T[keyof T]

/**
 * ...
 *
 * @since 1.0.0
 */
export type NoData = void

/**
 * ...
 *
 * @since 1.0.0
 */
export const tag: {
  <Tag extends string, Data>(tag: Tag, data: Data): Tagged<Tag, Data>
  <Tag extends string>(tag: Tag): Tagged<Tag, NoData>
} = (tag: any, data: any = null) => ({
  tag,
  data,
})

/**
 * ...
 *
 * @since 1.0.0
 */
export type Extract<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

/**
 * ...
 *
 * @since 1.0.0
 */
export type Normalize<T, A> = IsAny<T> extends false
  ? NormalizeUnknown<NormalizeUndefined<T, A>, A>
  : T

/**
 * ...
 *
 * @since 1.0.0
 */
type NormalizeUndefined<T, A> = T extends undefined
  ? undefined extends T
    ? A
    : T
  : T

/**
 * ...
 *
 * @since 1.0.0
 */
type NormalizeUnknown<T, A> = T extends unknown
  ? unknown extends T
    ? A
    : T
  : T

/**
 * ...
 *
 * @since 1.0.0
 */
export type RecordVal<R> = R extends Record<infer K, infer V> ? V : never

/**
 * ...
 *
 * @since 1.0.0
 */
export type IsAny<T> = 0 extends 1 & T ? true : false

/**
 * ...
 *
 * @since 1.0.0
 */
export type TupleToUnion<T extends any[]> = T[number]

/**
 * ...
 *
 * @since 1.0.0
 */
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

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export const typeOf = <T>() => ({} as T)
