import Link from "next/link";
import { ArrowRight, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden -mt-20 pt-32 pb-20 lg:pt-36 lg:pb-28 text-foreground">
      {/* Background ambient accents */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-size-[16px_24px] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] opacity-40 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 -z-10 h-[320px] w-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute right-1/4 top-32 -z-10 h-[220px] w-[350px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />
      </div>

      <div className="container px-4 mx-auto flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8 animate-in slide-in-from-bottom-4 duration-500">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The premier indie maker community</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl text-foreground mb-6 animate-in slide-in-from-bottom-6 duration-700">
          Discover the next big{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 via-indigo-500 to-pink-500">
            tech product.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed animate-in slide-in-from-bottom-8 duration-700 delay-150">
          DevHuntr is the ultimate launchpad for developers, indie makers, and tech enthusiasts to showcase, explore, and upvote tomorrow&apos;s best software.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center max-w-md animate-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link href="/products" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="rounded-full w-full sm:w-auto h-12 px-8 bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-purple-500/25 border-none font-semibold transition-all hover:-translate-y-0.5"
            >
              Explore Products
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-full sm:w-auto h-12 px-8 border-border bg-card/60 backdrop-blur-md hover:bg-muted font-semibold transition-all"
            >
              Join Community
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
