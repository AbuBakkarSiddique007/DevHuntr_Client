"use client";

import { useAuth } from "@/context/AuthContext";
import { ProductForm } from "./_components/ProductForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Sparkles, Loader2 } from "lucide-react";

export default function LaunchProductPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?callback=/products/launch");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="text-muted-foreground animate-pulse">Preparing the launchpad...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold mb-4">
          <Sparkles className="h-4 w-4" />
          <span>Showcase your creation</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
          Launch your project
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Share your innovation with the community and get the recognition it deserves.
        </p>
      </div>

      <div className="relative">

        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700"></div>

        <ProductForm />
      </div>

      <div className="mt-20 p-8 glass rounded-[2rem] text-center border-white/5">
        <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
          <Rocket className="h-5 w-5 text-purple-400" />
          What happens after I launch?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Your product will be reviewed by our moderators. Once accepted, it will appear on the
          <span className="text-foreground animate-pulse font-medium"> New Products</span> list and can be featured or trend based on community votes!
        </p>
      </div>
    </div>
  );
}
