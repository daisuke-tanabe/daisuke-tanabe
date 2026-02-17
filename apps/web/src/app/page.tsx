import { BlockSection, BlockSectionGroup, BlockSectionTitle, LeadText } from '@/app/_components';
import { Projects } from '@/app/_features/projects';
import { Works } from '@/app/_features/works';

export default function Page() {
  return (
    <BlockSectionGroup>
      <BlockSection>
        <BlockSectionTitle>About</BlockSectionTitle>
        <LeadText>
          私はフロントエンド領域を中心にWebサービスの開発・設計・運用に携わっているエンジニアです。シンプルでクリーンなコードとベストプラクティスを重視し、継続的なシステム改善に取り組んでいます。
        </LeadText>
      </BlockSection>

      <Projects />

      <Works />
    </BlockSectionGroup>
  );
}
