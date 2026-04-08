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
    <section className="py-24 relative z-10 bg-white dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">
            <BookOpen className="h-3.5 w-3.5" /> DevJournal
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Maker Insights & Guides
          </h2>
          <p className="text-slate-500 dark:text-muted-foreground text-lg max-w-2xl">
            Level up your building game with tutorials, success stories, and deep dives from the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link 
              key={article.id} 
              href={article.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col h-full"
            >
              <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-6 border border-slate-100 dark:border-white/10 shadow-lg">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/20">
                  {article.category}
                </div>
              </div>

              <div className="grow">
                <div className="flex items-center gap-4 text-slate-500 dark:text-muted-foreground text-xs mb-3 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 leading-none">
                    <Clock className="h-3.5 w-3.5" /> {article.readTime}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
                  <span className="leading-none">{article.author}</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-slate-600 dark:text-muted-foreground leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                Read Publication <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
