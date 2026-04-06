"use client";

import React from "react";
import { toast } from "sonner";
import { 
    X, 
    Trash2, 
    AlertTriangle,
    Loader2
} from "lucide-react";

interface ConfirmDeleteNotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title: string;
    description: string;
    isLoading: boolean;
}

export default function ConfirmDeleteNotificationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description, 
    isLoading 
}: ConfirmDeleteNotificationModalProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={!isLoading ? onClose : undefined} 
            />
            
            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                
                <div className="p-10 space-y-8 text-center">
                    {/* Warning Icon Cluster */}
                    <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                        <div className="absolute inset-0 bg-red-50 rounded-full animate-ping opacity-20" />
                        <div className="relative w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Actions Area */}
                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="bg-red-500 text-white w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-red-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                            {isLoading ? "Deleting..." : "Confirm Deletion"}
                        </button>
                        
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full py-4 text-slate-400 font-bold hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Close Button UI */}
                {!isLoading && (
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
