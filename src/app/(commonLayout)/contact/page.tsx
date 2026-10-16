"use client";

import { useState } from "react";
import { Mail, MessageSquare, MapPin, Send, ArrowLeft, LucideIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent! We will get back to you shortly.");
    }, 600);
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] pt-12 pb-20 overflow-hidden bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[400px] w-full max-w-5xl rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          <div className="space-y-10">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-indigo-600">touch.</span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                Have questions about launching your product? Our team of makers is here to help you navigate the hunt.
              </p>
            </div>

            <div className="space-y-6">
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
                sub="Priority support for active makers."
              />
              <ContactInfoCard 
                Icon={MapPin} 
                title="Office" 
                detail="The Digital Hub, San Francisco" 
                sub="Drop by for a coffee if you're around."
              />
            </div>
          </div>

          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Send a Message</h2>
              <p className="text-xs text-muted-foreground">Fill out the form below and we&apos;ll get back to you promptly.</p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Thank you for reaching out!</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Your message has been received. Our team will follow up via email within 24 hours.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="rounded-xl mt-2">
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-semibold text-foreground">Name</label>
                    <Input id="contact-name" type="text" placeholder="Alex Rivera" required className="h-10 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-semibold text-foreground">Email</label>
                    <Input id="contact-email" type="email" placeholder="alex@example.com" required className="h-10 text-sm" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-foreground">Message</label>
                  <Textarea id="contact-message" placeholder="How can we help your launch?" required className="min-h-[130px] text-sm resize-none" />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  {loading ? "Sending..." : "Send Message"}{" "}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function ContactInfoCard({ Icon, title, detail, sub }: { Icon: LucideIcon; title: string; detail: string; sub: string }) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="h-11 w-11 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-xs">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-0.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">{title}</h3>
        <p className="text-base font-bold text-foreground">{detail}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
