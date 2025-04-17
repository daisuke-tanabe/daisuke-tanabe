import { z, ZodTypeAny } from 'zod';

/**
 * Zodスキーマの配列からタプルスキーマを生成する関数です。
 *
 * この関数は、指定されたZodスキーマの配列を基にタプル型のスキーマを作成します。
 * 各要素の型を厳密に検証するため、配列の順序や型が一致しない場合はエラーとなります。
 *
 * @param {[ZodTypeAny, ...ZodTypeAny[]]} schemas - タプルスキーマを構成するZodスキーマの配列です。
 * 配列の各要素はZodスキーマである必要があります。
 * @returns {z.ZodTuple} - 指定されたスキーマを基に生成されたZodタプルスキーマを返します。
 *
 * @example
 * import { z } from 'zod';
 *
 * const schema1 = z.string();
 * const schema2 = z.number();
 * const tupleSchema = createTupleSchema([schema1, schema2]);
 *
 * tupleSchema.parse(['hello', 42]); // 成功
 * tupleSchema.parse(['hello', 'world']); // エラー: 2番目の要素が数値ではない
 */
export function createTupleSchema(schemas: [ZodTypeAny, ...ZodTypeAny[]]) {
  return z.tuple(schemas);
}

