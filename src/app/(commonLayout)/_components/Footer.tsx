import Link from "next/link";
import { LucideIcon, Orbit, Code, X, Users, Mail, ArrowUpRight, ShieldCheck, FileText, HelpCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-50 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/40 backdrop-blur-3xl overflow-hidden mt-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-32 w-full max-w-4xl rounded-full bg-purple-500/5 blur-[100px]" />

      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-tr from-purple-500 to-indigo-600 text-white shadow-xl shadow-purple-500/20 group-hover:scale-110 transition-all duration-500 rotate-3 group-hover:rotate-0">
                <Orbit className="h-6 w-6 animate-[spin_8s_linear_infinite]" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">DevHuntr</span>
            </Link>
            
            <p className="text-slate-600 dark:text-muted-foreground text-lg max-w-sm leading-relaxed">
              The premier launchpad for indie makers. Discover, upvote, and ship the next generation of tech tools.
            </p>

            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all duration-300 border border-slate-200 dark:border-white/10 group">
                <Code className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-300 border border-slate-200 dark:border-white/10 group">
                <X className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 border border-slate-200 dark:border-white/10 group">
                <Users className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">Platform</h3>
            <div className="flex flex-col gap-4">
              <FooterLink href="/products" label="Explore Apps" />
              <FooterLink href="/featured" label="Curated Picks" />
              <FooterLink href="/user-dashboard/launch" label="Submit Product" />
              <FooterLink href="/about" label="Our Story" />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">Support</h3>
            <div className="flex flex-col gap-4">
              <FooterLink href="/contact" label="Get Help" icon={HelpCircle} />
              <FooterLink href="/privacy" label="Privacy Policy" icon={ShieldCheck} />
              <FooterLink href="/terms" label="Terms of Service" icon={FileText} />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">Newsletter</h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-muted-foreground leading-relaxed">
                Join 5k+ makers getting weekly tech tool updates.
              </p>
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus-within:border-purple-500/50 transition-all">
                <input 
                  type="email" 
                  placeholder="Drop your email" 
                  className="bg-transparent border-none focus:ring-0 text-sm pl-3 w-full outline-hidden"
                  suppressHydrationWarning
                />
                <button className="h-9 w-9 bg-purple-600 rounded-xl flex items-center justify-center text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20">
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-slate-400 dark:text-muted-foreground/50">
            © {currentYear} <span className="text-slate-900 dark:text-white">DevHuntr</span>. Built for builders.
          </p>
          <div className="flex items-center gap-6">
            <a href="mailto:support@devhuntr.com" className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <Mail className="h-4 w-4" /> support@devhuntr.com
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
      className="group flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-all w-fit"
    >
      {Icon && <Icon className="h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground/50 group-hover:text-purple-500 transition-colors" />}
      {label}
      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-600 dark:text-purple-400" />
    </Link>
  );
}
