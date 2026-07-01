"use client";

import { User, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SignUpFormProps {
    name: string;
    setName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
}

export default function SignUpForm({
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
}: SignUpFormProps) {
    return (
        <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="auth-name-up"
                    className="text-[10px] font-mono uppercase tracking-wider text-foreground/75 font-semibold"
                >
                    Legal Name / Workspace Owner{" "}
                    <span className="text-primary">*</span>
                </label>
                <div className="relative">
                    <Input
                        id="auth-name-up"
                        type="text"
                        required
                        placeholder="Alice Sterling"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 pl-10 bg-card text-xs font-mono rounded-none"
                    />
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="auth-email-up"
                    className="text-[10px] font-mono uppercase tracking-wider text-foreground/75 font-semibold"
                >
                    System Account Email <span className="text-primary">*</span>
                </label>
                <div className="relative">
                    <Input
                        id="auth-email-up"
                        type="email"
                        required
                        placeholder="alice@index.so"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 pl-10 bg-card text-xs font-mono rounded-none"
                    />
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="auth-pass-up"
                    className="text-[10px] font-mono uppercase tracking-wider text-foreground/75 font-semibold"
                >
                    Master Password <span className="text-primary">*</span>
                </label>
                <div className="relative">
                    <Input
                        id="auth-pass-up"
                        type="password"
                        required
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 pl-10 bg-card text-xs font-mono rounded-none"
                    />
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
