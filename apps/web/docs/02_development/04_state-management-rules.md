# 状態管理ルール

このドキュメントは Next.js プロジェクトにおける状態管理のルールを定義する。

**原則**: 状態は「効力を持つ最小スコープ」に置く。

## Server / Client の判断（最優先）

状態管理を検討する前に、まず Server Component で完結できるか判断する。

| 条件 | 判断 |
| ---- | ---- |
| ユーザー操作・ブラウザ API・localStorage が必要 | Client Component |
| 上記が不要 | Server Component（状態管理ライブラリ不要） |

**Server でできるなら Server が正解。**

## 状態の分類

| 分類            | 管理方法              | 例                     |
| --------------- | --------------------- | ---------------------- |
| UI State        | useState / useReducer | モーダル開閉、タブ選択 |
| Global UI State | Zustand / Context     | 認証、テーマ、トースト |
| Server State    | TanStack Query        | API データ             |
| URL State       | nuqs                  | 検索条件、ページング   |

## UI State

コンポーネント内部のインタラクション状態。

**原則**: ローカル > Props > Context（最終手段）

**理由**: スコープが小さいほど依存が減り、意図しない再描画を防げる。

### ローカル state（useState / useReducer）

- モーダル・ドロワーの開閉
- タブの選択状態
- ホバー・フォーカス状態
- 入力補助 UI の表示制御

**禁止**: UI State をグローバルに置かない。

### Props

- 親の UI 状態を子が参照する場合のみ使用

### Context

- Props のバケツリレーが破綻する場合の最終手段

## Global UI State

アプリ横断で共有が必要な UI 状態。Zustand または Context で管理する。

### グローバルに置いてよいもの

- 認証情報（user, role）
- テーマ（dark / light）
- トースト・通知の状態
- ビューポート情報

**原則**: 上記以外はグローバルに置かない。

**理由**: グローバルは再描画範囲が広く、責務が曖昧になりやすい。

### Zustand の状態スコープ

| スコープ | 手段 | 例 |
| -------- | ---- | -- |
| コンポーネント内 | useState / useReducer | フォーム入力、モーダル開閉 |
| ページ配下 + 永続化 | Zustand + Provider | chartTimeAxis |
| アプリ全体 + 永続化 | Zustand（直接 create） | tableColumn |
| Server 初期値注入 | Zustand + Provider | me, tenant |

### Zustand 実装パターン

#### A. Server 初期値注入（me, tenant）

Server Component でデータ取得 → Provider で注入 → Client で利用。

```
layout.tsx (Server)
  ↓ fetch
Provider (value={initialState})
  ↓ Context
useXxx() hook (Client)
```

**実装ファイル**:
- `src/stores/xxx/store.ts` - Factory 関数 `createXxxStore(initState)`
- `_providers/XxxStoreProvider.tsx` - useRef で生成
- `src/stores/xxx/useXxx.ts` - Context 経由でアクセス

#### B. ページスコープ + 永続化（chartTimeAxis）

特定ページ内でのみ使用、localStorage に永続化。

**実装ファイル**:
- `_stores/xxx/store.ts` - Factory 関数 `createXxxStore()` + persist
- `_providers/XxxStoreProvider.tsx` - useRef で生成
- `_stores/xxx/useXxx.ts` - Context 経由でアクセス

#### C. アプリ全体 + 永続化（tableColumn）

複数ページで共有、localStorage に永続化。

**実装ファイル**:
- `src/stores/xxx/store.ts` - 直接 `createStore()` + persist
- Provider 不要（グローバルアクセス）

## Server State

API から取得するデータ。TanStack Query で管理する。

**原則**: サーバーデータを UI State に保持しない。

**理由**: キャッシュ・再フェッチ・エラー管理を Query に任せられる。

### Server Actions との使い分け

- データ取得: TanStack Query
- データ更新: Server Actions + invalidateQueries

## URL State

共有可能な状態。nuqs で管理する。

**原則**: URL は「共有したい状態」のみ。

**理由**: URL は入力値であり、結果（データ）は Server State が担当する。

### URL に保存するもの

- 検索条件
- フィルタ
- ソート
- ページネーション
- 意味を持つ ID（タブ切替等）

### URL に保存しないもの

- 確認ダイアログやフォームなど一時的な UI 状態
- 共有する意味のないモーダル

## 俯瞰図

```mermaid
flowchart TB
    subgraph Client["Client Component"]
        subgraph UIState["UI State"]
            Local["useState / useReducer<br/>モーダル、タブ、フォーカス"]
        end

        subgraph GlobalUI["Global UI State"]
            Zustand["Zustand / Context<br/>認証、テーマ、トースト"]
        end

        subgraph ServerState["Server State"]
            TanStack["TanStack Query<br/>APIデータのキャッシュ"]
        end

        subgraph URLState["URL State"]
            nuqs["nuqs<br/>検索、フィルタ、ページング"]
        end
    end

    subgraph Server["Server"]
        SA["Server Actions"]
        API["外部API"]
        DB["Database"]
    end

    subgraph Browser["ブラウザ"]
        URL["URL"]
    end

    Local -->|コンポーネント内で完結| Local
    Zustand -->|アプリ横断で共有| Zustand
    TanStack -->|fetch / キャッシュ| API
    TanStack -->|invalidate| SA
    SA -->|更新| DB
    nuqs <-->|同期| URL
    URL -->|共有可能| Browser
```

## 選択フロー

```mermaid
flowchart TD
    Start["状態を管理したい"] --> Q1{"共有可能にしたい？<br/>検索・フィルタ等"}

    Q1 -->|Yes| URLState["URL State<br/>(nuqs)"]
    Q1 -->|No| Q2{"サーバーデータ？"}

    Q2 -->|Yes| ServerState["Server State<br/>(TanStack Query)"]
    Q2 -->|No| Q3{"アプリ横断で必要？<br/>認証・テーマ等"}

    Q3 -->|Yes| GlobalUI["Global UI State<br/>(Zustand / Context)"]
    Q3 -->|No| UIState["UI State<br/>(useState)"]
```

## NG パターン

| パターン | 理由 |
| -------- | ---- |
| 最初から Client Component | Server で完結できないか検討していない |
| Server で Zustand | Zustand は Client 専用 |
| ページ限定のつもりで直 create() | スコープを超えてグローバルになる |
| 何でもグローバル | スコープを意識していない |
