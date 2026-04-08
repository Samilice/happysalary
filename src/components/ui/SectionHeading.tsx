import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
};

export function SectionHeading({ title, subtitle, centered = true, className }: Props) {
  return (
    <div className={cn("mb-12 lg:mb-16", centered && "text-center", className)}>
      <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-text-muted max-w-3xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
