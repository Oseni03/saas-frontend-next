"use client";

import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignInFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onForgot: () => void;
}

export default function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  onForgot,
}: SignInFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="auth-email-in"
          className="text-[10px] font-mono uppercase tracking-wider text-foreground/75 font-semibold"
        >
          Email Destination <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <Input
            id="auth-email-in"
            type="email"
            required
            placeholder="e.g. ops@workspace.so"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 pl-10 bg-background text-xs font-mono rounded-none border-border"
          />
          <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label
            htmlFor="auth-pass-in"
            className="text-[10px] font-mono uppercase tracking-wider text-foreground/75 font-semibold"
          >
            Security Password <span className="text-primary">*</span>
          </label>
          <Button
            type="button"
            variant="link"
            size="xs"
            onClick={onForgot}
            className="text-[9px] font-mono text-primary uppercase tracking-widest h-auto p-0"
          >
            Forgot Token?
          </Button>
        </div>
        <div className="relative">
          <Input
            id="auth-pass-in"
            type="password"
            required
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 pl-10 bg-background text-xs font-mono rounded-none border-border"
          />
          <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
