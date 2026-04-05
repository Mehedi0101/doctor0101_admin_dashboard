"use client";

import React from "react";
import { useGetAllTransportsQuery } from "@/redux/api/transportApi";
import Link from "next/link";
import { 
    Plus, 
    Bus, 
    Search, 
    Filter, 
    MoreHorizontal,
    MapPin,
    Clock,
    Users,
    Navigation,
    DollarSign,
    Edit2,
    Trash2,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import EditTransferModal from "@/components/modals/EditTransferModal";
import ConfirmDeleteTransferModal from "@/components/modals/ConfirmDeleteTransferModal";

export default function AllTransfersPage() {
    const [selectedTransferId, setSelectedTransferId] = React.useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [transferToDelete, setTransferToDelete] = React.useState<{ id: string; title: string } | null>(null);

    const { data: response, isLoading, isError, refetch } = useGetAllTransportsQuery();
    const transports = response?.data || [];

    if (isLoading) {
        return <TransfersSkeleton />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Transfer Services</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your fleet and airport transfer routes.</p>
                </div>
                <Link
                    href="/transfers/add"
                    className="bg-primary text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add New Service
                </Link>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Service</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Route (Pickup → Drop)</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Duration</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Capacity</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Price</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transports.map((transport, idx) => (
                                <tr 
                                    key={transport._id} 
                                    className={cn(
                                        "group border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-all",
                                        idx % 2 !== 0 && "bg-slate-50/10"
                                    )}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0 group-hover:scale-105 transition-transform duration-300">
                                                <img 
                                                    src={(transport as any).image || "/placeholder-car.png"} 
                                                    alt={transport.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{transport.title}</h4>
                                                <div className="flex items-center gap-2 text-slate-400 mt-1">
                                                    <Bus className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">{transport.vehicleModel}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="text-sm font-bold text-slate-700">{transport.pickup}</span>
                                            </div>
                                            <div className="ml-[7px] w-0.5 h-3 border-l-2 border-dotted border-slate-200" />
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                                <span className="text-sm font-black text-slate-900">{transport.destination}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                                            <span className="text-xs font-black text-slate-700 whitespace-nowrap">{transport.duration}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-1">
                                                <Users className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-xs font-black text-slate-900">{transport.capacity} Pax</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total cost</span>
                                            <span className="text-lg font-black text-slate-900">${transport.price}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2 transition-all">
                                            <button 
                                                onClick={() => {
                                                    setSelectedTransferId(transport._id!);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="p-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all border border-transparent hover:border-primary/10"
                                                title="Edit Service"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setTransferToDelete({ id: transport._id!, title: transport.title });
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                                title="Remove Service"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {transports.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-400">
                                            <Bus className="w-12 h-12 opacity-20" />
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold text-slate-600">No transfer services found</p>
                                                <p className="text-sm font-medium">Start by onboarding your first fleet vehicle and route.</p>
                                            </div>
                                            <Link
                                                href="/transfers/add"
                                                className="mt-2 text-primary font-bold hover:underline underline-offset-4 flex items-center gap-2"
                                            >
                                                Create your first service <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {selectedTransferId && (
                <EditTransferModal
                    transferId={selectedTransferId}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedTransferId(null);
                    }} 
                />
            )}

            {/* Delete Modal */}
            {transferToDelete && (
                <ConfirmDeleteTransferModal
                    transferId={transferToDelete.id}
                    transferTitle={transferToDelete.title}
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setTransferToDelete(null);
                    }}
                />
            )}
        </div>
    );
}

function TransfersSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-3">
                    <div className="h-10 w-64 bg-slate-200 rounded-2xl" />
                    <div className="h-4 w-48 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-12 w-40 bg-slate-200 rounded-2xl" />
            </div>
            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-28 bg-slate-100 rounded-[2rem]" />
                ))}
            </div>
            <div className="h-[600px] bg-slate-50 rounded-[2.5rem]" />
        </div>
    );
}
