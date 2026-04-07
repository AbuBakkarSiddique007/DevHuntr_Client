"use client";

import { useEffect, useState } from "react";
import { TagService, Tag } from "@/services/tag/tag.service";
import {
  Bot, Cloud, Code2, Cpu, Globe, Smartphone, Zap,
  Hash, Layers, Database, Shield, Palette
} from "lucide-react";

// Mapping icons to tag names for a visual punch
const getIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("ai") || n.includes("bot") || n.includes("gpt")) return Bot;
  if (n.includes("saas") || n.includes("cloud")) return Cloud;
  if (n.includes("dev") || n.includes("code") || n.includes("tool")) return Code2;
  if (n.includes("web") || n.includes("browser")) return Globe;
  if (n.includes("mobile") || n.includes("app") || n.includes("ios") || n.includes("android")) return Smartphone;
  if (n.includes("hardware") || n.includes("cpu")) return Cpu;
  if (n.includes("design") || n.includes("ui") || n.includes("ux")) return Palette;
  if (n.includes("security") || n.includes("auth")) return Shield;
  if (n.includes("data") || n.includes("sql") || n.includes("db")) return Database;
  if (n.includes("infra") || n.includes("deploy")) return Layers;
  if (n.includes("prod") || n.includes("zap")) return Zap;
  return Hash;
};

export function CategoryBar() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await TagService.getTags();
        setTags(data);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  if (loading || tags.length === 0) return null;

  // Duplicate items for a seamless loop
  const displayTags = [...tags, ...tags, ...tags];

  return (
    <div className="container mx-auto px-4 overflow-hidden py-6 -mt-12 relative z-20 group">
      {/* Horizontal Scroller Container with seamless gradient masks */}
      <div className="mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex animate-marquee-slow whitespace-nowrap group-hover:pause-animation gap-4 py-2">
          {displayTags.map((tag, i) => {
          const Icon = getIcon(tag.name);
          return (
            <div
              key={`${tag.id}-${i}`}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white dark:bg-[#0d0d12]/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:border-purple-300 dark:hover:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-500/5 transition-all shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-2xl shrink-0 group/item cursor-pointer"
            >
              <Icon className="h-4 w-4 text-[#1d5464] dark:text-[#1d5464]/80 group-hover/item:text-[#1d5464] transition-colors" />
              <span className="text-sm font-semibold text-slate-700 dark:text-muted-foreground group-hover/item:text-[#1d5464] dark:group-hover/item:text-white transition-colors">
                {tag.name}
              </span>
            </div>
          );
        })}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee-slow {
          animation: marquee 40s linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
