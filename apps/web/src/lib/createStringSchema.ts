import { z } from 'zod';

/**
 * 文字列のZodスキーマを生成する関数です。
 *
 * この関数は、指定されたオプションに基づいて文字列の検証ルールを定義するZodスキーマを作成します。
 * 必須項目の指定、文字列の最大長および最小長を設定することができます。
 *
 * @param {Object} options - スキーマのオプションを指定するオブジェクトです。
 * @param {boolean} [options.isRequired] - 文字列が必須項目であるかどうかを指定します。デフォルトは任意項目です。
 * @param {number} [options.max] - 文字列の最大長を指定します。この値を超える文字列は無効となります。
 * @param {number} [options.min] - 文字列の最小長を指定します。この値より短い文字列は無効となります。
 * @returns {z.ZodString} - 指定された条件に基づいて生成されたZod文字列スキーマを返します。
 *
 * @example
 * const schema = createStringSchema({ isRequired: true, max: 10, min: 5 });
 * schema.parse('hello'); // 成功
 * schema.parse(''); // エラー: 必須の入力項目です
 * schema.parse('toolongstring'); // エラー: 最大文字数は10文字です
 */
export function createStringSchema({
  isRequired,
  max,
  min,
}: {
  isRequired?: boolean;
  max?: number;
  min?: number;
}): z.ZodString {
  let schema = z.string();

  if (isRequired) {
    schema = schema.nonempty('必須の入力項目です');
  }

  if (max !== undefined) {
    schema = schema.max(max, `最大文字数は${max}文字です`);
  }

  if (min !== undefined) {
    schema = schema.min(min, `最小文字数は${min}文字です`);
  }

  return schema;
}

