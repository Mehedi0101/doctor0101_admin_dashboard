"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";
import { Lock, Mail, Loader2, Eye, EyeOff, Stethoscope } from "lucide-react";
import GuestGuard from "@/components/auth/GuestGuard";
import { setCredentials } from "@/store/slices/authSlice";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login({ email, password }).unwrap();
            if (result.success) {
                // Dispatch both user and token to the store
                dispatch(setCredentials({
                    user: result.data.user,
                    token: result.data.accessToken
                }));

                toast.success("Welcome back, Admin!");
                router.push("/");
            }
        } catch (err: any) {
            toast.error(err.data?.message || "Login failed. Check your credentials.");
        }
    };

    return (
        <GuestGuard>
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <img
                            src="/logo3.png"
                            alt="PuntaGo Logo"
                            className="w-32 h-auto object-contain mb-2"
                        />
                        <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">Admin Portal</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                                    placeholder="admin@puntago.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" /> : <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-semibold bg-primary hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-slate-400 text-sm">
                    © 2026 PuntaGo. All rights reserved.
                </p>
            </div>
        </GuestGuard>
    );
}
