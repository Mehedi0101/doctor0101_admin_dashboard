"use client";

import React from "react";
import { useGetAllToursQuery } from "@/redux/api/tourApi";
import Link from "next/link";
import {
    Plus,
    Search,
    MapPin,
    Clock,
    Users,
    Star,
    Edit2,
    Trash2,
    MoreHorizontal,
    Globe,
    Calendar,
    ArrowRight,
    Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AllToursPage() {
    const { data: response, isLoading, isError, refetch } = useGetAllToursQuery();
    const tours = response?.data || [];

    if (isLoading) {
        return <ToursSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-slate-100 shadow-sm p-12">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <Globe className="w-10 h-10 text-red-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-slate-500 mb-8 max-w-md text-center font-medium">
                    We couldn't load the tour packages. Please check your connection and try again.
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Tour Management</h1>
                    <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                        Total Packages: <span className="text-primary font-black px-2.5 py-0.5 bg-primary/10 rounded-full text-xs">{tours.length}</span>
                    </p>
                </div>
                <Link
                    href="/tours/add"
                    className="bg-primary text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Tour</span>
                </Link>
            </div>

            {/* Tours Table Section */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                {tours.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Package Details</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Duration</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Spots Left</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Contacts</th>
                                    <th className="px-8 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tours.map((tour, idx) => (
                                    <tr
                                        key={tour._id}
                                        className={cn(
                                            "group border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-all",
                                            idx % 2 !== 0 && "bg-slate-50/10"
                                        )}
                                    >
                                        {/* Package Info */}
                                        <td className="px-8 py-6 max-w-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                    <img
                                                        src={tour.image || "/placeholder-tour.jpg"}
                                                        alt={tour.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5 min-w-0">
                                                    <span className="font-extrabold text-slate-900 group-hover:text-primary transition-colors truncate text-lg">
                                                        {tour.title}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="text-xs font-bold truncate tracking-tight">{tour.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Duration */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Clock className="w-4 h-4 text-primary/70" />
                                                <span className="text-sm font-black uppercase tracking-tight">{tour.duration}</span>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                tour.type === "group"
                                                    ? "bg-primary/5 text-primary border-primary/20"
                                                    : "bg-indigo-50 text-indigo-600 border-indigo-100"
                                            )}>
                                                {tour.type}
                                            </span>
                                        </td>

                                        {/* Spots Left */}
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-lg w-max border font-black text-xs tracking-tight transition-all",
                                                Number(tour.availableSpot) > 0
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-red-50 text-red-600 border-red-100"
                                            )}>
                                                <Users className="w-3.5 h-3.5" />
                                                <span>{tour.availableSpot ?? 0} Left</span>
                                            </div>
                                        </td>

                                        {/* Contacts */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg w-max border border-slate-200/50">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span className="text-[11px] font-black tracking-tight">{tour.contactNo}</span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    disabled
                                                    className="p-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                                                    title="Edit Package"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    disabled
                                                    className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                                    title="Delete Package"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyTours />
                )}
            </div>
        </div>
    );
}

function ToursSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
                <div className="space-y-3">
                    <div className="h-10 w-64 bg-slate-100 rounded-2xl" />
                    <div className="h-5 w-40 bg-slate-50 rounded-full" />
                </div>
                <div className="h-14 w-48 bg-slate-100 rounded-2xl" />
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm h-[60vh]" />
        </div>
    );
}

function EmptyTours() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center p-8 bg-white rounded-3xl">
            <div className="relative mb-8">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                    <Globe className="w-12 h-12 text-slate-200" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center animate-bounce">
                    <Plus className="w-4 h-4 text-white" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Tour Packages Yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm font-medium leading-relaxed">
                Start by creating your first tour package to showcase your agency's offerings here.
            </p>
            <Link
                href="/tours/add"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.03] transition-transform active:scale-[0.97]"
            >
                Create First Package <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
