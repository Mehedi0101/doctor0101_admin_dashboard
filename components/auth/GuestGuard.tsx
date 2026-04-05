"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const { user, isInitialized } = useAppSelector((state) => state.auth);
    const token = useAppSelector((state) => state.auth.token);
    const router = useRouter();

    useEffect(() => {
        // Only redirect after initialization — prevents premature redirect on cold load
        if (isInitialized && user && token) {
            router.replace("/");
        }
    }, [isInitialized, user, token, router]);

    // 1. Not initialized yet — session check in progress, don't show login page yet
    if (!isInitialized) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    // 2. Initialized and user exists — redirect in progress, show spinner not the login form
    if (user && token) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    // 3. Not authenticated — show login page
    return <>{children}</>;
}
