import fs from 'node:fs';

import rehypeStringify from 'rehype-stringify';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import yaml from 'yaml';

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkExtractFrontmatter, {
    yaml: yaml.parse,
    name: 'meta',
  })
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

const files = fs.readdirSync('docs/markdown');

const allPosts = files.map(async (file) => {
  const markdownFile = fs.readFileSync(`docs/markdown/${file}`);
  const result = await processor.process(markdownFile);

  const { meta } = result.data as {
    meta: {
      title: string;
      description: string;
      author: string;
      slug: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
    };
  };

  const jsonData = JSON.stringify({
    title: meta.title,
    description: meta.description,
    author: meta.author,
    slug: meta.slug,
    created_at: meta.created_at === 'null' ? null : meta.created_at,
    updated_at: meta.updated_at === 'null' ? null : meta.updated_at,
    deleted_at: meta.deleted_at === 'null' ? null : meta.deleted_at,
    content: result.value,
  });

  // 個別にJSONファイルを出力
  fs.writeFileSync(`docs/json/${file.replace('.md', '')}.json`, jsonData);

  return {
    title: meta.title,
    description: meta.description,
    slug: meta.slug,
    created_at: meta.created_at === 'null' ? null : meta.created_at,
    updated_at: meta.updated_at === 'null' ? null : meta.updated_at,
    deleted_at: meta.deleted_at === 'null' ? null : meta.deleted_at,
  };
});

const data = await Promise.all(allPosts);

// 全体のJSONファイルを出力
fs.writeFileSync(`docs/json/data.json`, JSON.stringify(data));
