import { z } from 'zod';

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
