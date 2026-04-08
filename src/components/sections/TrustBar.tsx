import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

const partners = [
  { name: "AVS/AHV", icon: "AVS", color: "text-primary" },
  { name: "SUVA", icon: "SUVA", color: "text-secondary" },
  { name: "SSL Secure", icon: "SSL", color: "text-success" },
  { name: "Swiss Made", icon: "CH", color: "text-red-500" },
  { name: "26 Cantons", icon: "26", color: "text-primary" },
];

export function TrustBar() {
  const t = useTranslations("home.trustBar");

  return (
    <section className="py-6 sm:py-8 border-y border-border bg-white">
      <Container>
        <p className="text-center text-xs sm:text-sm font-medium text-text-muted mb-4 sm:mb-6">
          {t("title")}
        </p>
        <div className="flex items-center justify-center gap-3 sm:gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-background-alt border border-border flex items-center justify-center">
                <span className={`text-[10px] sm:text-xs font-bold ${partner.color}`}>{partner.icon}</span>
              </div>
              <span className="text-[9px] sm:text-sm font-medium text-text-muted hidden sm:block">{partner.name}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
