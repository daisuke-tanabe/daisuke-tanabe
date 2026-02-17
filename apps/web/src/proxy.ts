import { NextResponse } from 'next/server';

export function proxy() {
  const response = NextResponse.next();

  // SSRリクエストに対して Cache-Control ヘッダーを追加
  // - max-age=0: ブラウザキャッシュ無効（デプロイ時の不整合防止）
  // - s-maxage=300: CDNキャッシュ5分（Lambda呼び出し削減）
  // - stale-while-revalidate=300: 期限切れ後も5分間は古いキャッシュを返しつつバックグラウンド更新
  response.headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=300, stale-while-revalidate=300',
  );

  return response;
}
