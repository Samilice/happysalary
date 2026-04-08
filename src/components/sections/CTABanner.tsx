import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function CTABanner() {
  const t = useTranslations("home.cta");

  return (
    <section className="py-12 sm:py-20 lg:py-28">
      <Container>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-secondary-light p-10 lg:p-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold text-white max-w-2xl mx-auto">
                {t("title")}
              </h2>
              <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
                {t("subtitle")}
              </p>
              <div className="mt-8">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl font-semibold px-8 py-4 text-lg bg-white text-secondary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-200"
                >
                  {t("button")}
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
