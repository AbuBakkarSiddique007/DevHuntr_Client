import { FileText, Scale, UserCheck, Zap, ArrowLeft, Clock, LucideIcon } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="relative min-h-[calc(100vh-100px)] pt-20 pb-24 overflow-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-full max-w-6xl rounded-full bg-emerald-500/5 blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors mb-12 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest leading-none">
              <FileText className="h-3.5 w-3.5" /> Legal Framework
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              Terms of <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">Service.</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 text-sm font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Last Updated: April 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TermsCard Icon={Scale} title="Fair Use" desc="All products must be legally compliant." />
            <TermsCard Icon={UserCheck} title="Ownership" desc="You retain ownership of your submissions." />
            <TermsCard Icon={Zap} title="Integrity" desc="No spamming or deceptive practices allowed." />
          </div>

          <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-10 md:p-16 rounded-[3rem] shadow-2xl space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
              <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                By accessing and using DevHuntr, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">2. User Conduct</h2>
              <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                You are responsible for all activity that occurs under your account. You agree not to use DevHuntr for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">3. Content Guidelines</h2>
              <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                Product submissions must be honest and non-deceptive. We reserve the right to remove any content that violates our community standards or contains misleading information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">4. Disclaimers</h2>
              <p className="text-slate-600 dark:text-muted-foreground leading-relaxed italic">
                DevHuntr is provided &quot;as is&quot; without any warranties. We are not responsible for the quality or legality of third-party products discovered on our platform.
              </p>
            </section>

            <div className="pt-12 border-t border-slate-100 dark:border-white/5 space-y-6">
              <h3 className="text-xl font-bold">Contact Legal</h3>
              <p className="text-slate-600 dark:text-muted-foreground">
                For legal inquiries, please reach out to <a href="mailto:legal@devhuntr.com" className="text-emerald-500 font-bold hover:underline">legal@devhuntr.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsCard({ Icon, title, desc }: { Icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col items-center text-center space-y-4 hover:border-emerald-500/30 transition-all duration-500">
      <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-black tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
