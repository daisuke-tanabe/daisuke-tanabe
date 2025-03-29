import { ArrowUpRight } from 'lucide-react';
import NextLink from 'next/link';

export type EntryListItemProps = {
  description: string;
  label?: string;
  link?: string;
  tags?: string[];
  title: string;
};

export function EntryListItem({ description, link, label, tags, title }: EntryListItemProps) {
  const hasProtocol = link?.startsWith('https://');
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const LinkComponent = hasProtocol ? 'a' : NextLink;
  const target = hasProtocol ? '_blank' : undefined;

  return (
    <li className="flex gap-3 sm:gap-6">
      <div className="shrink-0 text-sm w-[6.5em]">
        <span className="inline-flex font-light text-muted-foreground leading-[1.6]">{label}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {link ? (
          <LinkComponent
            href={link}
            target={target}
            className="inline-flex items-center text-sm leading-[1.6] hover:underline"
          >
            {title}
            {hasProtocol && <ArrowUpRight className="h-[14px] w-[14px] ml-0.5" />}
          </LinkComponent>
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
