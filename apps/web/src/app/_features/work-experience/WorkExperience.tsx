import { BlockSection, BlockSectionTitle, EntryList, EntryListItem } from '@/app/_components';

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

export async function WorkExperience() {
  const response = await fetch('https://daisuke-tanabe.microcms.io/api/v1/projects', {
    headers: {
      'X-MICROCMS-API-KEY': process.env.X_MICROCMS_API_KEY,
    },
  });
  const { contents: works } = (await response.json()) as WorksResponse;

  return (
    <BlockSection>
      <BlockSectionTitle>Work Experience</BlockSectionTitle>
      <EntryList>
        {works.map(({ description, startYear, endYear, skills, title, id }) => (
          <EntryListItem key={id} description={description} label={`${startYear} — ${endYear}`} tags={skills} title={title} />
        ))}
      </EntryList>
    </BlockSection>
  );
}
