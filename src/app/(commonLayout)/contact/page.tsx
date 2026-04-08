import { Mail, MessageSquare, MapPin, Send, ArrowLeft, LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="relative min-h-[calc(100vh-100px)] pt-20 pb-24 overflow-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-full max-w-6xl rounded-full bg-purple-500/5 blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors mb-12 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600">Touch.</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-muted-foreground leading-relaxed max-w-lg">
                Have questions about launching your product? Our team of makers is here to help you navigate the hunt.
              </p>
            </div>

            <div className="space-y-8">
              <ContactInfoCard 
                Icon={Mail} 
                title="Email Us" 
                detail="support@devhuntr.com" 
                sub="We usually reply within 24 hours."
              />
              <ContactInfoCard 
                Icon={MessageSquare} 
                title="Live Chat" 
                detail="Available 9AM - 5PM EST" 
                sub="Instant support for premium makers."
              />
              <ContactInfoCard 
                Icon={MapPin} 
                title="Office" 
                detail="The Digital Hub, San Francisco" 
                sub="Drop by for a coffee if you're in town."
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-indigo-500/10 rounded-[3rem] blur-2xl -z-10" />
            <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Send a Message</h3>
                <p className="text-sm text-slate-500 dark:text-muted-foreground">Fill out the form below and we&apos;ll get back to you.</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Name</label>
                    <input type="text" placeholder="John Doe" className="w-full h-14 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 text-sm focus:ring-2 focus:ring-purple-500/50 outline-hidden transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                    <input type="email" placeholder="john@example.com" className="w-full h-14 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 text-sm focus:ring-2 focus:ring-purple-500/50 outline-hidden transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                  <textarea placeholder="How can we help you?" className="w-full min-h-[160px] rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 text-sm focus:ring-2 focus:ring-purple-500/50 outline-hidden transition-all resize-none" />
                </div>

                <Button className="w-full h-16 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-purple-500/20 group">
                  Shoot Message <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ContactInfoCard({ Icon, title, detail, sub }: { Icon: LucideIcon; title: string; detail: string; sub: string }) {
  return (
    <div className="flex gap-6 items-start group">
      <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">{title}</h4>
        <p className="text-xl font-bold text-slate-900 dark:text-white">{detail}</p>
        <p className="text-sm text-slate-500">{sub}</p>
      </div>
    </div>
  );
}
