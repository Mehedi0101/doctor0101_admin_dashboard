"use client";

import React, { useState } from "react";
import { useGetAllBookingsQuery } from "@/redux/api/bookingApi";
import {
    Search,
    Filter,
    MapPin,
    Clock,
    Users,
    CalendarDays,
    Edit2,
    Trash2,
    Bus,
    ChevronLeft,
    ChevronRight,
    CircleDashed,
    CheckCircle2,
    XCircle,
    CalendarCheck,
    Ticket,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import UpdateBookingStatusModal from "@/components/modals/UpdateBookingStatusModal";
import ConfirmDeleteBookingModal from "@/components/modals/ConfirmDeleteBookingModal";

export default function AllBookingsPage() {
    // State
    const [page, setPage] = useState(1);
    const limit = 10;
    
    // Search State
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Modal State
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<{
        id: string;
        customerName: string;
        bookingStatus: string;
        paymentStatus: string;
    } | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<{
        id: string;
        customerName: string;
    } | null>(null);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page when search changes
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: response, isLoading, isError, isFetching } = useGetAllBookingsQuery({ 
        page, 
        limit,
        ...(debouncedSearch && { searchText: debouncedSearch })
    });

    const bookings = response?.data || [];
    const meta = response?.meta;
    const summary = response?.summary;

    const handlePreviousPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNextPage = () => {
        if (meta && page < meta.totalPage) setPage(p => p + 1);
    };

    const getStatusPill = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-black uppercase tracking-widest text-[10px]">Confirmed</span>
                    </div>
                );
            case "cancelled":
                return (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100">
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-black uppercase tracking-widest text-[10px]">Cancelled</span>
                    </div>
                );
            case "pending":
            default:
                return (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                        <CircleDashed className="w-3.5 h-3.5" />
                        <span className="text-xs font-black uppercase tracking-widest text-[10px]">Pending</span>
                    </div>
                );
        }
    };

    if (isLoading) {
        return <BookingsSkeleton />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Booking Operations</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and monitor all customer reservations.</p>
                </div>
            </div>

            {/* Stats Overview */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                            <Ticket className="w-7 h-7 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Bookings</p>
                            <h3 className="text-2xl font-black text-slate-900">{summary.totalCount}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center relative z-10">
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-black text-emerald-600/70 uppercase tracking-widest">Confirmed</p>
                            <h3 className="text-2xl font-black text-slate-900">{summary.confirmedCount}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                            <CircleDashed className="w-7 h-7 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-amber-600/70 uppercase tracking-widest">In Progress</p>
                            <h3 className="text-2xl font-black text-slate-900">{summary.inProgressCount}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                            <XCircle className="w-7 h-7 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-red-600/70 uppercase tracking-widest">Cancelled</p>
                            <h3 className="text-2xl font-black text-slate-900">{summary.cancelledCount}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by customer name..."
                            className="w-full pl-11 pr-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/5 outline-none font-medium transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto relative">
                    {isFetching && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center animate-in fade-in">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    )}
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Customer & Service</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Booking Date</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status & Payment</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Trip Specifics</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {bookings.map((booking, idx) => (
                                <tr
                                    key={booking._id}
                                    className={cn(
                                        "group border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-all",
                                        idx % 2 !== 0 && "bg-slate-50/10"
                                    )}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <CustomerAvatar 
                                                src={booking.customerImage} 
                                                name={booking.customerName || "Customer"} 
                                            />
                                            <div>
                                                <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1 text-base">{booking.customerName}</h4>
                                                <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                                                    <span className="text-xs font-bold truncate max-w-[150px]">{booking.title || "Deleted Service"}</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md text-slate-400">ID: ...{booking._id.slice(-6)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <CalendarDays className="w-4 h-4 text-primary" />
                                                <span className="font-bold">{dayjs(booking.bookingDate).format("MMM DD, YYYY")}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{dayjs(booking.bookingDate).format("hh:mm A")}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2 items-start">
                                            {getStatusPill(booking.bookingStatus)}
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pay:</span>
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest",
                                                    booking.paymentStatus === "completed" ? "text-emerald-600" : 
                                                    booking.paymentStatus === "pending" ? "text-amber-600" : "text-red-500"
                                                )}>{booking.paymentStatus}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            {booking.pickup && booking.destination && (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                                        <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{booking.pickup}</span>
                                                    </div>
                                                    <div className="ml-[7px] w-0.5 h-2 border-l-2 border-dotted border-slate-200" />
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{booking.destination}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {booking.totalPassengers && (
                                                <div className="flex items-center gap-3 pt-1">
                                                    <div className="flex items-center gap-1 text-slate-500">
                                                        <Users className="w-3 h-3" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{booking.totalPassengers} Pax</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-slate-500">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">${booking.price}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2 transition-all">
                                            <button 
                                                onClick={() => {
                                                    setSelectedBooking({
                                                        id: booking._id,
                                                        customerName: booking.customerName || "Customer",
                                                        bookingStatus: booking.bookingStatus,
                                                        paymentStatus: booking.paymentStatus,
                                                    });
                                                    setIsUpdateModalOpen(true);
                                                }}
                                                className="p-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all border border-transparent hover:border-primary/10"
                                                title="Update Status"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setBookingToDelete({
                                                        id: booking._id,
                                                        customerName: booking.customerName || "Customer",
                                                    });
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                                title="Remove Booking"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-400">
                                            <CalendarCheck className="w-12 h-12 opacity-20" />
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold text-slate-600">No bookings found</p>
                                                <p className="text-sm font-medium">When customers make reservations, they will appear here.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {meta && bookings.length > 0 && (
                    <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="text-sm font-bold text-slate-500">
                            Showing page <span className="text-slate-900">{meta.page}</span> of <span className="text-slate-900">{meta.totalPage}</span>
                            <span className="mx-2 text-slate-300">|</span>
                            Total <span className="text-slate-900">{meta.total}</span> bookings
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={meta.page <= 1}
                                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={meta.page >= meta.totalPage}
                                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedBooking && (
                <UpdateBookingStatusModal
                    bookingId={selectedBooking.id}
                    customerName={selectedBooking.customerName}
                    currentBookingStatus={selectedBooking.bookingStatus}
                    currentPaymentStatus={selectedBooking.paymentStatus}
                    isOpen={isUpdateModalOpen}
                    onClose={() => {
                        setIsUpdateModalOpen(false);
                        setSelectedBooking(null);
                    }}
                />
            )}

            {bookingToDelete && (
                <ConfirmDeleteBookingModal
                    bookingId={bookingToDelete.id}
                    customerName={bookingToDelete.customerName}
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setBookingToDelete(null);
                    }}
                />
            )}
        </div>
    );
}

function BookingsSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-3">
                    <div className="h-10 w-64 bg-slate-200 rounded-2xl" />
                    <div className="h-4 w-48 bg-slate-100 rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-28 bg-slate-100 rounded-[2rem]" />
                ))}
            </div>
            <div className="h-[600px] bg-slate-50 rounded-[2.5rem]" />
        </div>
    );
}

function CustomerAvatar({ src, name }: { src?: string; name: string }) {
    const [hasError, setHasError] = useState(false);
    
    if (!src || hasError) {
        return (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <span className="text-lg font-black text-primary">
                    {name?.charAt(0).toUpperCase() || "?"}
                </span>
            </div>
        );
    }
    
    return (
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-sm">
            <img 
                src={src} 
                alt={name}
                onError={() => setHasError(true)}
                className="w-full h-full object-cover"
            />
        </div>
    );
}

