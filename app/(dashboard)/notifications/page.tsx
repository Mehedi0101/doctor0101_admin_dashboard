"use client";

import React, { useState } from "react";
import { useGetAllNotificationsQuery, useDeleteNotificationMutation } from "@/redux/api/notificationApi";
import { Bell, Trash2, Loader2, Calendar, MessageSquare, Inbox, Search } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "sonner";
import ConfirmDeleteNotificationModal from "@/components/modals/ConfirmDeleteNotificationModal";

export default function AllNotificationsPage() {
    const { data: response, isLoading, isFetching } = useGetAllNotificationsQuery();
    const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNotification, setSelectedNotification] = useState<{ id: string; title: string } | null>(null);

    const notifications = response?.data || [];

    const filteredNotifications = notifications.filter((n: any) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async () => {
        if (!selectedNotification) return;
        try {
            const res = await deleteNotification(selectedNotification.id).unwrap();
            if (res.success) {
                toast.success("Notification deleted successfully");
                setSelectedNotification(null);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete notification");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Notification History</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage all broadcasted messages and alerts.</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10">
                    <Inbox className="w-8 h-8 text-primary" />
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search notifications..."
                    className="w-full pl-11 pr-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/5 outline-none font-medium transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Content Area */}
            {isLoading || isFetching ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Bell className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">No notifications found</h3>
                    <p className="text-slate-500 mt-2 font-medium max-w-sm">
                        {searchTerm ? "No results match your search." : "Broadcast history is currently empty."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredNotifications.map((n: any) => (
                        <div
                            key={n._id}
                            className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                                        <Bell className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-slate-900 leading-tight">{n.title}</h3>
                                        <p className="text-slate-600 leading-relaxed font-medium">{n.message}</p>
                                        <div className="flex items-center gap-6 mt-4 text-sm font-bold text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary/60" />
                                                <span>{dayjs(n.createdAt).format("MMM D, YYYY • h:mm A")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-primary/60" />
                                                <span>Sent to all users</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => setSelectedNotification({ id: n._id, title: n.title })}
                                    className="p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteNotificationModal
                isOpen={!!selectedNotification}
                onClose={() => setSelectedNotification(null)}
                onConfirm={handleDelete}
                title="Delete Notification"
                description={`Are you sure you want to delete "${selectedNotification?.title}"? This will remove it from all users' feeds.`}
                isLoading={isDeleting}
            />
        </div>
    );
}
