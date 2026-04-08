import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-6 bg-slate-50 dark:bg-background/20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="w-full max-w-md space-y-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0d0d12] p-10 md:p-12 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter mb-3 text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 dark:text-muted-foreground text-base tracking-tight">
            Login to your DevHuntr account
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-muted-foreground py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-purple-500" />
          Loading secure form...
        </div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center text-sm pt-8 border-t border-slate-100 dark:border-white/5">
          <span className="text-slate-500 dark:text-muted-foreground">Don&apos;t have an account?</span>{" "}
          <Link href="/register" className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}
