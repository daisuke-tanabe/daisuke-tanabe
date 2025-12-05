# 構成ルール

このドキュメントはプロジェクトのディレクトリ構成およびファイル命名に関するルールを定義する。

## 'use client' 早見表

| 層           | 'use client'     |
| ------------ | ---------------- |
| primitives   | 必須             |
| patterns     | 必須             |
| \_components | 必須             |
| \_features   | 状況に応じて分離 |

## 命名規則

src 配下のコンポーネントに適用する。

- ディレクトリ: PascalCase（例: `Header/`, `FormGroup/`）
- ファイル: PascalCase（例: `Header.tsx`, `FormGroup.tsx`）

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

### 構成例

```
src/components/
├── primitives/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── index.ts
└── patterns/
    ├── SearchForm.tsx
    ├── DataTable.tsx
    └── index.ts
```

## app ディレクトリ

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

### 構成例

```
app/
├── _features/
│   ├── Header/
│   │   ├── Header.tsx           # server（データ不要）
│   │   ├── UserMenu.client.tsx  # client（インタラクション）
│   │   └── index.ts             # Header のみ export
│   └── Footer/
│       ├── Footer.tsx           # 単一ファイルで完結
│       └── index.ts
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
