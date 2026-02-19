# プロジェクト概要

pnpm + Turborepo によるモノレポ。Next.js の web アプリと共有パッケージで構成。

## テクノロジースタック

- パッケージマネージャー: pnpm
- モノレポツール: Turborepo
- フレームワーク: Next.js
- 言語: TypeScript
- テスト: Vitest
- リンター: ESLint + Prettier
- インフラ: Terraform + AWS

## よく使うコマンド

- `pnpm install` — 依存関係のインストール
- `pnpm build` — 全パッケージのビルド
- `pnpm test` — 全パッケージのテスト実行
- `pnpm lint` — リンターの実行

## コーディング規約

- コミットは Conventional Commits 形式（日本語メッセージ）
- テストが必要なロジックは TDD で実装する（/tdd スキル使用）
- UI のみの変更は /implement スキルを使用する

## コンテキスト管理

- 50% のコンテキスト消費で /compact を実行する
- 複雑なタスクは 50% 以内で完了するサブタスクに分割する
- 各タスク完了後にこまめにコミットする

## 作業フロー

- 実装前に /plan モードで設計を確認する
- 変更後は pnpm test / pnpm lint で検証する
- コミットは /commit スキルで論理的な単位ごとに作成する
