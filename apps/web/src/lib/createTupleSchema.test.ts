import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { createTupleSchema } from './createTupleSchema';

describe('createTupleSchema 関数', () => {
  describe('✅️ 正常系', () => {
    it('複数の Zod スキーマを組み合わせてタプルが生成される', () => {
      const schema = createTupleSchema([z.string(), z.number(), z.string()]);
      const result = schema.safeParse(['Hello', 123, 'World']);
      expect(result.success).toBe(true);
    });

    it('型が一致するタプルが返される', () => {
      const schema = createTupleSchema([z.string(), z.number()]);
      const result = schema.safeParse(['Test', 42]);
      expect(result.success).toBe(true);
    });
  });

  describe('❌️ 異常系', () => {
    it('タプルの型が一致しないとエラーが発生する', () => {
      const schema = createTupleSchema([z.string(), z.number()]);
      const result = schema.safeParse(['Test', 'Not a number']);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Expected number, received string');
      }
    });

    it('配列の長さが合わない場合、エラーが発生する', () => {
      const schema = createTupleSchema([z.string(), z.number()]);
      const result = schema.safeParse(['Test']);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Array must contain at least 2 element(s)');
      }
    });

    it('空の配列ではエラーが発生する', () => {
      const schema = createTupleSchema([z.string()]);
      const result = schema.safeParse([]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Array must contain at least 1 element(s)');
      }
    });
  });
});
