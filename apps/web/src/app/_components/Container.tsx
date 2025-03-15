import { cn } from "@workspace/ui/lib/utils"
import { PropsWithChildren} from 'react';

export type ContainerProps = PropsWithChildren<{
  className?: string;
}>

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn('grid max-w-3xl mx-auto px-8 w-full', className)}>
      {children}
    </div>
  );
}
