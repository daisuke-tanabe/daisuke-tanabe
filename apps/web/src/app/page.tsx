import {
  BlockSection,
  BlockSectionGroup,
  BlockSectionTitle,
  EntryList,
  EntryListItem,
  LeadText,
} from '@/app/_components';
import { WorkExperience } from '@/app/_features/work-experience';

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

export default function Page() {
  return (
    <BlockSectionGroup>
      <BlockSection>
        <BlockSectionTitle>About</BlockSectionTitle>
        <LeadText>
          私はフロントエンド領域を中心にWebサービスの開発・設計・運用に携わっているエンジニアです。シンプルでクリーンなコードとベストプラクティスを重視し、継続的なシステム改善に取り組んでいます。
        </LeadText>
      </BlockSection>

      <WorkExperience />

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
