import { NextResponse } from 'next/server';

export function proxy() {
  const response = NextResponse.next();

  // SSRリクエストに対して Cache-Control ヘッダーを追加
  response.headers.set('Cache-Control', 'public, s-maxage=86400, max-age=86400');

  return response;
}
