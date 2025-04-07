'use client';

import { format } from '@formkit/tempo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
  publishedAt: string;
  title: string;
};

export function Page({ children, publishedAt, title }: PageProps) {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className=" text-muted-foreground text-sm">
            <time dateTime="createdAt">
              {format({
                date: publishedAt,
                format: 'full',
                tz: 'Asia/Tokyo',
                locale: 'en',
              })}
            </time>
          </p>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
