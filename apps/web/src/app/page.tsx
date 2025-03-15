import { Page } from '@/app/_page';

async function fetchGitHubGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';
  const TOKEN = process.env.GIITHUB_PERSONAL_TOKEN;

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  if (json.errors) {
    console.error('GitHub GraphQL API Error:', json.errors);
    throw new Error('Failed to fetch GitHub GraphQL API');
  }

  return json.data;
}

function getYearStartAndEnd(year) {
  // 1月1日
  const startDate = new Date(year, 0, 1);
  // 12月31日
  const endDate = new Date(year, 11, 31);

  return { startDate, endDate };
}

export default async function Home() {
  const fullYear = new Date().getFullYear();
  const { startDate, endDate } = getYearStartAndEnd(fullYear);

  const data = await fetchGitHubGraphQL(
    `query($username:String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection (from: $from, to: $to){
          totalCommitContributions,
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                color
                contributionCount
                date
              }
            }
          }
        }
      }
    }`, {
      username: 'daisuke-tanabe',
      from: startDate,
      to: endDate
    });

  const result = data.user.contributionsCollection.contributionCalendar.weeks.map(({ contributionDays }) => contributionDays);

  console.log(data.user.contributionsCollection.contributionCalendar.totalContributions)

  return (
    <Page
      data={result}
      startDate={startDate}
      endDate={endDate}
      fullYear={fullYear}
      totalContributions={data.user.contributionsCollection.contributionCalendar.totalContributions}
    />
  );
}
