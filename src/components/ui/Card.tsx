import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className, hover = true }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface border border-border p-6 lg:p-8",
        hover && "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20",
        className
      )}
    >
      {children}
    </div>
  );
}
