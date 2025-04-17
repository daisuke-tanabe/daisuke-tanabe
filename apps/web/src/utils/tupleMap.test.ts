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

    it('異なる型を持つタプルに対応できる', () => {
      const data: [number, ...string[]] = [1, 'b', 'c'];
      const result = tupleMap(data, (item, index) => `${item}${index}`);

      expect(result).toEqual(['10', 'b1', 'c2']);
    });
  });
});
