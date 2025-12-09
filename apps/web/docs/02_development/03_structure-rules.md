# 構成ルール

このドキュメントはプロジェクトのディレクトリ構成およびファイル命名に関するルールを定義する。

## 設計思想

このガイドラインは「責務境界で UI を育てる」ことを目的としている。

いきなり共通化せず、再利用されたタイミングで昇格し、責務が明確な状態で共有する。
これにより、早すぎる抽象化（Premature Abstraction）や肥大化したコンポーネント（Fat Component）を防ぎ、変更に強い UI を育てる運用が可能になる。

### UI の責務境界（3 レイヤー）

| レイヤー   | 役割                                   | 例                          |
| ---------- | -------------------------------------- | --------------------------- |
| primitives | UI 表現（見た目・入力・表示の単位）    | Button, Checkbox, Input     |
| patterns   | UI 体験（UI 同士の連携・操作）         | SearchForm, DataTable       |
| features   | アプリ機能（データ取得・ビジネス判断） | UserProfile, PostList       |

**primitives → patterns → features** の順で再利用性が高く、より多くの場所から依存される。
primitives は基盤となるため「軽く・薄く」保ち、features に近づくほどビジネス固有のロジックを許容する。

### 設計ルールの効果

| ルール                                             | 防ぐもの                                 |
| -------------------------------------------------- | ---------------------------------------- |
| 昇格性（ページ専用 → 共通へ段階的に移動）          | 早すぎる抽象化（Premature Abstraction）  |
| 相対パス / バレルエクスポート制限                  | 循環参照                                 |
| patterns の責務制限（ビジネスロジック禁止）        | 肥大化したコンポーネント（Fat Component）|

## 'use client' 早見表

| 層             | 'use client'     |
| -------------- | ---------------- |
| primitives     | 必須             |
| patterns       | 必須             |
| src/features   | 状況に応じて分離 |
| src/hooks      | 必須             |
| \_components   | 必須             |
| \_features     | 状況に応じて分離 |
| \_hooks        | 必須             |
| \_providers    | 必須             |

## 命名規則

src 配下および app 配下に適用する。

### コンポーネント（src/components, app/）

- ディレクトリ: PascalCase（例: `Header/`, `FormGroup/`）
- ファイル: PascalCase（例: `Header.tsx`, `FormGroup.tsx`）

### 非コンポーネント（src/lib, src/utils, src/types, app/**/_lib 等）

- ファイル: camelCase（例: `cn.ts`, `tupleMap.ts`, `common.ts`）

## src/components

アプリ全体で再利用するコンポーネントを配置する。

**原則**: 最初から `src/components` に配置しない。まず `app/**/_components` でスコープ内の再利用を検証し、複数スコープで必要になった時点で昇格させる。

### primitives

- 再利用性の高い原始的なコンポーネントを配置する
- shadcn/ui のコンポーネントはここに格納する
- ファイルは直下にフラット配置し、`index.ts` で一括 export する
- すべてのファイルに `'use client'` を付与する

**理由**: UI の最小単位は server 最適化のメリットがほぼない。

#### 許容する責務

- UI ロジック（見た目や操作に関する処理）
- UI の内部状態管理（`useState`）
- フォーカス、ホバー、アニメーション等の UI 制御

#### 許容しない責務

- ビジネスロジック
- API 通信
- グローバルステートの操作
- サーバーコンポーネント（RSC）としての実装

### patterns

- 複数の primitives を組み合わせたコンポーネントを配置する
- UI の構造や体験を組み立てる役割を担う
- ファイルは直下にフラット配置し、`index.ts` で一括 export する
- すべてのファイルに `'use client'` を付与する

**理由**: UI 連携レイヤはインタラクションを前提とする。データ取得は上位の feature や page で行い、patterns は UI に専念する。

#### 許容する責務

- primitives 間の UI 連携ロジック
- ローカルな状態管理（モーダル開閉等）
- カスタムフックによる UI 制御

