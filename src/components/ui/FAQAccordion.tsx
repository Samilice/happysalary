"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FAQItem[];
  className?: string;
};

export function FAQAccordion({ items, className }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={cn(
              "rounded-xl border transition-all duration-200",
              isOpen
                ? "border-primary/30 bg-primary/5 shadow-sm"
                : "border-border bg-surface hover:border-primary/20"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
            >
              <span className="font-semibold text-secondary pr-4">
                {item.question}
              </span>
              <svg
                className={cn(
                  "w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-200",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <p className="px-5 pb-5 text-text-muted leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
