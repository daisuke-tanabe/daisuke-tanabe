import { Button } from '@workspace/ui/components';
import { Metadata } from 'next';
import NextLink from 'next/link';

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'Daisuke Tanabe のポートフォリオサイトに存在しないページです。',
};

export default function NotFound() {
  return (
    <section className="flex flex-col text-center">
      <h2 className="text-2xl font-bold leading-[1.6] mb-4">404 Not Found</h2>
      <p className="text-sm leading-[1.6] mb-8">アクセスしようとしたページは移動したか削除されました。</p>
      <Button className="self-center" variant="link" asChild>
        <NextLink href="/">ホームに戻る</NextLink>
      </Button>
    </section>
  );
}