#### 許容しない責務

- ビジネスロジック（ドメインルール、API 呼び出し、権限制御等）
- グローバルステートの変更
- データ処理・マッピングロジック
- サーバーコンポーネント（RSC）としての実装

## src ディレクトリ構成例

```
src/
├── components/
│   ├── primitives/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   └── patterns/
│       ├── SearchForm.tsx
│       ├── DataTable.tsx
│       └── index.ts
├── features/
│   ├── UserProfile/
│   │   ├── UserProfile.tsx
│   │   ├── UserProfile.client.tsx
│   │   └── index.ts
│   └── PostList/
│       ├── PostList.tsx
│       ├── PostList.client.tsx
│       └── index.ts
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── index.ts
├── lib/
│   ├── cn.ts                    # tailwind-merge ラッパー
│   └── createStringSchema.ts    # Zod スキーマファクトリ
├── types/
│   ├── common.ts                # 共通型定義
│   ├── api.ts                   # API関連の型
│   └── index.ts
└── utils/
    ├── tupleMap.ts              # 汎用ユーティリティ
    ├── formatDate.ts            # 日付フォーマット
    └── index.ts
```

## src/features

アプリ内で再利用する機能コンポーネントを配置する。

- ページごとにはディレクトリを切らない（再利用性が重要）
- 複数のページやコンテキストで使用される機能を配置
- ディレクトリ構成で管理する
- サーバーコンポーネントとクライアントコンポーネントを分離する場合は `*.client.tsx` を使用
- `src/features/` 直下に全 feature をまとめる `index.ts`（バレルエクスポート）は**禁止**
- 各 feature ディレクトリ内のエントリーポイント（`index.ts`）は許可

**原則**: 最初から `src/features` に配置しない。まず `app/**/_features` でスコープ内の再利用を検証し、複数スコープで必要になった時点で昇格させる。

### 許容する責務

- データ取得（fetch, Prisma 等）
- ビジネスロジック
- サーバー/クライアントの境界管理

### 許容しない責務

- 原始的な UI 部品（→ primitives へ）
- UI 連携パターン（→ patterns へ）

## src/hooks

アプリ内で再利用するカスタムフックを配置する。

- ファイルは直下にフラット配置し、`index.ts` で一括 export する
- ファイル名は `use` プレフィックス（例: `useDebounce.ts`）

### 許容する責務

- 汎用的な状態管理ロジック
- 副作用のカプセル化
- イベントハンドリング

### 許容しない責務

- 特定のコンポーネントに依存するロジック（→ コンポーネント内で定義）
- React hooks を使わない外部ライブラリのラッパー（→ lib へ）

### hooks と lib の使い分け

| 条件 | 配置先 |
| ---- | ------ |
| React hooks を使用する（useState, useEffect 等） | hooks |
| React hooks を使用しない純粋な関数 | lib |

例: TanStack Query のカスタムフック（`useQuery` をラップ）→ hooks
例: Zod スキーマファクトリ → lib

## src/lib

外部ライブラリのラッパー・ファクトリ・拡張関数を配置する。

- React に依存しない純粋な関数またはクラス
- 外部ライブラリ（Zod, clsx, tailwind-merge 等）に依存する
- ファイルは直下にフラット配置する
- `index.ts` によるバレルエクスポートは禁止（server-only 問題回避）

**理由**: server-only を使用するファイルが混在する可能性があり、バレルファイルでまとめるとクライアントからのインポート時にエラーとなる。

### 許容する責務

- 外部ライブラリのラップ・拡張
- ファクトリ関数
- 設定・スキーマ生成

### 許容しない責務

- React コンポーネント
- React フック
- UI ロジック

## src/utils

純粋なユーティリティ関数を配置する。

- React に依存しない純粋な関数またはクラス
- 外部ライブラリに依存しない（Node.js 標準 API は可）
- ファイルは直下にフラット配置し、`index.ts` で一括 export する

