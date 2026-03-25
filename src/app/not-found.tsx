import Link from "next/link";
import { Ghost, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center text-center px-4 relative overflow-hidden bg-background">
      
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[120px]" />
      
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/30 mb-8 animate-bounce shadow-2xl shadow-purple-500/20">
        <Ghost className="h-12 w-12 text-purple-400" />
      </div>
      
      <h1 className="text-8xl md:text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-4">
        404
      </h1>
      
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        Lost in the void.
      </h2>
      
      <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10 leading-relaxed">
        We could not find the page you were looking for. It might have been deleted, moved, or never existed at all.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm mx-auto">
        <Link href="/" className="w-full">
          <Button size="lg" className="rounded-full bg-white text-black hover:bg-neutral-200 w-full h-12">
            <Home className="mr-2 h-4 w-4" />
            Back Home
          </Button>
        </Link>
        <Link href="/products" className="w-full">
          <Button size="lg" variant="outline" className="rounded-full w-full h-12 border-white/20 glass hover:bg-white/10 hover:text-white">
            <Search className="mr-2 h-4 w-4" />
            Explore
          </Button>
        </Link>
      </div>
    </div>
  );
}
