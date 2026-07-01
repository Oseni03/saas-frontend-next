"use client";

import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ForgotPasswordFormProps {
    email: string;
    setEmail: (value: string) => void;
}

export default function ForgotPasswordForm({
    email,
    setEmail,
}: ForgotPasswordFormProps) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-xs text-foreground/70 leading-relaxed font-sans bg-card p-3.5">
                Specify your registered email address below. We will dispatch an
                automated validation hex-token to revert credentials of your
                identity profile.
            </p>
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="auth-email-forgot"
                    className="text-[10px] font-mono uppercase tracking-wider text-foreground/75 font-semibold"
                >
                    Target Email Destination{" "}
                    <span className="text-primary">*</span>
                </label>
                <div className="relative">
                    <Input
                        id="auth-email-forgot"
                        type="email"
                        required
                        placeholder="ops@index.so"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 pl-10 bg-card text-xs font-mono rounded-none"
                    />
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