### 許容する責務

- 汎用的なデータ変換・操作
- 文字列・配列・オブジェクト操作
- 日付フォーマット等の純粋関数

### 許容しない責務

- React コンポーネント
- React フック
- 外部ライブラリに依存する処理（→ lib へ）

## src/types

アプリ全体で共有する型定義を配置する。

- ファイルは直下にフラット配置し、`index.ts` で一括 export する

### 許容する責務

- アプリ横断で使用する型定義
- 共通インターフェース・型エイリアス

### 許容しない責務

- 特定のコンポーネント専用の型（→ コンポーネントファイル内で定義）
- 特定の feature 専用の型（→ feature 内で定義）

## app ディレクトリ

### Next.js 規約

以下の Next.js 規約に基づく命名はルール違反としない：

- Parallel Routes: `@folder`（例: `@modal`）
- Intercepting Routes: `(.)folder`, `(..)folder`, `(...)folder`
- Route Groups: `(folder)`
- Dynamic Routes: `[param]`, `[...param]`, `[[...param]]`

これらは Next.js のルーティング機能を活用するための標準的な命名規則である。

### \_components

- 当該スコープ内で再利用性の高いコンポーネントを配置する
- `_components/` は兄弟の `page.tsx`・`layout.tsx` 等のスコープに限定する
- すべてのファイルに `'use client'` を付与し、`index.ts` に集約する
- primitives と patterns 両方の性質を含む（原始的な UI 部品も、UI 連携パターンも配置可能）

**理由**: primitives/patterns と同様、スコープ内の再利用 UI は client 統一で運用を安定させる。

#### 許容する責務

- UI ロジック（見た目や操作に関する処理）
- UI の内部状態管理（`useState`）
- primitives 間の UI 連携ロジック
- ローカルな状態管理（モーダル開閉等）
- カスタムフックによる UI 制御

#### 許容しない責務

- ビジネスロジック
- API 通信
- グローバルステートの操作
- サーバーコンポーネント（RSC）としての実装

### \_features

- 当該スコープ専用のコンポーネントを配置する
- `_features/` は兄弟の `page.tsx`・`layout.tsx` 等のスコープに限定する
- 再利用を前提としない
- 許容する責務・許容しない責務は `src/features` と同様

**理由**: RSC の境界管理は feature レイヤで行う。primitives/patterns は UI の世界、\_features はデータ取得と UI を繋ぐ世界として責務を分離する。

#### ファイル命名

- サーバーコンポーネント: `*.tsx`
- クライアントコンポーネント: `*.client.tsx`

#### ディレクトリ構成

- feature は必ずディレクトリにまとめる（`_features/` 直下にフラット配置禁止）
- 単一ファイルで完結する場合も、ディレクトリにまとめる
- `_features/` 直下に全 feature をまとめる `index.ts`（バレルエクスポート）は**禁止**
- 各 feature ディレクトリ内のエントリーポイント（`index.ts`）は許可
  - サーバーコンポーネントがある場合: サーバーコンポーネントを export
  - 純粋なクライアント機能の場合: `*.client.tsx` を export

#### サーバー/クライアント分離

- データ取得が必要な場合: `*.tsx`（server）+ `*.client.tsx`（client）に分離
- クライアントコンポーネントは親サーバーコンポーネント内で直接 import する

### \_providers

- 当該スコープで使用するプロバイダーコンポーネントを配置する
- `_providers/` は兄弟の `page.tsx`・`layout.tsx` 等のスコープに限定する
- すべてのファイルに `'use client'` を付与し、`index.ts` に集約する
- ファイルは直下にフラット配置する

**理由**: プロバイダーはコンテキストやテーマなどアプリケーション設定を提供するため、primitives（UI パーツ）とは責務が異なる。

#### 許容する責務

