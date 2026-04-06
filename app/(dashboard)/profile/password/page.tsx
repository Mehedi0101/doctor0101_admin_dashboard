"use client";

import React, { useState } from "react";
import { useChangePasswordMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import { 
    Lock, 
    Eye, 
    EyeOff, 
    ShieldCheck, 
    Loader2, 
    Save, 
    AlertCircle,
    Info,
    KeyRound,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChangePasswordPage() {
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    
    // Form State
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Visibility States
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleToggle = (field: 'old' | 'new' | 'confirm') => {
        if (field === 'old') setShowOld(!showOld);
        if (field === 'new') setShowNew(!showNew);
        if (field === 'confirm') setShowConfirm(!showConfirm);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Basic validation
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        // 2. Length validation
        if (formData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        // 3. Match validation
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Confirmation password does not match the new password");
            return;
        }

        // 4. API Request
        try {
            const res = await changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            }).unwrap();

            if (res.success) {
                toast.success("Password changed successfully!");
                setFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to change password. Please check your current password.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Change Password</h1>
                    <p className="text-slate-500 mt-2 text-lg">Secure your account by updating your login credentials.</p>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-red-50 to-amber-50 opacity-30"></div>
                
                <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                    <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
                        <div className="p-4 bg-red-50 rounded-3xl shadow-inner">
                            <Lock className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">Update Credentials</h3>
                            <p className="text-slate-500 font-medium tracking-tight">Verify your old password to set a new one.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Old Password */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input 
                                    type={showOld ? "text" : "password"}
                                    value={formData.oldPassword}
                                    onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                                    className="w-full pl-14 pr-16 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                    placeholder="Enter current password"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => handleToggle('old')}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <input 
                                    type={showNew ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                    className="w-full pl-14 pr-16 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                    placeholder="At least 6 characters"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => handleToggle('new')}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <input 
                                    type={showConfirm ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    className="w-full pl-14 pr-16 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                    placeholder="Repeat new password"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => handleToggle('confirm')}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                <p className="text-xs font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
                                    Passwords do not match
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-10 flex border-t border-slate-50">
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isLoading ? "Updating Password..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
