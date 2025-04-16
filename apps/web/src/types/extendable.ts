/**
 * Base と Override を受け取り、Override で Base を上書きする
 * 再帰的には実行がされないので注意すること
 */
export type Extendable<TBase = object, TOverride = object> = TOverride & Omit<TBase, keyof TOverride>;