- テーマ・認証・国際化などのコンテキスト提供
- アプリケーション設定の注入

#### 許容しない責務

- UI ロジック
- ビジネスロジック
- データ取得

### \_hooks

- 当該スコープ専用のカスタムフックを配置する
- `_hooks/` は兄弟の `page.tsx`・`layout.tsx` 等のスコープに限定する
- `index.ts` によるバレルエクスポートは許可
- 許容する責務・許容しない責務は `src/hooks` と同様

### \_lib

- 当該スコープ専用の外部ライブラリに依存するユーティリティを配置する
- `_lib/` は兄弟の `page.tsx`・`layout.tsx` 等のスコープに限定する
- `index.ts` によるバレルエクスポートは**禁止**
- 各ファイルを直接インポートする
- 許容する責務・許容しない責務は `src/lib` と同様

### \_types

- 当該スコープ専用の型定義を配置する
- `_types/` は兄弟の `page.tsx`・`layout.tsx` 等のスコープに限定する
- `index.ts` によるバレルエクスポートは許可
- 許容する責務・許容しない責務は `src/types` と同様

### \_utils

- 当該スコープ専用の純粋なユーティリティ関数を配置する
- `_utils/` は兄弟の `page.tsx`・`layout.tsx` 等のスコープに限定する
- `index.ts` によるバレルエクスポートは許可
- 許容する責務・許容しない責務は `src/utils` と同様

### 構成例

```
app/
├── _components/
│   ├── Card.tsx
│   └── index.ts
├── _features/
│   ├── Header/
│   │   ├── Header.tsx           # server
│   │   ├── UserMenu.client.tsx  # client（インタラクション）
│   │   └── index.ts
│   └── Footer/
│       ├── Footer.tsx           # 単一ファイルで完結
│       └── index.ts
├── _hooks/
│   ├── useAppHook.ts
│   └── index.ts
├── _providers/
│   ├── ThemeProvider.tsx        # テーマ設定
│   └── index.ts
├── layout.tsx
├── page.tsx
└── posts/
    ├── _components/             # posts スコープで再利用
    │   ├── PostCard.tsx
    │   └── index.ts
    ├── _features/               # posts スコープ専用
    │   └── PostList/
    │       ├── PostList.tsx     # server（データ取得）
    │       ├── PostList.client.tsx
    │       └── index.ts
    ├── _lib/                    # posts スコープ専用
    │   └── buildQueryParams.ts
    ├── _types/                  # posts スコープ専用
    │   └── index.ts
    ├── _utils/                  # posts スコープ専用
    │   ├── formatPostDate.ts
    │   └── index.ts
    ├── page.tsx
    └── [id]/
        └── _features/
            └── PostDetail/
                ├── PostDetail.tsx
                ├── PostDetail.client.tsx
                └── index.ts
```

## page.tsx の設計パターン

`page.tsx` は以下の責務を持つ：

1. URL パラメーター（`params` / `searchParams`）の取得と正規化
2. 必要であれば ErrorBoundary / Suspense でラップ（原則は `error.tsx`, `loading.tsx` 等の Next.js 規約に任せる）
3. `_features/` へ正規化済みの値を props で渡す

```
page.tsx
  ↓ パラメーター正規化（_lib/ のロジックを使用）
  ↓ 必要に応じて ErrorBoundary / Suspense でラップ
_features/
  ↓ データフェッチ
_components/
  ↓ 表示
```

### パラメーター正規化

`page.tsx` が受け取る生の `params` / `searchParams` を、型安全でビジネスロジックに適した形式に変換する処理。
**パラメーター正規化は `page.tsx` で実行**し、正規化済みの値を `_features/` に props で渡す。

