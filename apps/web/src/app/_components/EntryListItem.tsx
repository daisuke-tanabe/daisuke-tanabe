import { ArrowUpRight } from 'lucide-react';

export type EntryListItemProps = {
  description: string;
  label: string;
  link?: string;
  tags?: string[];
  title: string;
};

export function EntryListItem({ description, link, label, tags, title }: EntryListItemProps) {
  return (
    <li className="flex gap-3 sm:gap-6">
      <div className="shrink-0 text-sm w-[6.5em]">
        <span className="font-light text-muted-foreground leading-[1.6]">{label}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {link ? (
          <a href={link} target="_blank" className="inline-flex items-center text-sm leading-[1.6] hover:underline">
            {title}
            <ArrowUpRight className="h-[14px] w-[14px] ml-0.5" />
          </a>
        ) : (
          <p className="text-sm leading-[1.6]">{title}</p>
        )}
        <p className="text-sm text-muted-foreground leading-[1.6]">{description}</p>
        {tags && tags?.length > 0 && (
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
    </li>
  );
}
