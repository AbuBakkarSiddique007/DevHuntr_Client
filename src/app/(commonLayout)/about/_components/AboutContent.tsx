"use client";

import { Ghost, Sparkles, Rocket, Users, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AboutContent() {
  const steps = [
    {
      id: "01",
      title: "The Vision",
      subtitle: "Connecting Local Innovation with Global Recognition",
      description: "DevHuntr was born from a simple observation: some of the most innovative tech products are built in the dark. We created a space where indie makers can showcase their creations, receive honest feedback, and get the recognition they deserve.",
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      color: "bg-primary/10 border-primary/20",
    },
    {
      id: "02",
      title: "The Quality Standard",
      subtitle: "A Community-Driven Review System",
      description: "Integrity is at our core. Every product submitted undergoes a quick moderator review check before it goes live. This ensures that DevHuntr remains a home for functional, creative, and valuable software solutions.",
      icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "03",
      title: "The Power of Choice",
      subtitle: "Empowering Users through Voting",
      description: "The community decides which products rise to the top. Our transparent voting system ensures that the most helpful tools gain visibility, while the 'Featured' tag highlights peak excellence.",
      icon: <Users className="h-6 w-6 text-pink-500" />,
      color: "bg-pink-500/10 border-pink-500/20",
    },
    {
      id: "04",
      title: "The Growth Engine",
      subtitle: "Turning Ideas into Reality",
      description: "DevHuntr isn't just a directory—it's a launchpad. From free open-source utilities to premium SaaS products, we provide the platform for developers to grow their creations into thriving projects.",
      icon: <TrendingUp className="h-6 w-6 text-amber-500" />,
      color: "bg-amber-500/10 border-amber-500/20",
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 shadow-xs">
          <Ghost className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Our Story</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground max-w-4xl mx-auto leading-tight">
          Redefining Product Discovery for Indie Builders.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          DevHuntr is an ecosystem built to bridge the gap between creative code and happy users through community-driven recognition.
        </p>
      </section>

      <section className="container mx-auto px-4 py-12 relative">
        <div className="max-w-3xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex gap-6 sm:gap-10 group">
              {index !== steps.length - 1 && (
                <div className="absolute left-6 sm:left-7 top-14 bottom-[-48px] w-px bg-border -z-10" />
              )}

              <div className="shrink-0">
                <div className={`h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-2xl border ${step.color} shadow-xs font-bold text-foreground`}>
                  {step.id}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2.5">
                  {step.icon}
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{step.title}</h2>
                </div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {step.subtitle}
                </h3>
                <div className="p-6 rounded-2xl bg-card border border-border shadow-xs mt-3">
                  <p className="text-foreground/90 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pt-16 text-center">
        <div className="max-w-3xl mx-auto p-6 sm:p-10 md:p-14 rounded-2xl bg-card border border-border relative overflow-hidden shadow-xs">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Ready to hunt for excellence?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Join thousands of developers sharing their journey and discovering the next big innovation in tech.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-7 h-11 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:opacity-95 border-none"
              >
                Join our community
              </Button>
            </Link>
            <Link href="/products" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-7 h-11 border-border bg-background hover:bg-muted text-foreground font-semibold text-sm"
              >
                Explore products <Rocket className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
