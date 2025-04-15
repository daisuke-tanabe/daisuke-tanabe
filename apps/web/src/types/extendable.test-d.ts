import type { ExtendableProps } from './extendable';

type Base = {
  foo: string;
  bar: number;
};

type Override = {
  bar: string;
  baz: boolean;
};

type Result = ExtendableProps<Base, Override>;

// ✅ 正常系（暗黙的なコンパイルで成功）
const test1: Result = {
  foo: 'hello',
  bar: 'world',
  baz: true,
};
void test1;

// ❌ 異常系：`bar` に number を使っているのでコンパイルエラーにしたい
const test2: Result = {
  foo: 'hello',
  // @ts-expect-error: bar は number ではなく string でなければならない
  bar: 123,
  baz: true,
};
void test2;
