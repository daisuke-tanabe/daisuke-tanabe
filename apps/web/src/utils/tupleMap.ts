/**
 * タプル型の配列に対してコールバック関数を適用し、新しいタプルを生成する関数です。
 *
 * この関数は、入力されたタプル型の配列の各要素に対してコールバック関数を適用し、
 * その結果を基に新しいタプルを生成します。
 * 入力配列の型と長さは維持されます。
 *
 * @template TArray - 入力となるタプル型の配列の型を指定します。
 * @template TCallbackFn - コールバック関数の戻り値の型を指定します。
 * @param {TArray} array - コールバック関数を適用するタプル型の配列です。
 * @param {(item: TArray[number], index: number) => TCallbackFn} callbackFn - 各要素とそのインデックスを引数に取り、変換後の値を返すコールバック関数です。
 * @returns {{ [K in keyof TArray]: TCallbackFn }} - コールバック関数の結果を持つ新しいタプルを返します。
 *
 * @example
 * const data = [1, 2, 3] as const;
 * const result = tupleMap(data, (item) => item * 2);
 * console.log(result); // [2, 4, 6]
 *
 * @example
 * const data = ['a', 'b', 'c'] as const;
 * const result = tupleMap(data, (item, index) => `${item}${index}`);
 * console.log(result); // ['a0', 'b1', 'c2']
 */
export function tupleMap<TArray extends readonly [unknown, ...unknown[]], TCallbackFn>(
  array: TArray,
  callbackFn: (item: TArray[number], index: number) => TCallbackFn,
): { [K in keyof TArray]: TCallbackFn } {
  return array.map(callbackFn) as { [K in keyof TArray]: TCallbackFn };
}

