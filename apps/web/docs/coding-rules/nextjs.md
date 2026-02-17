# Next.js ルール（必須）

App Router における Server / Client 境界とデータ取得の規約。
Web はフロントエンド専念（RSC + Client Component + API クライアント）。
データ操作は全て `apps/api`（Hono）が担当する。

## レイヤー設計

| 層            | 責務                                     |
| ------------- | ---------------------------------------- |
| `app/`        | ルーティング、レイアウトのみ             |
| `components/` | 表示ロジック                             |
| `hooks/`      | アプリ全体で共有するクライアント hooks   |
| `lib/`        | API クライアント + ユーティリティ        |

依存の方向: `app/ → components/ → lib/api/server` or `lib/api/{domain}`
共有型・定数は `@index-vault/shared` から import。

## 1. Server / Client 分離

- Server Component: `Feature.tsx`（サフィックスなし）
- Client Component: `Feature.client.tsx`（`'use client'` 必須）
- App Router のデフォルトは Server のため `.server.tsx` は使わない
- `.client.tsx` は `_features/` ルート直下の SC/CC ペアでのみ使用する
- `_features/components/`・`_components/` 内の CC はサフィックスなし + `'use client'` を記述する

```
MarketSummarySection.tsx          # Server: データ取得 → Client に渡す
MarketSummarySection.client.tsx   # Client: インタラクション
```

## 2. コンポーネント・コードの配置

### スコープルール

| 配置                              | スコープ                                          |
| --------------------------------- | ------------------------------------------------- |
| `src/components/`                 | ルートグループを横断して共有（ui 含む）           |
| `app/(group)/_components/`        | ルートグループ内で機能横断の共有                  |
| `app/xxx/_components/`            | そのルート内で機能横断の共有                      |
| `app/.../_features/feature-name/` | `page.tsx` を持つルートまたはルートグループに配置 |

### ディレクトリ構造

```
app/(auth)/dashboard/
├── _components/                    # 機能横断の共有コンポーネント
│   ├── ComponentA.tsx
│   ├── ComponentB.tsx
│   └── index.ts
├── _features/                      # 機能スコープ
│   └── market-summary/
│       ├── index.ts                # 公開面の export
│       ├── MarketSummary.tsx       # Server（公開面）
│       ├── MarketSummary.client.tsx # Client（公開面の CC 側）
│       ├── components/             # 内部コンポーネント
│       │   ├── MarketSummaryCard.tsx
│       │   └── index.ts
│       ├── lib/                    # 内部ロジック（必要時のみ作成）
│       └── hooks/                  # 内部 hooks（必要時のみ作成）
├── _lib/                           # ルートスコープの共有ロジック
├── _hooks/                         # ルートスコープの共有 hooks
├── loading.tsx
└── page.tsx
```

### ルール

\_features/ 構造:

- `_features/` 直下には Feature フォルダのみ（ファイル直置き禁止）
- Feature ルート直下には公開面（Server のみ、または Server + .client ペア）と `index.ts` のみ
- 内部コンポーネントは `components/` に配置
- `lib/`, `hooks/` は必要になったら作成（空フォルダ禁止）

import 制約:

- Feature 間の直接 import は禁止（必要なら page.tsx で合成）
- `components/` 内のコンポーネント同士で import しない（親の SC/CC から使う）
- `_components/` 内のコンポーネント同士で import しない（layout / page で合成）

スコープ:

- ルートレベルの `_lib/`, `_hooks/` はそのルートスコープ内で共有
- `src/lib/`, `src/components/` はアプリ全体で共有（従来通り）

## 3. ファイル命名

