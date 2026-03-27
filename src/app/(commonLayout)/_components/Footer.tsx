import Link from "next/link";
import { Ghost } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Ghost className="h-6 w-6 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl tracking-tight">DevHuntr</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Discover, review, and upvote the best technology products, Web Apps, AI tools, and more in the developer ecosystem.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground/80">Platform</h3>
            <div className="flex flex-col gap-2">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Explore Products</Link>
              <Link href="/user-dashboard/launch" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Submit an App</Link>
              <Link href="/#trending" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Trending Now</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground/80">Legal</h3>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Terms of Service</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevHuntr. All rights reserved.
          </p>
          <div className="flex gap-4">
            
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
              <span className="text-xs">𝕏</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
              <span className="text-xs">gh</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
