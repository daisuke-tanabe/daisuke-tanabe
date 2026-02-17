# Next.js ルール（必須）

App Router における Server / Client 境界の規約。

## レイヤー設計

| 層            | 責務                                     |
| ------------- | ---------------------------------------- |
| `app/`        | ルーティング、レイアウトのみ             |
| `components/` | 表示ロジック                             |
| `hooks/`      | アプリ全体で共有するクライアント hooks   |
| `lib/`        | ユーティリティ                           |

依存の方向: `app/ → components/ → lib/`

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

## 5. Props 境界と型の方針

- Client には**表示用の最小データのみ**渡す
- `Date` / `Map` / `Set` / class instance / 関数を渡さない
- `Date` は ISO 文字列に変換して渡す
- 同一 feature 内で複数ファイルが同じ型を使う場合は feature ルートの `types.ts` に定義
- 構造的型付けにより、RSC → Client Component の props 受け渡し時に TypeScript が不整合を検出する

## 6. スコープと lib/ の構造

### スコープの棲み分け

| 配置                         | スコープ                               | 例                                 |
| ---------------------------- | -------------------------------------- | ---------------------------------- |
| `src/hooks/`                 | アプリ全体で共有するクライアント hooks | `use-debounce.ts`, `use-mobile.ts` |
| `src/lib/`                   | アプリ全体で共有                       | `constants.ts`, `utils.ts`         |
| `app/(group)/_lib/`          | そのルートグループ内のみ               | ルートグループ固有のユーティリティ |
| `app/(group)/route/_lib/`    | そのルートのみ                         | ルート固有のユーティリティ         |
| `_features/xxx/lib/`         | その Feature 内のみ                    | Feature 固有のロジック             |

同様に `_hooks/` もスコープの原則は同じ。

### ルール

- `lib/index.ts` のバレルは作らない（個別ファイルへの直接 import）
- `lib/utils.ts` はファイル位置をそのまま維持（`components.json` の `aliases.utils` が `"@/lib/utils"` を参照）
- Server / Client どちらからも使える純粋関数・定数は `src/lib/` に配置
