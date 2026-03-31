import Link from "next/link";
import { ArrowRight, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrendingGrid } from "./_components/TrendingGrid";
import { FeaturedGrid } from "./_components/FeaturedGrid";
import { CategoryBar } from "./_components/CategoryBar";
import { StatsSection } from "./_components/StatsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">

      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">

        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute inset-0 bg-size-[14px_24px] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
          <div className="absolute right-1/4 top-32 -z-10 h-[250px] w-[250px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
        </div>

        <div className="container px-4 mx-auto flex flex-col items-center text-center relative z-10">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-8 animate-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="h-4 w-4" />
            <span>The premier indie maker community</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl text-transparent bg-clip-text bg-linear-to-br from-white via-white/90 to-white/40 mb-6 animate-in slide-in-from-bottom-6 duration-700">
            Discover the next big <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500">
              Tech Product.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-in slide-in-from-bottom-8 duration-700 delay-150">
            DevHuntr is the ultimate platform for developers, makers, and enthusiasts to share, review, and upvote the best emerging software, AI tools, and Web Apps.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/products">
              <Button size="lg" className="rounded-full w-full sm:w-auto h-12 px-8 bg-white text-black hover:bg-neutral-200">
                Explore Products
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto h-12 px-8 border-white/20 hover:bg-white/10 glass">
                Join Community
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CategoryBar />

      <FeaturedGrid />

      <StatsSection />

      <section className="py-24 bg-black/50 border-y border-border/30 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-purple-500/5 blur-[120px] -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight mb-3">Trending Right Now</h2>
              <p className="text-muted-foreground text-lg">The most upvoted products by the community this week.</p>
            </div>
            <Link href="/products">
              <Button size="lg" variant="outline" className="rounded-full border-purple-500/30 hover:bg-purple-500/10 text-purple-400 group">
                View all products <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <TrendingGrid />
        </div>
      </section>

    </div>
  );
}
