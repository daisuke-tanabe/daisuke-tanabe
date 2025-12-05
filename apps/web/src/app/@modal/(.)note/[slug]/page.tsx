import fs from 'node:fs';

import parse, { DOMNode, domToReact, Element, HTMLReactParserOptions } from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import NextLink from 'next/link';
import path from 'path';
import React, { CSSProperties } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { Page } from '@/app/@modal/(.)note/[slug]/_features/Page';

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

    if (domNode instanceof Element && domNode.attribs && domNode.name === 'pre') {
      const codeBlockElement = domNode.children[0];
      if (codeBlockElement instanceof Element && codeBlockElement.attribs && codeBlockElement.name === 'code') {
        const language = codeBlockElement.attribs.class.match(/(?<=language-)\w+/g)?.at(0);
        if ('data' in codeBlockElement.children[0] && typeof codeBlockElement.children[0].data === 'string') {
          return (
            <SyntaxHighlighter language={language} style={a11yDark as { [p: string]: CSSProperties }}>
              {codeBlockElement.children[0].data}
            </SyntaxHighlighter>
          );
        }
      }
    }
  },
};

export default async function PostByIdPage({ params }: { params: Promise<Post> }) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), 'data/json', `${slug}.json`);
  const result = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(result) as Post;

  const sanitizedHtml = DOMPurify.sanitize(data.content);

  return (
    <Page title={data.title} publishedAt={data.published_at}>
      <div className="markdown-content">{parse(sanitizedHtml, options)}</div>
    </Page>
  );
}
