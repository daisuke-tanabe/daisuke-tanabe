import {
  BlockSection,
  BlockSectionGroup,
  BlockSectionTitle,
  EntryList,
  EntryListItem,
  LeadText,
} from '@/app/_components';

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

type WorksResponse = {
  contents: {
    createdAt: string;
    description: string;
    endYear: string;
    id: string;
    publishedAt: string;
    revisedAt: string;
    skills: string[];
    startYear: string;
    title: string;
    updatedAt: string;
  }[];
  limit: number;
  offset: number;
  totalCount: number;
};

export default async function Page() {
  const response = await fetch('https://daisuke-tanabe.microcms.io/api/v1/works', {
    headers: {
      'X-MICROCMS-API-KEY': process.env.X_MICROCMS_API_KEY,
    },
  });
  const { contents: works } = (await response.json()) as WorksResponse;

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
          {works.map(({ description, startYear, endYear, skills, title, id }) => (
            <EntryListItem key={id} description={description} label={`${startYear} — ${endYear}`} tags={skills} title={title} />
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
