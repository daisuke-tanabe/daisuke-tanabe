import { z } from 'zod';

import { createStringSchema, createTupleSchema } from './schemas';

describe('createStringSchema 関数', () => {
  describe('isRequired が真なら', () => {
    const schema = createStringSchema({ isRequired: true });

    describe('✅️ 正常系', () => {
      it('空ではない文字列を許容する', () => {
        const result = schema.safeParse('Hello');
        expect(result.success).toBe(true);
      });
    });

    describe('❌️ 異常系', () => {
      it('空文字はエラーになる', () => {
        const result = schema.safeParse('');
        expect(result.success).toBe(false);
        if (!result.success) expect(result.error.issues[0].message).toBe('必須の入力項目です');
      });
      it('文字列以外はエラーになる', () => {
        const invalidValues = [123, null, undefined, {}, [], true];
        invalidValues.forEach((val) => {
          const result = schema.safeParse(val);
          expect(result.success).toBe(false);
        });
      });
    });
  });

  describe('isRequired が偽なら', () => {
    const schema = createStringSchema({ isRequired: false });

    describe('✅️ 正常系', () => {
      it('空文字を許容する', () => {
        const result = schema.safeParse('');
        expect(result.success).toBe(true);
      });
      it('空ではない文字列を許容する', () => {
        const result = schema.safeParse('Hello');
        expect(result.success).toBe(true);
      });
    });

    describe('❌️ 異常系', () => {
      it('文字列以外はエラーになる', () => {
        const invalidValues = [123, null, undefined, {}, [], true];
        invalidValues.forEach((val) => {
          const result = schema.safeParse(val);
          expect(result.success).toBe(false);
        });
      });
    });
  });

  describe('最大文字数と最小文字数の制約がある場合', () => {
    describe('最大文字数', () => {
      const schema = createStringSchema({ max: 5 });

      describe('✅️ 正常系', () => {
        it('最大5文字以内の文字列を許容する', () => {
          const result = schema.safeParse('Hello');
          expect(result.success).toBe(true);
        });
      });

      describe('❌️ 異常系', () => {
        it('6文字以上はエラーになる', () => {
          const result = schema.safeParse('Hello!');
          expect(result.success).toBe(false);
          if (!result.success) expect(result.error.issues[0].message).toBe('最大文字数は5文字です');
        });
      });
    });

    describe('最小文字数', () => {
      const schema = createStringSchema({ min: 3 });

      describe('✅️ 正常系', () => {
        it('最小3文字以上の文字列を許容する', () => {
          const result = schema.safeParse('abc');
          expect(result.success).toBe(true);
        });
      });

      describe('❌️ 異常系', () => {
        it('2文字以下はエラーになる', () => {
          const result = schema.safeParse('ab');
          expect(result.success).toBe(false);
          if (!result.success) expect(result.error.issues[0].message).toBe('最小文字数は3文字です');
        });
      });
    });

    describe('最小文字数と最大文字数の両方がある場合', () => {
      const schema = createStringSchema({ min: 3, max: 5 });

      describe('✅️ 正常系', () => {
        it('3〜5文字の文字列を許容する', () => {
          const result = schema.safeParse('abc');
          expect(result.success).toBe(true);
        });
        it('5文字の文字列も許容する', () => {
          const result = schema.safeParse('abcde');
          expect(result.success).toBe(true);
        });
      });

      describe('❌️ 異常系', () => {
        it('2文字以下はエラーになる', () => {
          const result = schema.safeParse('ab');
          expect(result.success).toBe(false);
          if (!result.success) expect(result.error.issues[0].message).toBe('最小文字数は3文字です');
        });
        it('6文字以上はエラーになる', () => {
          const result = schema.safeParse('abcdef');
          expect(result.success).toBe(false);
          if (!result.success) expect(result.error.issues[0].message).toBe('最大文字数は5文字です');
        });
      });
    });
  });
});

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
