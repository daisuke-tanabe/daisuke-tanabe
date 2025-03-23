import fs from 'node:fs';
import path from 'path';

type Post = {
  title: string;
  description: string;
  author: string;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  content: string;
};

export function generateStaticParams() {
  const jsonDir = path.join(process.cwd(), 'docs/json');
  const files = fs.readdirSync(jsonDir);

  const data = files.map((file) => {
    const filePath = path.join(process.cwd(), 'docs/json', file);
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

  const filePath = path.join(process.cwd(), 'docs/json', `${slug}.json`);
  const result = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(result) as Post;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <p>{data.author}</p>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  );
}
