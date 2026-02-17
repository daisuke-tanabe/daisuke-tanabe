import { BlockSection, BlockSectionTitle, EntryList, EntryListItem } from '@/app/_components';

type WorksResponse = {
  contents: {
    createdAt: string;
    description: string;
    id: string;
    label: string;
    publishedAt: string;
    revisedAt: string;
    title: string;
    titleLink: string;
    updatedAt: string;
  }[];
  limit: number;
  offset: number;
  totalCount: number;
};

export async function Works() {
  const response = await fetch('https://daisuke-tanabe.microcms.io/api/v1/works', {
    headers: {
      'X-MICROCMS-API-KEY': process.env.X_MICROCMS_API_KEY,
    },
    next: { revalidate: 3600 },
  });
  const { contents: works } = (await response.json()) as WorksResponse;

  return (
    <BlockSection>
      <BlockSectionTitle>Works</BlockSectionTitle>
      <EntryList>
        {works.map(({ description, label, titleLink, title }, index) => (
          <EntryListItem key={index} description={description} link={titleLink} label={label} title={title} />
        ))}
      </EntryList>
    </BlockSection>
  );
}
