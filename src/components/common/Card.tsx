import { HTMLAttributes, ReactNode, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "interactive" | "subtle";
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, variant = "default", className = "", ...rest },
  ref
) {
  const variantClass =
    variant === "interactive"
      ? "card cursor-pointer hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-all duration-200"
      : variant === "subtle"
      ? "rounded-xl border border-zinc-250/70 dark:border-white/[0.05] bg-zinc-50/70 dark:bg-[#11131b]/60 transition-colors"
      : "card";

  return (
    <div ref={ref} className={`${variantClass} ${className}`} {...rest}>
      {children}
    </div>
  );
});

export default Card;
