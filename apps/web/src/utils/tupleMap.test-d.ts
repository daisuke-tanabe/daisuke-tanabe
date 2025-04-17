import { tupleMap } from './tupleMap';

// ✅ 正常系：少なくとも1つ以上の要素を持つタプル
const test1 = tupleMap([1, 2, 3], (item) => item * 2);
void test1;

// ✅ 正常系：異なる型を持つタプル
const test2 = tupleMap([1, 'b', true], (item) => String(item));
void test2;

// ❌ 異常系
// @ts-expect-error: 空配列は型エラーになるべき
const test3 = tupleMap([], (item) => item);
void test3;
