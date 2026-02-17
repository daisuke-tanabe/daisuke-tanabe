import fs from 'node:fs';

import path from 'path';

import { NoteDetail } from '@/app/@modal/(.)note/[slug]/_features/note-detail';

type Post = {
  title: string;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  published_at: string;
  content: string;
};

export function generateStaticParams() {
  const jsonDir = path.join(process.cwd(), 'data/json/data.json');
  const files = fs.readFileSync(jsonDir, 'utf-8');
  const postsData = JSON.parse(files) as Post[];

  const data = postsData.map((file) => {
    const filePath = path.join(process.cwd(), 'data/json', `${file.slug}.json`);
    const result = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(result) as Post;
  });

  return data.map((value) => ({
    slug: value.slug,
    content: value.content,
  }));
}

export default async function Page({ params }: { params: Promise<Post> }) {
  const { slug } = await params;

  return <NoteDetail slug={slug} />;
}