| 種別                       | 規約                                                 | 例                                              |
| -------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| `components/ui/`           | kebab-case（shadcn/ui 準拠）                         | `button.tsx`, `dropdown-menu.tsx`               |
| `components/`（ui 以外）   | PascalCase（ルートグループ横断の共有コンポーネント） | `ChangeRate.tsx`                                |
| `_components/`             | PascalCase（機能横断の共有コンポーネント）           | `ComponentA.tsx`                                |
| `hooks/`                   | kebab-case（`use-` プレフィックス）                  | `use-debounce.ts`, `use-mobile.ts`              |
| `_features/` フォルダ名    | kebab-case                                           | `market-summary/`, `watch-list/`                |
| `_features/` ルート直下    | PascalCase（SC/CC ペア）                             | `MarketSummary.tsx`, `MarketSummary.client.tsx` |
| `_features/components/` 内 | PascalCase（サフィックスなし）                       | `SortableTable.tsx`                             |
| Feature フォルダ公開面     | `index.ts`（barrel export）                          | `market-summary/index.ts`                       |

※ Server / Client の命名（`.client.tsx`）は §1 を参照

## 4. page.tsx の責務

- コンポーネントの**構成（composition）のみ**
- データ取得・整形・ビジネスロジックを書かない

```tsx
// OK
export default function Page() {
  return (
    <main>
      <MarketSummarySection />
      <IndexListSection />
    </main>
  );
}

// NG: page.tsx でデータ取得
export default async function Page() {
  const data = await getMarketData();
  return <MarketSummary data={data} />;
}
```

## 5. データ取得と API クライアント

### アーキテクチャ

```
RSC → lib/api/server.ts (Hono RPC) → Hono API（直接）
Client → lib/api/{domain}.ts (Hono RPC) → /api/* Route Handler (BFF) → Hono API（プロキシ）
```

- RSC 用 (`lib/api/server.ts`) と Client 用 (`lib/api/{domain}.ts`) は完全に分離
- Client Component はトークンを直接扱わない（BFF が認証を処理）
- 共有エラークラスは `lib/api/errors.ts` に配置
- 両方とも `hc<AppType>()` による Hono RPC で型安全

### RSC からのデータ取得

- データを**使う Server Component 自身**が `lib/api/server` 経由で取得する
- `page.tsx` ではデータ取得しない（構成のみ）
- `createServerRpc()` で認証付き RPC クライアントを生成（内部で `auth().getToken()` を呼ぶ）
- `import 'server-only'` により Client Component からの誤 import を防止
- 環境変数: `process.env.API_URL`（`NEXT_PUBLIC_` 不要）

```tsx
// Server Component
import { createServerRpc } from '@/lib/api/server';

const rpc = await createServerRpc();
const res = await rpc.api.tickers.$get();
const { data: tickers } = await res.json();
```

### Client からの API 呼び出し

- ドメイン分割 RPC モジュール（`lib/api/{domain}.ts`）経由で Route Handler（BFF）を叩く
- トークン不要（BFF がサーバー側で処理）
- ミューテーション後は `router.refresh()` で RSC を再描画
- パスは Hono RPC が自動生成

```tsx
// Client Component
'use client';
import { tickersApi } from '@/lib/api/tickers';
import { watchlistApi } from '@/lib/api/watchlist';

// GET
const items = await tickersApi.suggested();

// Mutation
await watchlistApi.add(tickerId);
await watchlistApi.remove(tickerId);
```

### パス規約

| クライアント | パスの書き方 | 理由 |
|---|---|---|
| `lib/api/server.ts` | Hono RPC 自動生成 | `hc<AppType>(API_BASE_URL)` |
| `lib/api/{domain}.ts` | Hono RPC 自動生成 | `hc<AppType>('')` → BFF プロキシ経由 |

### ポーリング

- Client Component からドメインモジュール経由で定期取得
- ポーリング間隔は `lib/constants.ts` の `POLLING_INTERVAL_MS` を使用

### 整形の責務

- データの整形は API サーバー側の責務
- Web は API レスポンスをそのまま表示する
- Client Component を計算器にしない

### API クライアントの規約

- RSC からは `lib/api/server` の `createServerRpc()` を使用（Hono RPC）
- Client Component からはドメイン分割モジュールを使用（`tickersApi`, `watchlistApi`, `marketSummaryApi`）
- RPC の共有基盤は `lib/api/rpc.ts`（`hc<AppType>('')` + `unwrap` ヘルパー）
- `lib/index.ts` のバレルは作らない（個別ファイルへの直接 import）

## 6. Props 境界と型の方針

