import {
  BlockSection,
  BlockSectionGroup,
  BlockSectionTitle,
  EntryList,
  EntryListItem,
  LeadText,
} from '@/app/_components';

const workExperienceData = [
  {
    description: 'フロントエンド領域のリードエンジニア',
    label: '2023 — Now',
    tags: ['Next.js', 'TypeScript', 'Lit', 'MUI', 'Node.js', 'Vite', 'Turborepo', 'Docker', 'AWS'],
    title: 'Saasの新規開発',
  },
  {
    description: 'フロントエンド領域のリードエンジニア',
    label: '2022 — 2023',
    tags: ['Next.js', 'TypeScript', 'MUI', 'Node.js', 'GraphQL', 'Turborepo', 'Vercel', 'AWS'],
    title: 'BtoC向け新規サービスのプロトタイプ開発',
  },
  {
    description: 'フロントエンドチームのリードエンジニア',
    label: '2016 — 2022',
    tags: ['JavaScript', 'Sass', 'jQuery', 'Node.js', 'React', 'Vue.js', 'Gulp', 'Webpack'],
    title: 'HRサービスの開発',
  },
  {
    description: '制作及び開発、保守、運用',
    label: '2012 — 2016',
    tags: ['JavaScript', 'Sass', 'jQuery', 'Angular', 'Node.js', 'PHP', 'WordPress', 'MySQL', 'Gulp'],
    title: 'Web制作/開発',
  },
];

const outputData = [
  {
    description: 'ポートフォリオサイト',
    label: 'Github',
    link: 'https://github.com/daisuke-tanabe/daisuke-tanabe',
    tags: ['Next.js', 'TypeScript', 'shadcn/ui', 'Node.js', 'Turborepo', 'Docker', 'AWS'],
    title: 'daisuke-tanabe',
  },
  {
    description: 'ポリモーフィックコンポーネント',
    label: 'Github',
    link: 'https://github.com/daisuke-tanabe/as-props-polymorphic-component',
    tags: ['React.js', 'TypeScript'],
    title: 'as-props-polymorphic-component',
  },
  {
    description: 'Githubのコントリビューションの可視化',
    label: 'Github',
    link: 'https://github.com/daisuke-tanabe/github-contributions-visualization',
    tags: ['React.js', 'TypeScript', 'Obelisk.js'],
    title: 'github-contributions-visualization',
  },
];

export default function HomePage() {
  return (
    <BlockSectionGroup>
      <BlockSection>
        <BlockSectionTitle>About</BlockSectionTitle>
        <LeadText>
          私はフロントエンド領域を中心にWebサービスの開発・設計・運用に携わっているエンジニアです。シンプルでクリーンなコードとベストプラクティスを重視し、継続的なシステム改善に取り組んでいます。
        </LeadText>
      </BlockSection>

      <BlockSection>
        <BlockSectionTitle>Work Experience</BlockSectionTitle>
        <EntryList>
          {workExperienceData.map(({ description, label, tags, title }, index) => (
            <EntryListItem key={index} description={description} label={label} tags={tags} title={title} />
          ))}
        </EntryList>
      </BlockSection>

      <BlockSection>
        <BlockSectionTitle>Output</BlockSectionTitle>
        <EntryList>
          {outputData.map(({ description, label, link, tags, title }, index) => (
            <EntryListItem key={index} description={description} link={link} label={label} tags={tags} title={title} />
          ))}
        </EntryList>
      </BlockSection>
    </BlockSectionGroup>
  );
}
