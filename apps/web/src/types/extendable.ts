/**
 * 2つの型を組み合わせ、`TOverride` のプロパティで `TBase` のプロパティを上書きした新しい型を生成するユーティリティ型です。
 *
 * この型は、`TBase` 型のプロパティを基にしつつ、`TOverride` 型のプロパティで上書きされた新しい型を作成します。
 * 型の拡張や上書きが必要な場合に便利です。
 *
 * @template TBase - 元となる型を指定します。
 * @template TOverride - 上書きする型を指定します。
 * @returns {TOverride & Omit<TBase, keyof TOverride>} - `TBase` のプロパティを `TOverride` で上書きした新しい型を返します。
 *
 * @example
 * type Base = { a: number; b: string; };
 * type Override = { b: number; c: boolean; };
 * type Result = Extendable<Base, Override>;
 * // Result は { a: number; b: number; c: boolean; } となる
 */
export type Extendable<TBase = object, TOverride = object> = TOverride & Omit<TBase, keyof TOverride>;
