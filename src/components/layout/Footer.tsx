import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SITE_NAME, SERVICE_PAGES, FEATURE_PAGES } from "@/lib/constants";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const tf = useTranslations("features");

  return (
    <footer className="bg-secondary text-white">
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo-white.png"
                alt="HappySalary"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <span className="text-xl font-bold">
                Happy<span className="text-primary">Salary</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">{t("description")}</p>
            <div className="mt-6 flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                <svg className="w-4 h-4 text-primary" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M1 16h7.5v-5h15v5H31V6H1v10zm0 10h30V18H1v8zM16 0l3 6H13l3-6z" />
                </svg>
                <span className="text-xs font-medium text-white/90">{tc("swissMade")}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">
              {t("services")}
            </h3>
            <ul className="space-y-3">
              {SERVICE_PAGES.map((page) => (
                <li key={page.key}>
                  <Link
                    href={page.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {tn(page.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">
              {t("features")}
            </h3>
            <ul className="space-y-3">
              {FEATURE_PAGES.map((page) => (
                <li key={page.key}>
                  <Link
                    href={page.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {tf(`${page.key}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">
              {t("company")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">
                  {tn("about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">
                  {tn("contact")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-white/70 hover:text-white transition-colors">
                  {tn("faq")}
                </Link>
              </li>
            </ul>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4 mt-8">
              {t("legal")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/legal/impressum" className="text-sm text-white/70 hover:text-white transition-colors">
                  {t("impressum")}
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm text-white/70 hover:text-white transition-colors">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-sm text-white/70 hover:text-white transition-colors">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} {SITE_NAME}. {tc("allRightsReserved")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
