"use client";

import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    id: 1,
    title: "How to Launch Your MVP in 48 Hours: The Maker's Guide",
    excerpt: "Learn the essential shortcuts and tools used by top indie makers to ship fast without sacrificing quality.",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    readTime: "5 min read",
    author: "James Clear",
    url: "https://fastercapital.com/content/Building-an-MVP-in-48-Hours.html",
  },
  {
    id: 2,
    title: "Why Developer Experience is the New Competitive Advantage",
    excerpt: "The tools that win in 2026 aren't just powerful; they're a joy to use. Here's what we learned from analyzing 100+ devs.",
    category: "Insights",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2370&auto=format&fit=crop",
    readTime: "8 min read",
    author: "Mina Sun",
    url: "https://famitsnt.com/blog/why-developer-experience-is-the-key-to-gaining-competitive-edge",
  },
  {
    id: 3,
    title: "Scaling to 10k Users on a $0 Marketing Budget",
    excerpt: "A deep dive into organic growth strategies that worked for the most successful apps on DevHuntr.",
    category: "Growth",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2370&auto=format&fit=crop",
    readTime: "6 min read",
    author: "David Heinemeier",
    url: "https://www.singular.net/blog/scale-ad-spend/",
  },
];

export function BlogPreviewSection() {
  return (
    <section className="py-24 relative z-10 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-14 gap-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" /> DevJournal
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Maker Insights & Guides
          </h2>
          <p className="text-muted-foreground text-base max-w-xl">
            Level up your building game with tutorials, success stories, and deep dives from the community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link 
              key={article.id} 
              href={article.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/40 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-border">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-md text-foreground text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-border">
                  {article.category}
                </div>
              </div>

              <div className="grow flex flex-col">
                <div className="flex items-center gap-3 text-muted-foreground text-xs mb-2.5 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {article.readTime}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{article.author}</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 grow">
                  {article.excerpt}
                </p>

                <div className="mt-4 pt-3 border-t border-border flex items-center text-xs font-semibold text-primary">
                  <span>Read Publication</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
