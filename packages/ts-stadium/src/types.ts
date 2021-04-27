export type Tagged<T, D> = { tag: T; data: D };

export type Union<T> = T[keyof T];

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
