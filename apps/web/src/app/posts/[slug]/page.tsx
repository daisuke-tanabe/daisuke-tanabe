import fs from 'node:fs';
import path from 'path';

import parse, { domToReact, HTMLReactParserOptions, Element, DOMNode } from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import NextLink from 'next/link';
import React from 'react';

type Post = {
  title: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  content: string;
};

export function generateStaticParams() {
  const jsonDir = path.join(process.cwd(), 'docs/json/data.json');
  const files = fs.readFileSync(jsonDir, 'utf-8');
  const postsData = JSON.parse(files) as Post[];

  const data = postsData.map((file) => {
    const filePath = path.join(process.cwd(), 'docs/json', `${file.slug}.json`);
    const result = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(result) as Post;
  });

  return data.map((value) => ({
    slug: value.slug,
    content: value.content,
  }));
}

const options: HTMLReactParserOptions = {
  replace(domNode, index) {
    if (domNode instanceof Element && domNode.attribs && domNode.name === 'a') {
      if (domNode.attribs.href.startsWith('/')) {
        return (
          <NextLink key={index} href={domNode.attribs.href}>
            {domToReact((domNode.children as DOMNode[]) ?? [])}
          </NextLink>
        );
      } else {
        return (
          <a key={index} href={domNode.attribs.href} target="_blank">
            {domToReact((domNode.children as DOMNode[]) ?? [])}
          </a>
        );
      }
    }
  },
};

export default async function PostByIdPage({ params }: { params: Promise<Post> }) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), 'docs/json', `${slug}.json`);
  const result = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(result) as Post;

  const sanitizedHtml = DOMPurify.sanitize(data.content);

  return (
    <>
      <div className="flex flex-col gap-4 mb-12">
        <h1 className="text-2xl leading-[1.2] font-bold">{data.title}</h1>
        <p className="text-sm leading-[1.6]">{data.description}</p>
      </div>
      <div className="markdown-content">{parse(sanitizedHtml, options)}</div>
    </>
  );
}
