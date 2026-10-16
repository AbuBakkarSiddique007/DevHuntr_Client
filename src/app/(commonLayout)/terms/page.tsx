import { FileText, Scale, UserCheck, Zap, ArrowLeft, Clock, LucideIcon } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="relative min-h-[calc(100vh-100px)] py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-10 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider leading-none">
              <FileText className="h-3.5 w-3.5" /> Legal Framework
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 text-muted-foreground text-xs sm:text-sm font-medium">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Last Updated: April 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TermsCard Icon={Scale} title="Fair Use" desc="All products must be legally compliant." />
            <TermsCard Icon={UserCheck} title="Ownership" desc="You retain ownership of your submissions." />
            <TermsCard Icon={Zap} title="Integrity" desc="No spamming or deceptive practices allowed." />
          </div>

          <div className="bg-card border border-border p-8 md:p-12 rounded-2xl shadow-xs space-y-10">
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                By accessing and using DevHuntr, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">2. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                You are responsible for all activity that occurs under your account. You agree not to use DevHuntr for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">3. Content Guidelines</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Product submissions must be honest and non-deceptive. We reserve the right to remove any content that violates our community standards or contains misleading information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">4. Disclaimers</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base italic">
                DevHuntr is provided &quot;as is&quot; without any warranties. We are not responsible for the quality or legality of third-party products discovered on our platform.
              </p>
            </section>

            <div className="pt-8 border-t border-border space-y-4">
              <h3 className="text-lg font-bold text-foreground">Contact Legal</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                For legal inquiries, please reach out to <a href="mailto:legal@devhuntr.com" className="text-primary font-semibold hover:underline">legal@devhuntr.com</a>.
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
    <div className="p-6 rounded-xl bg-card border border-border flex flex-col items-center text-center space-y-3 hover:border-primary/40 transition-all duration-300 shadow-xs">
      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold tracking-tight text-foreground">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
