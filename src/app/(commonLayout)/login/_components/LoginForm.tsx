"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, User as UserIcon, ShieldCheck, Crown, Sparkles } from "lucide-react";
import { AuthService } from "@/services/auth/auth.service";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  {
    role: "User",
    email: "user1@gmail.com",
    password: "password123",
    icon: UserIcon,
    badgeClass: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
  },
  {
    role: "Moderator",
    email: "moderator@gmail.com",
    password: "password123",
    icon: ShieldCheck,
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  },
  {
    role: "Admin",
    email: "devadmin@gmail.com",
    password: "Admin12345",
    icon: Crown,
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
  },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleDemoLogin(email: string, password: string, roleName: string) {
    form.setValue("email", email);
    form.setValue("password", password);
    toast.info(`Signing in as ${roleName}...`);
    await onSubmit({ email, password });
  }

  async function onSubmit(data: LoginFormValues) {
    setLoading(true);
    try {
      await AuthService.login(data);
      toast.success("Login successful!");
      await checkSession();

      const callback = searchParams.get("callback");
      if (callback && callback.startsWith("/")) {
        router.push(callback);
      } else {
        router.push("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to login. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Demo Credentials Section */}
      <div className="rounded-xl border border-border bg-muted/40 p-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Quick Demo Login</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((acc) => {
            const Icon = acc.icon;
            return (
              <button
                key={acc.role}
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin(acc.email, acc.password, acc.role)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-colors ${acc.badgeClass} disabled:opacity-50 cursor-pointer`}
              >
                <Icon className="w-3.5 h-3.5 mb-1" />
                <span>{acc.role}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <span className="relative bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Or with credentials
        </span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" type="email" className="h-10 text-sm" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10 h-10 text-sm"
                      {...field}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
