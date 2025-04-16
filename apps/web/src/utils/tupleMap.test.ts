import { tupleMap } from './tupleMap';

describe('tupleMap 関数', () => {
  describe('✅️ 正常系', () => {
    it('配列の各要素に対してコールバック関数が適用される', () => {
      const data: [number, ...number[]] = [1, 2, 3];
      const result = tupleMap(data, (item) => item * 2);

      expect(result).toEqual([2, 4, 6]);
    });

    it('コールバック関数がインデックスを受け取る', () => {
      const data: [string, ...string[]] = ['a', 'b', 'c'];
      const result = tupleMap(data, (item, index) => `${item}${index}`);

      expect(result).toEqual(['a0', 'b1', 'c2']);
    });
  });

  describe('❌️ 異常系', () => {
    it('空配列が渡されるとエラーが投げられる', () => {
      const data: unknown[] = [];
      // tupleMap 関数の第一引数の型エラーを無視する
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(() => tupleMap(data, (item) => item)).toThrowError('Array must not be empty');
    });
  });
});
