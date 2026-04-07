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
      description: "DevHuntr was born from a simple observation: some of the most innovative tech products are built in the dark. We created a space where local developers can showcase their creations, receive honest feedback, and get the recognition they deserve.",
      icon: <Sparkles className="h-8 w-8 text-purple-400" />,
      color: "from-purple-500/20 to-indigo-500/20",
      borderColor: "border-purple-500/30"
    },
    {
      id: "02",
      title: "The Quality Standard",
      subtitle: "A Community-Driven Review System",
      description: "Integrity is at our core. Every product submitted undergoes a rigorous moderator review queue before it hits the platform. This ensures that DevHuntr remains a home for high-quality, functional, and valuable software solutions.",
      icon: <ShieldCheck className="h-8 w-8 text-blue-400" />,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      id: "03",
      title: "The Power of Choice",
      subtitle: "Empowering Users through Voting",
      description: "The community decides which products rise to the top. Our transparent upvote and downvote system ensures that the most helpful and innovative tools gain visibility, while the 'Featured' tag recognizes peak excellence.",
      icon: <Users className="h-8 w-8 text-pink-400" />,
      color: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30"
    },
    {
      id: "04",
      title: "The Growth Engine",
      subtitle: "Turning Ideas into Reality",
      description: "DevHuntr isn't just a discovery tool—it's a launchpad. From free open-source utilities to premium SaaS products, we provide the infrastructure (including secure payments and robust analytics) for developers to grow their ideas into businesses.",
      icon: <TrendingUp className="h-8 w-8 text-amber-400" />,
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-24">
 
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

     
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <Ghost className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Our Story</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-linear-to-br dark:from-white dark:via-white/90 dark:to-white/40 leading-tight">
          Redefining Product discovery <br className="hidden md:block" /> for local Developers.
        </h1>
        <p className="text-xl text-slate-600 dark:text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
          DevHuntr is more than a directory; it is an ecosystem built to bridge the gap between creative code and happy users.
        </p>
      </section>


      <section className="container mx-auto px-4 py-20 relative">
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="group relative flex gap-8 md:gap-16 mb-24 last:mb-0">
              
              {index !== steps.length - 1 && (
                <div className="absolute left-6 md:left-9 top-12 -bottom-16 w-px bg-linear-to-b from-white/10 to-transparent -z-10" />
              )}

             
              <div className="shrink-0">
                <div className={`relative h-12 w-12 md:h-18 md:w-18 flex items-center justify-center rounded-2xl border ${step.borderColor} bg-linear-to-br ${step.color} shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500`}>
                  <span className="text-sm md:text-lg font-bold text-slate-900 dark:text-white/80">{step.id}</span>
                  <div className="absolute -inset-2 bg-white/5 rounded-3xl -z-10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

            
              <div className="flex-1 pt-2 md:pt-4">
                <div className="flex items-center gap-3 mb-3">
                  {step.icon}
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white/90">{step.title}</h3>
                </div>
                <h4 className="text-lg md:text-xl font-semibold mb-4 text-purple-600 dark:text-primary/80 leading-snug">
                  {step.subtitle}
                </h4>
                <div className="p-6 rounded-3xl glass border border-white/5 hover:border-white/10 transition-colors shadow-2xl">
                  <p className="text-slate-600 dark:text-muted-foreground text-md md:text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="p-12 md:p-20 rounded-[3rem] glass border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">Ready to hunt for excellence?</h2>
          <p className="text-xl text-slate-600 dark:text-muted-foreground/80 mb-10 max-w-xl mx-auto">
            Join thousands of developers sharing their journey and discovering the next big thing in tech.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 h-14 bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-xl shadow-purple-500/20 text-lg transition-all hover:scale-105">
                Join our community
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 glass border-white/10 text-lg transition-all hover:bg-white/5 flex items-center gap-2">
                Explore products <Rocket className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
