"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <section
            key={item.id}
            className="overflow-hidden rounded-2xl border border-border/70 bg-surface"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-foreground">
                {item.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen ? (
              <div className="border-t border-border/70 px-5 py-4 text-sm leading-7 text-muted-foreground">
                {item.answer}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
