import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "./_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex items-center justify-center py-12 px-4 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-card rounded-2xl shadow-xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-300">
        
        {/* Left Panel - Brand Space */}
        <div className="flex-1 relative overflow-hidden md:block hidden min-h-[540px] border-r border-border">
          <div className="absolute top-6 left-6 z-20">
            <Link
              href="/"
              aria-label="Back to home"
              className="w-10 h-10 bg-background/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-background transition-colors border border-border text-foreground shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              alt="Join DevHuntr"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute bottom-10 left-8 right-8 z-10 space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Join the Hunt.</h2>
              <p className="text-white/80 text-sm leading-relaxed">Discovery starts with a single step. Join 5,000+ indie makers shipping together.</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form Space */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">Create Account</h1>
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
