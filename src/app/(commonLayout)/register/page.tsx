import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "./_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex items-center justify-center py-10 px-4 mt-8">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/40">
        
        {/* Left Panel */}
        <div className="flex-1 relative overflow-hidden md:block hidden min-h-[600px]">
          <div className="absolute top-6 left-6 z-10">
            <Link
              href="/"
              className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-all border border-white/10"
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

            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent mix-blend-multiply" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create an Account</h1>
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
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
