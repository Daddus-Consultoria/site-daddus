import { VariantProps, cva } from "class-variance-authority";

export const badge = cva(
  [
    "flex",
    "flex-col",
    "justify-center",
    "items-center",
    "py-1.5",
    "px-6",
    "rounded-2xl",
    "text-sm",
  ],
  {
    variants: {
      first: {
        true: "lg:text-base",
        false: "lg:text-sm",
      },
      colorScheme: {
        primary: "bg-primary",
        secondary: "bg-[#999999]",
      },
    },
    defaultVariants: {
      colorScheme: "primary",
      first: false,
    },
  }
);
