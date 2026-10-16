import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-xl animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your DevHuntr account
          </p>
        </div>

        <Suspense fallback={
          <div className="text-center text-xs text-muted-foreground py-8">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
            Loading secure form...
          </div>
        }>
          <LoginForm />
        </Suspense>

        <div className="text-center text-xs pt-6 border-t border-border">
          <span className="text-muted-foreground">Don&apos;t have an account?</span>{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}
