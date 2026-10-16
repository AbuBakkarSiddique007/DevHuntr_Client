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
    <section className="py-24 relative overflow-hidden bg-background border-t border-border">
      <div className="absolute top-0 right-0 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-14 gap-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 fill-current" /> Community Voice
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Loved by Developers
          </h2>
          <p className="text-muted-foreground text-base max-w-xl">
            See what the community is saying about the products and experiences on DevHuntr.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group relative p-7 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col h-full"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-muted-foreground/20 group-hover:text-primary/30 transition-colors" />
              
              <div className="flex flex-col h-full">
                <p className="text-foreground/90 text-base leading-relaxed mb-6 relative z-10 italic grow">
                  &quot;{t.content}&quot;
                </p>

                <div className="flex items-center gap-3.5 mt-auto pt-5 border-t border-border">
                  <div className="relative shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.author}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover border border-border shadow-xs"
                    />
                    {t.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 bg-primary text-primary-foreground rounded-full p-0.5 border-2 border-card shadow-xs">
                        <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h4 className="font-semibold text-foreground text-base leading-tight mb-0.5 truncate">
                      {t.author}
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