- Client には**表示用の最小データのみ**渡す
- `Date` / `Map` / `Set` / class instance / 関数を渡さない
- `Date` は ISO 文字列に変換して渡す
- DTO を共有パッケージで共有しない。API 側は型推論、コンポーネント側は Props にローカル定義
- 同一 feature 内で複数ファイルが同じ型を使う場合は feature ルートの `types.ts` に定義
- 構造的型付けにより、RSC → Client Component の props 受け渡し時に TypeScript が不整合を検出する

### API レスポンス型（Dto）

API 境界の入出力契約を表す型には `Dto` サフィックスを付ける。

| 規約 | 例 |
|---|---|
| 配置先 | `lib/api/dto.ts` |
| API レスポンス型 | `TickerDto`, `MarketSummaryDto` |
| Dto から導出したユーティリティ型 | `ChangeRate`（サフィックス不要） |

- `InferResponseType` で API 定義から自動導出し、手書きの二重定義を避ける
- Dto はコンポーネントの Props 型としてそのまま使用してよい（Props 境界での再定義は不要）

## 7. スコープと lib/ の構造

### スコープの棲み分け

| 配置                         | スコープ                               | 例                                 |
| ---------------------------- | -------------------------------------- | ---------------------------------- |
| `src/hooks/`                 | アプリ全体で共有するクライアント hooks | `use-debounce.ts`, `use-mobile.ts` |
| `src/lib/`                   | アプリ全体で共有                       | `api/server.ts`, `api/rpc.ts`, `api/tickers.ts`, `constants.ts`, `utils.ts` |
| `app/(auth)/_lib/`           | そのルートグループ内のみ               | ルートグループ固有のユーティリティ |
| `app/(auth)/dashboard/_lib/` | そのルートのみ                         | ルート固有のユーティリティ         |
| `_features/xxx/lib/`         | その Feature 内のみ                    | Feature 固有のロジック             |

同様に `_hooks/` もスコープの原則は同じ。

### ディレクトリ構成

```
src/lib/
├── api/
│   ├── server.ts         # RSC 専用 RPC クライアント（server-only, hc + auth）
│   ├── rpc.ts            # Client 用 RPC 共有基盤（hc<AppType>('') + unwrap）
│   ├── dto.ts            # API レスポンス型（Dto）
│   ├── tickers.ts        # tickersApi（Client Component 用）
│   ├── watchlist.ts      # watchlistApi（Client Component 用）
│   ├── market-summary.ts # marketSummaryApi（Client Component 用）
│   └── errors.ts         # 共有エラークラス（ApiClientError）
├── constants.ts          # アプリ共通の定数
└── utils.ts              # shadcn 規約で固定（components.json で参照）
```

### import ルール

```ts
import { createServerRpc } from '@/lib/api/server';  // RSC
import { tickersApi } from '@/lib/api/tickers';       // Client Component
import { watchlistApi } from '@/lib/api/watchlist';   // Client Component
import { POLLING_INTERVAL_MS } from '@/lib/constants';
import { cn } from '@/lib/utils';
```

- `lib/index.ts` のバレルは作らない
- 常に個別ファイルへの直接 import を使う

### lib/ 直下 — Shared ユーティリティ

- Server / Client どちらからも使える純粋関数・定数
- `lib/utils.ts` はファイル位置をそのまま維持
- `components.json` の `aliases.utils` は `"@/lib/utils"` に設定

## 8. 共有型・定数（`@index-vault/shared`）

ドメイン型・定数・ブランデッド型は `@index-vault/shared` から import する。
`@/` パスは Web 固有のコードのみに使用する。
DTO は共有しない（API 側は推論、コンポーネント側は Props にローカル定義）。

### import ルール

```ts
// 共有パッケージ（ドメイン型・定数・ブランデッド型）
import { PERIODS, PERIOD_LABELS, type Period } from '@index-vault/shared';
import type { ISO8601String } from '@index-vault/shared';

// Web 固有
import { createServerRpc } from '@/lib/api/server';
import { tickersApi } from '@/lib/api/tickers';
import { cn } from '@/lib/utils';
```
