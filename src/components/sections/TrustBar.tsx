import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

const partners = [
  { name: "AVS/AHV", icon: "AVS" },
  { name: "SUVA", icon: "SUVA" },
  { name: "SSL Secure", icon: "SSL" },
  { name: "Swiss Made", icon: "CH" },
  { name: "26 Cantons", icon: "26" },
];

export function TrustBar() {
  const t = useTranslations("home.trustBar");

  return (
    <section className="py-8 border-y border-border bg-white">
      <Container>
        <p className="text-center text-sm font-medium text-text-muted mb-6">
          {t("title")}
        </p>
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 text-text-light hover:text-text-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-border-light flex items-center justify-center">
                <span className="text-xs font-bold">{partner.icon}</span>
              </div>
              <span className="text-sm font-medium hidden sm:block">{partner.name}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
