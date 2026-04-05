"use client";

import React from "react";
import { useDeleteTransportMutation } from "@/redux/api/transportApi";
import { toast } from "sonner";
import { 
    X, 
    Trash2, 
    AlertTriangle,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDeleteTransferModalProps {
    transferId: string;
    transferTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ConfirmDeleteTransferModal({ transferId, transferTitle, isOpen, onClose }: ConfirmDeleteTransferModalProps) {
    const [deleteTransport, { isLoading: isDeleting }] = useDeleteTransportMutation();

    const handleDelete = async () => {
        try {
            const res = await deleteTransport(transferId).unwrap();
            if (res.success) {
                toast.success(`Successfully removed "${transferTitle}"`);
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to delete "${transferTitle}"`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={!isDeleting ? onClose : undefined} 
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
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Confirm Removal</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Are you absolutely sure you want to remove <br /> 
                            <span className="text-red-500 font-black italic">"{transferTitle}"</span>?
                        </p>
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-left animate-in slide-in-from-top-2 duration-500">
                            <Trash2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                                This is a destructive action but it is reversible by the tech team. 
                                The transfer route and vehicle will be hidden from all dashboards immediately.
                            </p>
                        </div>
                    </div>

                    {/* Actions Area */}
                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-500 text-white w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-red-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50"
                        >
                            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                            {isDeleting ? "Deleting Service..." : "Confirm Deletion"}
                        </button>
                        
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="w-full py-4 text-slate-400 font-bold hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                        >
                            No, Keep it for Now
                        </button>
                    </div>
                </div>

                {/* Close Button UI */}
                {!isDeleting && (
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
