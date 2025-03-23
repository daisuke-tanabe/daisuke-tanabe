import { ArrowUpRight } from 'lucide-react';

const workExperienceData = [
  {
    label: 'Saasの新規開発',
    summary: 'フロントエンド領域のリードエンジニア',
    type: '2023 — Now',
    tags: ['Next.js', 'TypeScript', 'Lit', 'MUI', 'Node.js', 'Vite', 'Turborepo', 'Docker', 'AWS'],
  },
  {
    label: 'BtoC向け新規サービスのプロトタイプ開発',
    summary: 'フロントエンド領域のリードエンジニア',
    type: '2022 — 2023',
    tags: ['Next.js', 'TypeScript', 'MUI', 'Node.js', 'GraphQL', 'Turborepo', 'Vercel', 'AWS'],
  },
  {
    label: 'HRサービスの開発',
    summary: 'フロントエンドチームのリードエンジニア',
    type: '2016 — 2022',
    tags: ['JavaScript', 'Sass', 'jQuery', 'Node.js', 'React', 'Vue.js', 'Gulp', 'Webpack'],
  },
  {
    label: 'Web制作/開発',
    summary: '制作及び開発、保守、運用',
    type: '2012 — 2016',
    tags: ['JavaScript', 'Sass', 'jQuery', 'Angular', 'Node.js', 'PHP', 'WordPress', 'MySQL', 'Gulp'],
  },
];

const outputData = [
  {
    label: 'daisuke-tanabe',
    summary: 'ポートフォリオサイト',
    externalLink: 'https://github.com/daisuke-tanabe/daisuke-tanabe',
    type: 'Github',
    tags: ['Next.js', 'TypeScript', 'shadcn/ui', 'Node.js', 'Turborepo', 'Docker', 'AWS'],
  },
  {
    label: 'as-props-polymorphic-component',
    summary: 'ポリモーフィックコンポーネント',
    externalLink: 'https://github.com/daisuke-tanabe/as-props-polymorphic-component',
    type: 'Github',
    tags: ['React.js', 'TypeScript'],
  },
  {
    label: 'github-contributions-visualization',
    summary: 'Githubのコントリビューションの可視化',
    externalLink: 'https://github.com/daisuke-tanabe/github-contributions-visualization',
    type: 'Github',
    tags: ['React.js', 'TypeScript', 'Obelisk.js'],
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-15">
      <section>
        <h2 className="text-sm leading-[1.6] mb-7">About</h2>
        <p className="text-sm leading-[1.8]">
          私はフロントエンド領域を中心にWebサービスの開発・設計・運用に携わっているエンジニアです。シンプルでクリーンなコードとベストプラクティスを重視し、継続的なシステム改善に取り組んでいます。
        </p>
      </section>

      <section>
        <h2 className="text-sm leading-[1.6] mb-7">Work Experience</h2>
        <div className="grid gap-6">
          {workExperienceData.map(({ label, summary, type, tags }, index) => (
            <div key={index} className="flex gap-6">
              <div className="shrink-0 text-sm w-[6.5em]">
                <span className="font-light text-muted-foreground leading-[1.6]">{type}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm leading-[1.6]">{label}</p>
                <p className="text-sm text-muted-foreground leading-[1.6]">{summary}</p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {tags.map((tag, index) => {
                      return (
                        <div
                          key={index}
                          className="font-light inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm leading-[1.6] mb-7">Output</h2>
        <div className="grid gap-6">
          {outputData.map(({ label, summary, externalLink, type, tags }, index) => (
            <div key={index} className="flex gap-6">
              <div className="shrink-0 text-sm w-[6em]">
                <span className="font-light text-muted-foreground leading-[1.6]">{type}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <a
                  href={externalLink}
                  target="_blank"
                  className="inline-flex items-center text-sm leading-[1.6] hover:underline"
                >
                  {label}
                  <ArrowUpRight className="h-[14px] w-[14px] ml-0.5" />
                </a>
                <p className="text-sm text-muted-foreground leading-[1.6]">{summary}</p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {tags.map((tag, index) => {
                      return (
                        <div
                          key={index}
                          className="font-light inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
