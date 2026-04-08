import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

export function LifestripeBanner({ src, alt }: Props) {
  return (
    <section className="relative h-32 sm:h-48 md:h-64 lg:h-80 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/10" />
    </section>
  );
}