```tsx
// page.tsx
import { Suspense } from 'react';
import { SomeFeature, SomeFeatureSkeleton } from './_features/SomeFeature';
import { buildNormalizedParams } from './_lib/buildNormalizedParams';

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const queryParameters = await searchParams;

  // パラメーター正規化は page.tsx で実行
  const normalizedParams = buildNormalizedParams(queryParameters);

  return (
    // 必要な場合のみ Suspense でラップ（原則は loading.tsx に任せる）
    <Suspense fallback={<SomeFeatureSkeleton />}>
      <SomeFeature id={id} params={normalizedParams} />
    </Suspense>
  );
}
```

```tsx
// _features/SomeFeature/SomeFeature.tsx
export type SomeFeatureProps = {
  id: string;
  params: NormalizedParams;
};

export async function SomeFeature({ id, params }: SomeFeatureProps) {
  // params は既に正規化済み - フェッチ処理のみ実行
  const apiQuery = buildApiQueryString(params);
  const data = await fetch(`/api/path/${id}?${apiQuery}`);

  return <Component data={data} />;
}
```

## バレルエクスポート規約

| ディレクトリ                   | `index.ts` | 備考                       |
| ------------------------------ | ---------- | -------------------------- |
| `src/components/primitives/`   | ✅ 許可    |                            |
| `src/components/patterns/`     | ✅ 許可    |                            |
| `src/features/`                | ❌ 禁止    | 直下のバレルファイル禁止   |
| `src/hooks/`                   | ✅ 許可    |                            |
| `src/lib/`                     | ❌ 禁止    | server-only 問題回避       |
| `src/types/`                   | ✅ 許可    |                            |
| `src/utils/`                   | ✅ 許可    |                            |
| `app/**/_components/`          | ✅ 許可    |                            |
| `app/**/_features/`            | ❌ 禁止    | 直下のバレルファイル禁止   |
| `app/**/_hooks/`               | ✅ 許可    |                            |
| `app/**/_lib/`                 | ❌ 禁止    | 各ファイルを直接インポート |
| `app/**/_providers/`           | ✅ 許可    |                            |
| `app/**/_types/`               | ✅ 許可    |                            |
| `app/**/_utils/`               | ✅ 許可    |                            |

## インポートパス規約

| 場所                        | ルール       | 例                                                           |
| --------------------------- | ------------ | ------------------------------------------------------------ |
| `app/` 配下のモジュール間   | 相対パス     | `import { SomeFeature } from './_features/SomeFeature'` |
| `src/` 直下のモジュール     | `@/` エイリアス | `import { cn } from '@/lib/cn'`                              |

### 重要: app/ 配下での相対パス

`app/` 配下では、同一ルートセグメント内のモジュール（`_components`, `_features`, `_lib` など）をインポートする際は**必ず相対パス**を使用する。`@/app/...` のようなエイリアスは使用しない。

```tsx
// ✅ 正しい
import { SomeFeature } from './_features/SomeFeature';
import { buildParams } from './_lib/buildParams';
import { SomeType } from './_types';

// ❌ 間違い
import { SomeFeature } from '@/app/(group-a)/some-page/_features/SomeFeature';
```

トップレベル（`src/` 直下）のモジュールのみ `@/` エイリアスを使用する。

```tsx
// ✅ トップレベルは @/ エイリアス
import { cn } from '@/lib/cn';
import { Button } from '@/components/primitives';
```

## 迷ったときの判断ルール

配置先に迷った場合は、以下の基準で判断する。

| 条件                               | 配置先             |
| ---------------------------------- | ------------------ |
| 再利用されていない                 | 昇格しない（ページ専用のまま） |
| ビジネス判断が含まれる             | features / _features |
| UI の具体的表現（見た目）          | primitives         |
| UI の体験（操作・連携）            | patterns           |
| 外部ライブラリに依存する           | lib / _lib         |
| 外部ライブラリに依存しない純粋関数 | utils / _utils     |

### 例外の扱い方

ルールに当てはまらないケースが発生した場合：

1. 一旦はルールに近い場所に配置する
2. 「次の最適化ポイント」として issue 化する
