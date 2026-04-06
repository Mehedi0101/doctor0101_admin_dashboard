"use client";

import React, { useState } from "react";
import { useCreateNotificationMutation } from "@/redux/api/notificationApi";
import { toast } from "sonner";
import { Send, Bell, Loader2, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SendNotificationPage() {
    const router = useRouter();
    const [createNotification, { isLoading }] = useCreateNotificationMutation();

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !message.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const res = await createNotification({ title, message }).unwrap();
            if (res.success) {
                toast.success("Notification sent successfully!");
                setTitle("");
                setMessage("");
                router.push("/notifications");
            }
        } catch (error: any) {
            console.error("Failed to send notification", error);
            toast.error(error?.data?.message || "Failed to send notification");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section with premium feel */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Send Notification</h1>
                    <p className="text-slate-500 mt-2 text-lg">Broadcast a message to all users on the platform.</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10">
                    <Bell className="w-8 h-8 text-primary animate-bounce-slow" />
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10">
                    <div className="space-y-8">
                        {/* Notification Title */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Notification Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Special Holiday Offer!"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* Notification Message */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Enter your message here..."
                                rows={8}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400 resize-none"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <Send className="w-6 h-6" />
                        )}
                        {isLoading ? "Sending Broadcast..." : "Send Notification"}
                    </button>
                </form>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
