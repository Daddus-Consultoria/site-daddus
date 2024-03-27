import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-10 w-full px-3 py-2 text-sm ring-offset-background focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 !outline-none",
        underline: "border-b border-input",
      },
      iconVariant: {
        default: "",
        trailingIcon: "pr-10",
      },
    },

    defaultVariants: {
      variant: "default",
      iconVariant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  trailingIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, trailingIcon, iconVariant, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          type={type}
          className={cn(inputVariants({ variant, className, iconVariant }))}
          ref={ref}
          {...props}
        />
        {trailingIcon && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {trailingIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
