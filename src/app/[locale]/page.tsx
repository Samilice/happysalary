import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { Testimonials } from "@/components/sections/Testimonials";
import { PricingSection } from "@/components/sections/PricingSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { LifestripeBanner } from "@/components/sections/LifestripeBanner";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustBar />
      <FeatureGrid />
      <LifestripeBanner src="/images/lifestyle/desk.webp" alt="Modern workspace" />
      <HowItWorks />
      <LifestripeBanner src="/images/lifestyle/couple.webp" alt="Swiss couple reviewing documents" />
      <ComparisonTable />
      <StatsCounter />
      <Testimonials />
      <LifestripeBanner src="/images/lifestyle/woman-phone.webp" alt="Happy customer" />
      <PricingSection />
      <CTABanner />
    </>
  );
}
