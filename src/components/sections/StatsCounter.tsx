"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { STATS } from "@/lib/constants";

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-bold text-white">
        {count.toLocaleString("de-CH")}
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="mt-2 text-white/70 text-sm font-medium">{label}</p>
    </div>
  );
}

export function StatsCounter() {
  const t = useTranslations("home.stats");

  const stats = [
    { value: STATS.householdsWithEmployees, suffix: "+", label: t("households") },
    { value: STATS.undeclaredPercent, suffix: "%", label: t("undeclared") },
    { value: STATS.savingsPercent, suffix: "%", label: t("savings") },
    { value: STATS.cantonsCovered, suffix: "", label: t("cantons") },
  ];

  return (
    <section className="py-20 bg-secondary">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
