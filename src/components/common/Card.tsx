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
      ? "card cursor-pointer hover:border-[var(--accent)] transition-all duration-200"
      : variant === "subtle"
      ? "rounded-[10px] border border-[var(--border)] bg-[var(--surface)] transition-colors"
      : "card";

  return (
    <div ref={ref} className={`${variantClass} ${className}`} {...rest}>
      {children}
    </div>
  );
});

export default Card;
