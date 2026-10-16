"use client";

import Link from "next/link";
import { LucideIcon, Orbit, Code, X, Users, Mail, ArrowUpRight, ShieldCheck, FileText, HelpCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-40 border-t border-border bg-card/60 backdrop-blur-xl overflow-hidden mt-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-32 w-full max-w-4xl rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-all">
                <Orbit className="h-5 w-5 animate-[spin_8s_linear_infinite]" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">DevHuntr</span>
            </Link>
            
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              The premier launchpad for indie makers. Discover, upvote, and ship the next generation of tech tools.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Code className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Users className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Platform</h3>
            <div className="flex flex-col gap-3">
              <FooterLink href="/products" label="Explore Apps" />
              <FooterLink href="/featured" label="Curated Picks" />
              <FooterLink href="/user-dashboard/launch" label="Submit Product" />
              <FooterLink href="/about" label="Our Story" />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Support</h3>
            <div className="flex flex-col gap-3">
              <FooterLink href="/contact" label="Get Help" icon={HelpCircle} />
              <FooterLink href="/privacy" label="Privacy Policy" icon={ShieldCheck} />
              <FooterLink href="/terms" label="Terms of Service" icon={FileText} />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Newsletter</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join 5k+ makers getting weekly tech tool updates.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 p-1.5 rounded-xl bg-muted/60 border border-border focus-within:border-primary/50 transition-colors">
                <input 
                  type="email" 
                  aria-label="Email address for newsletter"
                  placeholder="Drop your email" 
                  className="bg-transparent border-none focus:ring-0 text-sm pl-2 w-full outline-hidden text-foreground placeholder:text-muted-foreground"
                  suppressHydrationWarning
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity shadow-sm shrink-0"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} <span className="font-semibold text-foreground">DevHuntr</span>. Built for builders.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="mailto:support@devhuntr.com"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-3.5 w-3.5" /> support@devhuntr.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label, icon: Icon }: { href: string; label: string; icon?: LucideIcon }) {
  return (
    <Link 
      href={href} 
      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
    >
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />}
      {label}
      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
    </Link>
  );
}
