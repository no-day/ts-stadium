/** @since 1.0.0 */

// ----------------------------------------------------------------------------
// Util
// ----------------------------------------------------------------------------

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export type Tagged<T, D> = { tag: T; data: D };

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export type Union<T> = T[keyof T];

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export type NoData = void;

/**
 * ...
 *
 * @since 1.0.0
 * @category Util
 */
export const tag: {
  <Tag extends string, Data>(tag: Tag, data: Data): Tagged<Tag, Data>;
  <Tag extends string>(tag: Tag): Tagged<Tag, NoData>;
} = (tag: any, data: any = null) => ({
  tag,
  data,
});
