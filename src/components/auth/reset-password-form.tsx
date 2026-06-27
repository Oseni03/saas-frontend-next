"use client";

import { Key, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ResetPasswordFormProps {
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
}

export default function ResetPasswordForm({
  verificationCode,
  setVerificationCode,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: ResetPasswordFormProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="auth-verify-reset"
          className="text-[10px] font-mono uppercase tracking-wider text-foreground/75 font-semibold"
        >
          Validation Hex Token (6-digit code){" "}
          <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <Input
            id="auth-verify-reset"
            type="text"
            required
            maxLength={6}
            placeholder="e.g. 5F832A"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="h-11 pl-10 bg-card text-xs font-mono rounded-none uppercase"
          />
          <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="auth-new-pass"
          className="text-[10px] font-mono uppercase tracking-wider text-foreground/75 font-semibold"
        >
          Compile New Security Password <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <Input
            id="auth-new-pass"
            type="password"
            required
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 pl-10 bg-card text-xs font-mono rounded-none"
          />
          <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="auth-confirm-pass"
          className="text-[10px] font-mono uppercase tracking-wider text-foreground/75 font-semibold"
        >
          Confirm Password Parity <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <Input
            id="auth-confirm-pass"
            type="password"
            required
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 pl-10 bg-card text-xs font-mono rounded-none"
          />
          <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
