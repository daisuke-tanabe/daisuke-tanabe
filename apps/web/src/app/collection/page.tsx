import { BlockSection, BlockSectionGroup, BlockSectionTitle, EntryList, EntryListItem } from '@/app/_components';

const collectionData = [
  {
    description: '2007年に製造されたハカランダネックの初代モダンイーグル',
    label: 'Guitar',
    title: 'PRS / Modern Eagle',
  },
  {
    description: '2018年春ディバイザースペシャルモデルのテレキャスター',
    label: 'Guitar',
    title: 'Momose / MT-SAKURA-SP18',
  },
  {
    description: 'レリック加工されたストラトキャスター',
    label: 'Guitar',
    title: 'Red House Guitars / Piccola S',
  },
];

export default function CollectionPage() {
  return (
    <BlockSectionGroup>
      <BlockSection>
        <BlockSectionTitle>My Gear</BlockSectionTitle>
        <EntryList>
          {collectionData.map(({ description, label, title }, index) => (
            <EntryListItem key={index} description={description} label={label} title={title} />
          ))}
        </EntryList>
      </BlockSection>
    </BlockSectionGroup>
  );
}
