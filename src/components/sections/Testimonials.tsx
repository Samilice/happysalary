import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TESTIMONIALS } from "@/lib/constants";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-accent" : "text-border"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, tt }: { testimonial: typeof TESTIMONIALS[number]; tt: ReturnType<typeof useTranslations> }) {
  return (
    <Card className="h-full flex flex-col" hover={false}>
      <StarRating rating={testimonial.rating} />
      <p className="mt-3 text-text-muted text-sm leading-relaxed flex-1 italic">
        &ldquo;{tt(`${testimonial.nameKey}.text`)}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3 pt-3 border-t border-border">
        <Image
          src={testimonial.image}
          alt={tt(`${testimonial.nameKey}.name`)}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-text">
            {tt(`${testimonial.nameKey}.name`)}
          </p>
          <p className="text-xs text-text-muted">
            {tt(`roles.${testimonial.role}`)} &middot; {testimonial.location}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function Testimonials() {
  const t = useTranslations("home.testimonials");
  const tt = useTranslations("testimonials");

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        {/* Mobile: horizontal carousel */}
        <div className="sm:hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="min-w-[280px] max-w-[300px] snap-center flex-shrink-0">
                <TestimonialCard testimonial={testimonial} tt={tt} />
              </div>
            ))}
          </div>
          {/* Scroll indicator dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="w-1.5 h-1.5 rounded-full bg-border" />
            ))}
          </div>
        </div>

        {/* Tablet+: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <ScrollReveal key={testimonial.id} delay={idx * 100}>
              <TestimonialCard testimonial={testimonial} tt={tt} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
