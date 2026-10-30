import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

const glass =
  'border-[color:var(--glass-border)] bg-[var(--glass-2)] text-foreground ' +
  'backdrop-blur-[var(--blur-1)] backdrop-saturate-150 ' +
  'shadow-[inset_0_1px_0_var(--glass-highlight),var(--glass-shadow)] ' +
  'hover:border-[color:var(--glass-border-strong)] ' +
  'hover:bg-[color-mix(in_srgb,var(--glass-2),var(--text)_8%)]';

const glassStrong =
  'border-[color:color-mix(in_srgb,var(--primary)_40%,transparent)] ' +
  'bg-[color-mix(in_srgb,var(--primary)_22%,transparent)] text-foreground ' +
  'backdrop-blur-[var(--blur-1)] backdrop-saturate-150 ' +
  'shadow-[inset_0_1px_0_var(--glass-highlight),var(--glass-shadow)] ' +
  'hover:border-[color:color-mix(in_srgb,var(--primary)_60%,transparent)] ' +
  'hover:bg-[color-mix(in_srgb,var(--primary)_32%,transparent)]';


export const buttonVariants = cva(
  mergeClasses(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      zType: {
        default: glassStrong,
        destructive:
          'bg-destructive/15 text-destructive backdrop-blur-[var(--blur-1)] hover:bg-destructive/25 ' +
          'border-destructive/30 focus-visible:border-destructive/40 focus-visible:ring-destructive/20',
        outline:
          glass + ' bg-transparent aria-expanded:bg-[var(--glass-2)]',
        secondary: glass + ' aria-expanded:bg-[var(--glass-2)]',
        ghost:
          'hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      zSize: {
        default: 'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
      zShape: {
        default: 'rounded-md',
        circle: 'rounded-full',
        square: 'rounded-none',
      },
      zLoading: {
        true: 'pointer-events-none opacity-50',
      },
      zDisabled: {
        true: 'pointer-events-none opacity-50',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
      zShape: 'default',
    },
  },
);
export type ZardButtonShapeVariants = NonNullable<VariantProps<typeof buttonVariants>['zShape']>;
export type ZardButtonSizeVariants = NonNullable<VariantProps<typeof buttonVariants>['zSize']>;
export type ZardButtonTypeVariants = NonNullable<VariantProps<typeof buttonVariants>['zType']>;
