import React, { useState, useEffect } from "react";
import { useUpdateBookingStatusMutation } from "@/redux/api/bookingApi";
import { toast } from "sonner";
import { 
    X, 
    Save, 
    Loader2, 
    CheckCircle2, 
    CircleDashed, 
    XCircle,
    CreditCard,
    CalendarCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UpdateBookingStatusModalProps {
    bookingId: string;
    customerName: string;
    currentBookingStatus: string;
    currentPaymentStatus: string;
    isOpen: boolean;
    onClose: () => void;
}

const BOOKING_STATUSES = [
    { value: "pending", label: "Pending", icon: CircleDashed, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
    { value: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
];

const PAYMENT_STATUSES = [
    { value: "pending", label: "Pending", icon: CircleDashed, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
    { value: "completed", label: "Completed", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
    { value: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
];

export default function UpdateBookingStatusModal({ 
    bookingId, 
    customerName, 
    currentBookingStatus, 
    currentPaymentStatus, 
    isOpen, 
    onClose 
}: UpdateBookingStatusModalProps) {
    
    const [bookingStatus, setBookingStatus] = useState(currentBookingStatus);
    const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);

    const [updateStatus, { isLoading }] = useUpdateBookingStatusMutation();

    // Reset local state when modal opens or props change
    useEffect(() => {
        if (isOpen) {
            setBookingStatus(currentBookingStatus);
            setPaymentStatus(currentPaymentStatus);
        }
    }, [isOpen, currentBookingStatus, currentPaymentStatus]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await updateStatus({
                id: bookingId,
                status: {
                    booking: bookingStatus,
                    payment: paymentStatus,
                }
            }).unwrap();

            if (res.success) {
                toast.success("Booking status updated successfully!");
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update booking status");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={!isLoading ? onClose : undefined} 
            />
            
            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Update Status</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">
                            Modifying reservation for <span className="font-bold text-slate-700">{customerName}</span>
                        </p>
                    </div>
                    {!isLoading && (
                        <button 
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-900 bg-white shadow-sm border border-slate-100 rounded-xl hover:bg-slate-50 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    
                    {/* Booking Status Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <CalendarCheck className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold text-slate-800">Booking Status</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {BOOKING_STATUSES.map((status) => {
                                const Icon = status.icon;
                                const isSelected = bookingStatus === status.value;
                                const isLocked = currentBookingStatus.toLowerCase() === "cancelled" && status.value !== "cancelled";

                                return (
                                    <button
                                        type="button"
                                        key={status.value}
                                        disabled={isLocked}
                                        onClick={() => setBookingStatus(status.value)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                            isLocked && "opacity-50 cursor-not-allowed bg-slate-50",
                                            !isLocked && isSelected 
                                                ? `${status.bg} ${status.border} shadow-sm scale-[1.02]` 
                                                : !isLocked ? "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400" : ""
                                        )}
                                    >
                                        <Icon className={cn("w-6 h-6", isSelected ? status.color : "text-slate-400")} />
                                        <span className={cn(
                                            "font-bold text-sm tracking-wide",
                                            isSelected ? status.color : "text-slate-500"
                                        )}>
                                            {status.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100" />

                    {/* Payment Status Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold text-slate-800">Payment Status</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {PAYMENT_STATUSES.map((status) => {
                                const Icon = status.icon;
                                const isSelected = paymentStatus === status.value;
                                const isLocked = ("completed" === currentPaymentStatus.toLowerCase() || "cancelled" === currentPaymentStatus.toLowerCase()) && status.value !== currentPaymentStatus.toLowerCase();

                                return (
                                    <button
                                        type="button"
                                        key={status.value}
                                        disabled={isLocked}
                                        onClick={() => setPaymentStatus(status.value)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                            isLocked && "opacity-50 cursor-not-allowed bg-slate-50",
                                            !isLocked && isSelected 
                                                ? `${status.bg} ${status.border} shadow-sm scale-[1.02]` 
                                                : !isLocked ? "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400" : ""
                                        )}
                                    >
                                        <Icon className={cn("w-6 h-6", isSelected ? status.color : "text-slate-400")} />
                                        <span className={cn(
                                            "font-bold text-sm tracking-wide",
                                            isSelected ? status.color : "text-slate-500"
                                        )}>
                                            {status.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-50 flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex-[2] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {isLoading ? "Saving changes..." : "Save Status"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
