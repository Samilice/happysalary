import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
};

function BrandTitle({ text }: { text: string }) {
  // Color "HappySalary" with brand colors wherever it appears
  if (text.includes("HappySalary")) {
    const parts = text.split("HappySalary");
    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <>Happy<span className="text-primary">Salary</span></>
            )}
          </span>
        ))}
      </>
    );
  }
  return <>{text}</>;
}

export function SectionHeading({ title, subtitle, centered = true, className }: Props) {
  return (
    <div className={cn("mb-8 sm:mb-12 lg:mb-16", centered && "text-center", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl lg:text-4xl xl:text-5xl">
        <BrandTitle text={title} />
      </h2>
      {subtitle && (
        <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-text-muted max-w-3xl mx-auto">
          {subtitle?.includes("HappySalary") ? <BrandTitle text={subtitle} /> : subtitle}
        </p>
      )}
    </div>
  );
}
