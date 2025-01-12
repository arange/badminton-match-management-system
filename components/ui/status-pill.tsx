import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const pillVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white border-transparent cursor-default',
  {
    variants: {
      variant: {
        PLANNED:
          'bg-blue-500 hover:bg-blue-600',
        BOOKED:
          'bg-orange-500 hover:bg-orange-600',
        FINISHED:
          'bg-gray-500 hover:bg-gray-600',
        CANCELLED:
          'bg-red-500 hover:bg-red-600'
      }
    },
    defaultVariants: {
      variant: 'PLANNED'
    }
  }
);

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillVariants> {}

function StatusPill({ className, variant, ...props }: StatusPillProps) {
  return (
    <div className={cn(pillVariants({ variant }), className)} {...props} />
  );
}

export { StatusPill, pillVariants };
