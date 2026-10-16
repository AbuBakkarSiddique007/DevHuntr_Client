import Link from "next/link";
import { Ghost, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center text-center px-4 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[360px] w-[360px] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
      
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-6 shadow-sm">
        <Ghost className="h-10 w-10 text-primary" />
      </div>
      
      <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-b from-foreground to-foreground/30 mb-2">
        404
      </h1>
      
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-indigo-500">
        Lost in the void.
      </h2>
      
      <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto mb-8 leading-relaxed">
        We could not find the page you were looking for. It might have been moved or never existed.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center max-w-xs mx-auto">
        <Link href="/" className="w-full">
          <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:opacity-90 w-full h-11 font-semibold text-sm">
            <Home className="mr-1.5 h-4 w-4" />
            Back Home
          </Button>
        </Link>
        <Link href="/products" className="w-full">
          <Button size="lg" variant="outline" className="rounded-full w-full h-11 border-border bg-card hover:bg-muted text-foreground font-semibold text-sm">
            <Search className="mr-1.5 h-4 w-4" />
            Explore
          </Button>
        </Link>
      </div>
    </div>
  );
}
