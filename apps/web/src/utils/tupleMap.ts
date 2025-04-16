export function tupleMap<TItem, TCallbackFn>(
  array: readonly [TItem, ...TItem[]],
  callbackFn: (item: TItem, index: number) => TCallbackFn,
): [TCallbackFn, ...TCallbackFn[]] {
  if (array.length === 0) throw new Error('Array must not be empty');
  return array.map(callbackFn) as [TCallbackFn, ...TCallbackFn[]];
}
