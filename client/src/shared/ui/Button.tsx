import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

type ButtonProps = ComponentProps<"button">;

export const Button = ({ className, ...props }: ButtonProps) => (
  <button
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md bg-slate-600 px-4 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400",
      className
    )}
    {...props}
  />
);
