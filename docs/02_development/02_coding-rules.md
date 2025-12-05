# コーディングルール

このドキュメントはプロジェクトで守るべきコーディングルールです。

## 変数

- **必ず** `const` を**最優先で使うこと**。条件付き代入やループでの再代入が必要な場合は `let` を使用してもよい。

## 反復処理

- 配列の反復には**必ず** `Array.prototype.map`、`filter`、`reduce`、`some`、`every`、`find`、`flatMap` などの**配列メソッド（イテレータ関数）を最優先で使うこと**。
- `for`、`for...of`、`forEach` の使用および配列メソッド（イテレータ関数）の多重ネストは**原則禁止**とする。ただしパフォーマンスや副作用が明確に必要な場合のみ、**例外的に専用関数に分離して使うこと**。
  - パフォーマンスが重要な大量データ処理（例：数千件以上のデータ変換、seed処理など）を行う場合。
  - 高階関数では中間配列の大量生成によりメモリ効率が著しく悪化する場合。
- 例外的にループを使用する場合も `for...of` を優先し、伝統的な `for` ループはベンチマークで有意な差がある場合のみ使用する。

## オブジェクト操作

- 条件チェック内でのオブジェクト変更（副作用）は**禁止**する。条件チェックと代入は明確に分離すること。
  - 例：

    ```typescript
    // 推奨
    const filters: Record<string, unknown> = {};
    if (name) {
      filters.name = { contains: name };
    }

    // 非推奨
    if (name && (filters.name = { contains: name })) {
      /* 処理 */
    }
    ```

## React

### `useMemo`

#### 原則

- **`useMemo` はパフォーマンス最適化目的でのみ使用する**
- 計算コストが高い処理をキャッシュする場合に限定
- **使用前にパフォーマンス計測を行い、効果の妥当性を確認すること**

#### 使用してよいケース

```tsx
// OK: 高コストな計算結果をキャッシュ
const sortedItems = useMemo(() => {
  return items.sort((a, b) => expensiveCompare(a, b));
}, [items]);

// OK: 大量データのフィルタリング・変換
const filteredData = useMemo(() => {
  return largeDataset.filter((item) => item.category === category);
}, [largeDataset, category]);
```

#### 使用しないケース

```tsx
// NG: 計算コストが軽い処理
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);

// NG: 単純なオブジェクト生成
const style = useMemo(() => ({ color: 'red' }), []);
```

#### 却下されるケース

- **「useMemo を使わないと不具合になる」という理由での使用は却下**
- そのような状況はコンポーネント設計やデータフローに問題がある
- useMemo で回避するのではなく、根本原因を修正すること

#### `useCallback` との使い分け

- 関数をキャッシュする場合は `useCallback` を使用し、`useMemo` で関数を定義しないこと

### コールバック関数の設計

#### 原則

- **内部実装の詳細を子コンポーネントに渡さない**
- 子コンポーネントには「何が起きたか」を通知する具体的なコールバックを渡す

#### 禁止するプロパティ名

- `setValue`、`dispatch`、`setItems` などの抽象的なプロパティ名は**禁止**
- これらは親の内部実装（useState、useReducer、フォームライブラリ等）を子に漏らしている

#### 問題のあるパターン

```tsx
// NG: 内部のセッターや操作関数を直接渡す
<ChildComponent setValue={setValue} />
<ChildComponent dispatch={dispatch} />
<ChildComponent setItems={setItems} />
```

問題点：

- 子コンポーネントが「何でもできる」状態になる
- 意図しない操作のリスク
- 親の内部実装に依存してしまう

#### 推奨パターン

```tsx
// OK: 具体的な操作をコールバックで渡す
<ChildComponent
  onSelect={(item) => {
    setValue('selectedItem', item);
  }}
/>

<ChildComponent
  onAdd={(newItem) => {
    setItems((prev) => [...prev, newItem]);
  }}
  onRemove={(id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }}
/>
```

メリット：

- 子コンポーネントは「イベントが起きたら通知する」責務のみ
- 親の状態管理方法（useState、useReducer、フォームライブラリ等）を意識しない
- 単一責任・関心の分離が保たれる
- テストしやすい
