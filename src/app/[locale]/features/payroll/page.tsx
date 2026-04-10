import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ServiceLanding } from "@/components/landing/ServiceLanding";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "features.payroll" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function PayrollPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ServiceLanding namespace="features.payroll" badge="Feature" />;
}
