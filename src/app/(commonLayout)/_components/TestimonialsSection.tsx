"use client";

import { Quote, Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    content: "Launched my first SaaS on DevHuntr and reached #1 Trending. The community feedback was invaluable for my roadmap!",
    author: "Abdullah Al Mamun",
    role: "Founder of UIFlow",
    avatar: "/imageOne.jpg",
    verified: true,
  },
  {
    id: 2,
    content: "The best place to find emerging dev tools. I found three libraries here that we now use in our production stack.",
    author: "Forhadul Islam Fahim",
    role: "Lead Dev at Techcorp",
    avatar: "/imagetwo.jpg",
    verified: true,
  },
  {
    id: 3,
    content: "Finally a community that appreciates the technical depth of products. DevHuntr is my go-to for every new launch.",
    author: "Zibran Hasan Shuvo",
    role: "Independent Maker",
    avatar: "/imagethree.jpg",
    verified: false,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-900/20">
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[100px]" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-widest">
            <Star className="h-3.5 w-3.5 fill-current" /> Community Voice
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Loved by Developers
          </h2>
          <p className="text-slate-500 dark:text-muted-foreground text-lg max-w-2xl">
            See what the community is saying about the products and experiences on DevHuntr.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-500 flex flex-col h-full"
            >
              <Quote className="absolute top-6 right-8 h-10 w-10 text-slate-200 dark:text-white/5 group-hover:text-purple-300/40 dark:group-hover:text-purple-500/20 transition-colors" />
              
              <div className="flex flex-col h-full">
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8 relative z-10 italic grow">
                  &quot;{t.content}&quot;
                </p>
 
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                  <div className="relative shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.author}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover border-2 border-slate-100 dark:border-white/10 shadow-sm"
                    />
                    {t.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white rounded-full p-1 border-2 border-white dark:border-slate-900 shadow-lg leading-none">
                        <svg className="h-2 w-2 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-0.5">
                      {t.author}
                    </h4>
                    <p className="text-slate-500 dark:text-muted-foreground text-sm font-medium">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
 
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-slate-200 dark:bg-white/5 group-hover:w-24 group-hover:bg-purple-400/40 dark:group-hover:bg-purple-500/30 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
