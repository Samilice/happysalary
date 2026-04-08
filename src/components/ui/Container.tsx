import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

export function Container({ children, className, as: Component = "div" }: Props) {
  return (
    <Component className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Component>
  );
}
