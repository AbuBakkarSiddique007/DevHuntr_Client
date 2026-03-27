import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-2xl border-white/10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm">
            Login to your DevHuntr account
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-muted-foreground py-4">Loading form...</div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center text-sm pt-4 border-t border-border/40">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
