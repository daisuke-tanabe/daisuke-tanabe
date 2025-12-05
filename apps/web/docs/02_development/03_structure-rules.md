# 構成ルール

このドキュメントはプロジェクトのディレクトリ構成およびファイル命名に関するルールを定義する。

## 'use client' 早見表

| 層           | 'use client'     |
| ------------ | ---------------- |
| primitives   | 必須             |
| patterns     | 必須             |
| \_components | 必須             |
| \_features   | 状況に応じて分離 |
| \_providers  | 必須             |

## 命名規則

src 配下に適用する。

### コンポーネント（components, app）

- ディレクトリ: PascalCase（例: `Header/`, `FormGroup/`）
- ファイル: PascalCase（例: `Header.tsx`, `FormGroup.tsx`）

### 非コンポーネント（lib, utils, types）

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
- 許容する責務・許容しない責務は primitives/patterns と同様

**理由**: primitives/patterns と同様、スコープ内の再利用 UI は client 統一で運用を安定させる。

### \_features

- 当該スコープ専用のコンポーネントを配置する
- `_features/` は兄弟の `page.tsx`・`layout.tsx` 等のスコープに限定する
- 再利用を前提としない

**理由**: RSC の境界管理は feature レイヤで行う。primitives/patterns は UI の世界、\_features はデータ取得と UI を繋ぐ世界として責務を分離する。

#### ファイル命名

- サーバーコンポーネント: `*.tsx`
- クライアントコンポーネント: `*.client.tsx`

#### ディレクトリ構成

- feature は必ずディレクトリにまとめる（`_features/` 直下にフラット配置禁止）
- 単一ファイルで完結する場合も、ディレクトリにまとめる
- `index.ts` は feature のエントリーポイントを export する
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

### 構成例

```
app/
├── _components/
│   ├── Card.tsx
│   └── index.ts
├── _features/
│   ├── Header/
│   │   ├── Header.tsx           # server（データ不要）
│   │   ├── UserMenu.client.tsx  # client（インタラクション）
│   │   └── index.ts             # Header のみ export
│   └── Footer/
│       ├── Footer.tsx           # 単一ファイルで完結
│       └── index.ts
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
    ├── page.tsx
    └── [id]/
        └── _features/
            └── PostDetail/
                ├── PostDetail.tsx
                ├── PostDetail.client.tsx
                └── index.ts
```
