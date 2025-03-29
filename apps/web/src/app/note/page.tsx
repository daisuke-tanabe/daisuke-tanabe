import fs from 'node:fs';
import path from 'path';

import { format } from '@formkit/tempo';
import { Metadata } from 'next';

import { BlockSection, BlockSectionGroup, BlockSectionTitle, EntryList, EntryListItem } from '@/app/_components';

type Post = {
  title: string;
  description: string;
  pathname: string;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Daisuke Tanabe のポートフォリオサイトに掲載された投稿一覧です。',
};

export default function PostsPage() {
  const filePath = path.join(process.cwd(), 'docs/json/data.json');
  const result = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(result) as Post[];

  return (
    <BlockSectionGroup>
      <BlockSection>
        <BlockSectionTitle>Note</BlockSectionTitle>
        <EntryList>
          {data.map(({ created_at: createdAt, description, pathname, title }, index) => (
            <EntryListItem
              key={index}
              description={description}
              label={format({
                date: createdAt,
                format: 'MMM DD',
                tz: 'Asia/Tokyo',
              })}
              link={pathname}
              title={title}
            />
          ))}
        </EntryList>
      </BlockSection>
    </BlockSectionGroup>
  );
}
