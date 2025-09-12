import { cva } from "class-variance-authority";

// Enhanced button variants for the college theme
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 smooth-transition",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground smooth-transition",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 smooth-transition",
        ghost: "hover:bg-accent hover:text-accent-foreground smooth-transition",
        link: "text-primary underline-offset-4 hover:underline",
        // Enhanced college-themed variants
        gold: "bg-gradient-gold text-primary hover:shadow-glow hover:scale-105 smooth-transition elegant-shadow",
        hero: "bg-gradient-hero text-white hover:shadow-elegant hover:scale-105 smooth-transition border border-white/20",
        academic: "bg-gradient-academic text-white hover:shadow-card hover:scale-105 smooth-transition",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-105 smooth-transition",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariant = NonNullable<Parameters<typeof buttonVariants>[0]>["variant"];
export type ButtonSize = NonNullable<Parameters<typeof buttonVariants>[0]>["size"];