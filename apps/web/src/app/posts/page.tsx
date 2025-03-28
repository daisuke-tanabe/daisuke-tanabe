import { Metadata } from 'next';

import { BlockSectionGroup, LeadText } from '@/app/_components';

export const metadata: Metadata = {
  title: 'Posts',
};

export default function PostsPage() {
  return (
    <BlockSectionGroup>
      <LeadText>投稿が存在しません</LeadText>
    </BlockSectionGroup>
  );
}
