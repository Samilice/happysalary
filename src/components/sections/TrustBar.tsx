import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

export function TrustBar() {
  const t = useTranslations("home.trustBar");

  return (
    <section className="py-6 sm:py-8 border-y border-border bg-white">
      <Container>
        <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-10 flex-wrap">
          {/* Lock - secure data */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-text-muted">{t("secure")}</span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-border" />

          {/* No commission */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-text-muted">{t("noCommission")}</span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-border" />

          {/* 26 cantons */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-text-muted">{t("cantons")}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
