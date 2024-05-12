import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const linkVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        tag: "text-primary underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        link: "",
        sm: "h-9 px-3",
        lg: "h-11  px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

import Link from "next/link";

interface DaddusLinkProps
  extends React.LinkHTMLAttributes<HTMLLinkElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  children: React.ReactNode;
  download?: string;
  target?: string;
  isTagAnchor?: boolean;
}

const DaddusLink = React.forwardRef<HTMLAnchorElement, DaddusLinkProps>(
  (
    { href, children, variant, className, download, size, isTagAnchor, target },
    ref
  ) => {
    const Comp = isTagAnchor ? "a" : Link;
    return (
      <Comp
        target={target}
        ref={ref}
        download={download}
        className={cn(linkVariants({ variant, className, size }))}
        href={href}
      >
        {children}
      </Comp>
    );
  }
);

DaddusLink.displayName = "DaddusLink";

export { DaddusLink };
