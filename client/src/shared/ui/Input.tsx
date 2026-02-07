import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

type InputProps = ComponentProps<"input">;

export const Input = ({ className, ...props }: InputProps) => (
  <input
    className={cn(
      "h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none",
      className
    )}
    {...props}
  />
);
