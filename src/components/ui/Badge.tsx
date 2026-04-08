import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "success";
  className?: string;
};

const variants = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent-dark",
  success: "bg-success/10 text-success",
};

export function Badge({ children, variant = "primary", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
