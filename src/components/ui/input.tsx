import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "lined";
}

const inputVariants = cva(
  "flex h-9 w-fit bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-md border border-input focus-visible:ring-1 focus-visible:ring-ring",
        lined: "border-b focus-visible:border-ring",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant }), className)} // Merge className last
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
