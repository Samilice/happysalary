import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ServiceLanding } from "@/components/landing/ServiceLanding";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.gardener" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function GardenerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ServiceLanding namespace="services.gardener" badge="Service" image="/images/use-cases/gardener.webp" imageAlt="Jardinier en Suisse" />;
}
