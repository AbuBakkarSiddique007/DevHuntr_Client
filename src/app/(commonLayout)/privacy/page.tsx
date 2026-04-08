import { ShieldCheck, Lock, Eye, Globe, ArrowLeft, Clock, LucideIcon } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-[calc(100vh-100px)] pt-20 pb-24 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 -z-10 h-[600px] w-full max-w-6xl rounded-full bg-blue-500/5 blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-12 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest leading-none">
              <ShieldCheck className="h-3.5 w-3.5" /> Security First
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              Privacy <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Policy.</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 text-sm font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Last Updated: April 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PrivacyCard Icon={Lock} title="Security" desc="Your data is encrypted and stored safely." />
            <PrivacyCard Icon={Eye} title="Transparency" desc="We are clear about what we collect." />
            <PrivacyCard Icon={Globe} title="Control" desc="You have full control over your data." />
          </div>

          <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-10 md:p-16 rounded-[3rem] shadow-2xl space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">1. Information We Collect</h2>
              <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                When you create an account on DevHuntr, we collect basic information such as your name, email address, and profile picture. We also collect content you voluntarily submit, such as product descriptions, comments, and votes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">2. How We Use Data</h2>
              <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                Your data is used to personalize your experience, provide community features (like voting and commenting), and improve our platform. We never sell your personal information to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">3. Third-Party Services</h2>
              <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                We use secure tertiary services like Stripe for payment processing and ImgBB for image hosting. These services have their own privacy policies which govern the data shared with them.
              </p>
            </section>

            <div className="pt-12 border-t border-slate-100 dark:border-white/5 space-y-6">
              <h3 className="text-xl font-bold">Questions?</h3>
              <p className="text-slate-600 dark:text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact our support team at <a href="mailto:support@devhuntr.com" className="text-blue-500 font-bold hover:underline">support@devhuntr.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyCard({ Icon, title, desc }: { Icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col items-center text-center space-y-4 hover:border-blue-500/30 transition-all duration-500">
      <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-black tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
