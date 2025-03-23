import fs from 'node:fs';
import path from 'path';

import { format } from '@formkit/tempo';
import NextLink from 'next/link';

type Post = {
  title: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export default function PostsPage() {
  const filePath = path.join(process.cwd(), 'docs/json/data.json');
  const result = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(result) as Post[];

  return (
    <div className="flex flex-col gap-15">
      <section>
        <h2 className="text-sm leading-[1.6] mb-7">2025</h2>
        <div className="grid gap-6">
          {data.map(({ slug, title, description, created_at }) => (
            <div key={slug} className="flex gap-6">
              <div className="shrink-0 text-sm w-[6.5em]">
                <span className="font-light text-muted-foreground leading-[1.6]">
                  {format({
                    date: created_at,
                    format: 'MMM DD',
                    tz: 'Asia/Tokyo',
                  })}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <NextLink href={`/posts/${slug}`} className="text-sm leading-[1.6] hover:underline">
                  {title}
                </NextLink>
                <div className="text-sm text-muted-foreground leading-[1.6]">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
