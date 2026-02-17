import { BlockSection, BlockSectionTitle, EntryList, EntryListItem } from '@/app/_components';

type ProjectsResponse = {
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

export async function Projects() {
  const response = await fetch('https://daisuke-tanabe.microcms.io/api/v1/projects', {
    headers: {
      'X-MICROCMS-API-KEY': process.env.X_MICROCMS_API_KEY,
    },
    next: { revalidate: 3600 },
  });
  const { contents: projects } = (await response.json()) as ProjectsResponse;

  return (
    <BlockSection>
      <BlockSectionTitle>Projects</BlockSectionTitle>
      <EntryList>
        {projects.map(({ description, startYear, endYear, skills, title, id }) => (
          <EntryListItem key={id} description={description} label={`${startYear} — ${endYear}`} tags={skills} title={title} />
        ))}
      </EntryList>
    </BlockSection>
  );
}
