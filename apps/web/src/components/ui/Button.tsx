"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import {
  resolveButtonVariant,
  type ButtonVariant,
} from "@/components/ui/buttonStyles";

export { buttonProps, type ButtonVariant } from "@/components/ui/buttonStyles";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, className, style, type = "button", ...props },
  ref,
) {
  const v = resolveButtonVariant(variant);
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "touch-manipulation transform-gpu backface-hidden",
        // Press: translateY + shorter shadow — transform does not reflow layout.
        v.className,
        className,
      )}
      style={{ ...v.style, ...style }}
      {...props}
    />
  );
});
