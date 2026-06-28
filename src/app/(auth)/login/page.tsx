"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import SignInForm from "@/components/auth/signin-form";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => router.push(redirectTo),
        onError: (error: any) => {
          setFormError(
            error?.response?.data?.error ||
              error?.response?.data?.detail ||
              "Invalid email or password.",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-foreground/50 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        <div className="bg-muted p-8 md:p-10">
          <div className="flex items-center gap-1.5 select-none text-[10px] font-mono text-primary font-bold uppercase tracking-wider mb-6">
            <span className="w-2.5 h-2.5 border border-primary flex items-center justify-center text-[7px]">
              I
            </span>
            <span>Index Identity Proxy // Node-v6</span>
          </div>

          <h1 className="text-foreground text-2xl md:text-3xl font-display font-bold tracking-tight">
            Sign In
          </h1>
          <p className="text-foreground/60 text-xs font-mono uppercase mt-1 mb-8">
            // WELCOME BACK
          </p>

          {formError && (
            <div className="mb-6 p-3 border border-red-800 bg-red-500/5 text-red-600 dark:text-red-400 font-mono text-[11px] leading-relaxed">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <SignInForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onForgot={() => router.push("/forgot-password")}
            />

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 font-mono text-xs uppercase tracking-widest rounded-none mt-4"
            >
              {loginMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="border-t border-border mt-8 pt-5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-foreground/50">
              Don&apos;t have an account?
            </span>
            <Link
              href="/signup"
              className="text-primary hover:underline font-bold uppercase"
            >
              Sign Up &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
