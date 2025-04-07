import { Metadata } from 'next';

import { BlockSection, BlockSectionGroup, BlockSectionTitle, LeadText } from '@/app/_components';

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Daisuke Tanabe のポートフォリオサイトに掲載された投稿一覧です。',
};

export default function PostsPage() {
  return (
    <BlockSectionGroup>
      <BlockSection>
        <BlockSectionTitle>2025</BlockSectionTitle>
        <LeadText>投稿が存在しません</LeadText>
      </BlockSection>
    </BlockSectionGroup>
  );
}
