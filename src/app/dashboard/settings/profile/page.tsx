"use client";

import { ChevronDown, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AvatarUpload } from "@/components/avatar-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMe, useUpdateMe } from "@/hooks/useAuth";
import { userService } from "@/lib/api-services";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { data: me, isLoading: meLoading } = useMe();
    const updateMe = useUpdateMe();

    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (!me) return;
        setFullName(me.full_name ?? "");
        setAvatarUrl(me.avatar_url ?? null);
    }, [me]);

    function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        updateMe.mutate(
            {
                full_name: fullName || null,
                avatar_url: avatarUrl,
            },
            {
                onSuccess: () => toast.success("Profile updated"),
                onError: () => toast.error("Failed to update profile"),
            },
        );
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setChangingPassword(true);
        try {
            await userService.changePassword({
                current_password: currentPassword,
                new_password: newPassword,
            });
            toast.success("Password changed");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch {
            toast.error("Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    }

    if (meLoading) {
        return (
            <div className="flex flex-1 items-center justify-center py-16">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Profile
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Manage your personal account settings.
                </p>
            </div>

            <form
                onSubmit={handleSaveProfile}
                className="flex flex-col gap-6 max-w-lg"
            >
                <div className="flex flex-col gap-4">
                    <Label>Avatar</Label>
                    <AvatarUpload
                        currentUrl={avatarUrl}
                        userName={fullName}
                        onUpload={(url) => setAvatarUrl(url)}
                        disabled={updateMe.isPending}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={me?.email ?? ""}
                        readOnly
                        className="text-muted-foreground cursor-not-allowed"
                    />
                    <p className="text-muted-foreground text-xs">
                        Email cannot be changed. Contact support if needed.
                    </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <Button
                        type="submit"
                        disabled={updateMe.isPending || updateMe.isSuccess}
                    >
                        {updateMe.isPending ? (
                            <Loader2 className="mr-1 size-4 animate-spin" />
                        ) : (
                            <Save className="mr-1 size-4" />
                        )}
                        Save changes
                    </Button>
                </div>
            </form>

            <div className="max-w-lg">
                <button
                    type="button"
                    onClick={() => setPasswordOpen(!passwordOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                    <ChevronDown
                        className={cn(
                            "size-4 transition-transform",
                            passwordOpen && "rotate-180",
                        )}
                    />
                    Change password
                </button>

                {passwordOpen && (
                    <form
                        onSubmit={handleChangePassword}
                        className="flex flex-col gap-4 mt-4"
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="currentPassword">
                                Current password
                            </Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="newPassword">New password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="confirmPassword">
                                Confirm new password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm new password"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={
                                    changingPassword ||
                                    !currentPassword ||
                                    !newPassword ||
                                    !confirmPassword
                                }
                            >
                                {changingPassword ? (
                                    <Loader2 className="mr-1 size-4 animate-spin" />
                                ) : null}
                                Update password
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
