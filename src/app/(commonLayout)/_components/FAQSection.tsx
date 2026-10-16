"use client";

import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I launch my product on DevHuntr?",
    answer: "Launching is simple! Create an account, click 'Launch App', and fill in your product details. Your product will go through a quick moderation check to ensure it meets our community guidelines before going live.",
  },
  {
    question: "Is DevHuntr free for indie makers?",
    answer: "Yes, DevHuntr is 100% free for community members to launch and discover products. We also offer a Premium tier for advanced features, but the core launch experience is always free.",
  },
  {
    question: "How does the voting system work?",
    answer: "The community can upvote products they find valuable. Trending products are calculated based on upvotes, recency, and community engagement. This ensures that the most relevant tools stay at the top.",
  },
  {
    question: "Can I edit my product after launching?",
    answer: "Absolutely! You can update your product's description, images, and external links at any time from your Creator Dashboard.",
  },
  {
    question: "What kind of products can I submit?",
    answer: "We welcome developer tools, AI applications, SaaS platforms, open-source libraries, and anything technically creative built by developers, for developers.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative z-10 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-14 gap-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" /> Support Centre
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Common Questions
          </h2>
          <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
            Everything you need to know about DevHuntr and how to make the most of your launch.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-content-${idx}`;

            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl border transition-all duration-300",
                  isOpen
                    ? "bg-card border-primary/40 shadow-sm"
                    : "bg-card/50 border-border hover:border-border/80 hover:bg-card"
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group gap-4 cursor-pointer"
                >
                  <span
                    className={cn(
                      "text-base font-semibold tracking-tight transition-colors",
                      isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 border shrink-0",
                      isOpen
                        ? "bg-primary border-primary text-primary-foreground rotate-180 shadow-xs"
                        : "bg-muted border-border text-muted-foreground"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <div
                  id={contentId}
                  role="region"
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-6 pb-5 pt-1 text-muted-foreground leading-relaxed text-sm border-t border-border/50 mt-1">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
