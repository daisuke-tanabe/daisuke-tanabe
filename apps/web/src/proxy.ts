import { NextResponse } from 'next/server';

export function proxy() {
  const response = NextResponse.next();

  // SSRリクエストに対して Cache-Control ヘッダーを追加
  // - max-age=0: ブラウザキャッシュ無効（デプロイ時の不整合防止）
  // - s-maxage=60: CDNキャッシュ60秒（オリジン負荷軽減）
  response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=60');

  return response;
}
