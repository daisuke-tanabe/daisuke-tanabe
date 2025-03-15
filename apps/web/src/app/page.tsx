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

export default async function Home() {
  const data = await fetchGitHubGraphQL(
    // `query userInfo($username: String!) {
    //   user(login: $username) {
    //     createdAt
    //     contributionsCollection {
    //       totalCommitContributions
    //       restrictedContributionsCount
    //       totalPullRequestReviewContributions
    //     }
    //     organizations(first: 1) {
    //       totalCount
    //     }
    //     followers(first: 1) {
    //       totalCount
    //     }
    //   }
    // }`
    // `    //   query($username:String!) {    //     user(login: $username){    //       contributionsCollection {    //         totalCommitContributions,    //         restrictedContributionsCount,    //         totalPullRequestReviewContributions,    //         contributionCalendar {    //           totalContributions    //         }    //       }    //     }    //   }    // `
    // `    //   query($username:String!) {    //     user(login: $username){    //       contributionsCollection {    //         totalCommitContributions    //       }    //     }    //   }    // `
    `query($username:String!) {
      user(login: $username) {
        contributionsCollection {
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
      username: 'daisuke-tanabe'
    });

  // console.dir(data.user.contributionsCollection.totalCommitContributions);
  // console.dir(data.user.contributionsCollection.contributionCalendar.weeks, { depth: null });
  // console.log(data.user.contributionsCollection.contributionCalendar);
  // const result = data.user.contributionsCollection.contributionCalendar.weeks.map(({ contributionDays }) => {  //   return contributionDays;  // });
  // const result = data.user.contributionsCollection.contributionCalendar.weeks.flatMap(({ contributionDays }) => {
  //   return contributionDays;
  // });
  // console.log(result);

  // console.log(data.user.contributionsCollection.contributionCalendar)

  const result = data.user.contributionsCollection.contributionCalendar.weeks.map(({ contributionDays }) => contributionDays);
  // console.log(result);

  return <Page data={result} />;
}
