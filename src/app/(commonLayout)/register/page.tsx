import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "./_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex items-center justify-center py-16 px-4 bg-slate-50 dark:bg-background/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white/80 dark:bg-[#0d0d12] backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Panel - Brand Space */}
        <div className="flex-1 relative overflow-hidden md:block hidden min-h-[600px] border-r border-slate-100 dark:border-white/5">
          <div className="absolute top-8 left-8 z-20">
            <Link
              href="/"
              className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/20 shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
          </div>

          <div className="absolute inset-0">
            <Image
              src="https://i.ibb.co/dJxBbFks/brandasset.png"
              alt="Brand Asset"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-purple-900/80 via-purple-900/20 to-transparent" />
            
            <div className="absolute bottom-12 left-12 right-12 z-10 space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Join the Hunt.</h2>
              <p className="text-white/70 text-lg">Discovery starts with a single step. Join 5,000+ developers today.</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form Space */}
        <div className="flex-1 p-8 md:p-14 lg:p-20 flex flex-col justify-center">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white leading-tight">Create Account</h1>
            <p className="text-slate-500 dark:text-muted-foreground text-lg">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline transition-all">
                Log in
              </Link>
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
