"use client";

import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I launch my product on DevHuntr?",
    answer: "Launching is simple! Create an account, click 'Submit App', and fill in your product details. Your product will go through a quick moderation check to ensure it meets our community guidelines before going live.",
  },
  {
    question: "Is DevHuntr free for indie makers?",
    answer: "Yes, DevHuntr is 100% free for community members to launch and discover products. We also offer a Premium tier for advanced analytics and enhanced visibility, but the core experience will always remain free.",
  },
  {
    question: "How does the voting system work?",
    answer: "The community can upvote products they find valuable. Trending products are calculated based on a combination of upvotes, recency, and community engagement. This ensures that the most relevant tools stay at the top.",
  },
  {
    question: "Can I edit my product after launching?",
    answer: "Absolutely! You can update your product's description, images, and external links at any time from your Creator Dashboard.",
  },
  {
    question: "What kind of products can I submit?",
    answer: "We welcome developer tools, AI applications, SaaS platforms, Chrome extensions, and anything technically creative built by developers, for developers.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative z-10 bg-slate-50 dark:bg-slate-900/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
            <HelpCircle className="h-3.5 w-3.5" /> Support Centre
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Common Questions
          </h2>
          <p className="text-slate-500 dark:text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Everything you need to know about the DevHuntr platform and how to make the most of your launch.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={cn(
                "group rounded-[2rem] border transition-all duration-500",
                openIndex === idx
                  ? "bg-white dark:bg-white/5 border-indigo-300 dark:border-indigo-500/30 shadow-xl shadow-indigo-100 dark:shadow-indigo-500/5"
                  : "bg-white dark:bg-transparent border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:shadow-md"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className={cn(
                  "text-lg font-black tracking-tight transition-colors duration-300",
                  openIndex === idx ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-white"
                )}>
                  {faq.question}
                </span>
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-500 border",
                  openIndex === idx 
                    ? "bg-indigo-600 border-indigo-600 text-white rotate-180 shadow-lg shadow-indigo-500/30" 
                    : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400"
                )}>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </button>

              <div className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                openIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="px-8 pb-8 text-slate-600 dark:text-muted-foreground leading-relaxed text-lg pt-2 border-t border-slate-100 dark:border-white/5 mt-2 mx-6">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
