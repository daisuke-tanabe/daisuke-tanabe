/**
 * BasePropsとOverridePropsを受け取り、OverridePropsでBasePropsを上書きする
 * 再帰的には実行がされないので注意すること
 */
export type ExtendableProps<TBaseProps = object, TOverrideProps = object> = TOverrideProps &
  Omit<TBaseProps, keyof TOverrideProps>;
