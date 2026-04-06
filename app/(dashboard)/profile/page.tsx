"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetMeQuery, useUpdateProfileMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import {
    User,
    Mail,
    Shield,
    Camera,
    Loader2,
    Save,
    UserCircle,
    Venus,
    Mars,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MyProfilePage() {
    const { data: response, isLoading: isFetching } = useGetMeQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        gender: "" as "male" | "female" | "",
    });

    useEffect(() => {
        if (response?.data) {
            setFormData({
                name: response.data.name || "",
                gender: response.data.gender || "",
            });
        }
    }, [response]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updateData = new FormData();
        updateData.append("name", formData.name);
        if (formData.gender) updateData.append("gender", formData.gender);
        if (selectedFile) updateData.append("image", selectedFile);

        try {
            const res = await updateProfile(updateData).unwrap();
            if (res.success) {
                toast.success("Profile updated successfully!");
                setPreviewImage(null);
                setSelectedFile(null);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update profile");
        }
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-500 font-medium mt-4 animate-pulse">Loading your profile...</p>
            </div>
        );
    }

    const user = response?.data;

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage your personal information and account settings.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Avatar & Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-indigo-500/10"></div>

                        <div className="relative z-10 mt-4">
                            <div className="relative inline-block group">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-50 mx-auto transition-transform duration-500 group-hover:scale-105">
                                    {(previewImage || user?.image) ? (
                                        <img
                                            src={previewImage || user?.image}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                            <UserCircle className="w-20 h-20 text-primary/20" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-1 right-1 p-2.5 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover active:scale-90 transition-all z-20"
                                    title="Upload Photo"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div className="mt-6 space-y-1">
                                <h2 className="text-2xl font-black text-slate-900 capitalize">{user?.name}</h2>
                                <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
                                    <Shield className={cn("w-4 h-4", user?.role === 'admin' ? "text-primary" : "text-slate-400")} />
                                    <span>{user?.role?.toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-8">
                            <div className="p-3 bg-primary/5 rounded-2xl">
                                <User className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">Personal Information</h3>
                                <p className="text-slate-500 font-medium">Update your display information and preferences.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Gender Preference</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        {formData.gender === 'male' && <Mars className="w-5 h-5" />}
                                        {formData.gender === 'female' && <Venus className="w-5 h-5" />}
                                        {!formData.gender && <UserCircle className="w-5 h-5" />}
                                    </div>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800 appearance-none"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <Loader2 className="w-4 h-4" /> {/* Just a placeholder for dropdown arrow if needed, but standard select usually has it */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 opacity-60">
                                <label className="text-sm font-bold text-slate-700 ml-1">Account Role</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={user?.role?.toUpperCase()}
                                        readOnly
                                        className="w-full pl-14 pr-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl outline-none font-bold text-slate-600 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 tracking-tighter">Read-only field</p>
                            </div>

                            <div className="space-y-3 opacity-60">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={user?.email}
                                        readOnly
                                        className="w-full pl-14 pr-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl outline-none font-bold text-slate-600 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 tracking-tighter">Unique Identifier • Read-only</p>
                            </div>
                        </div>

                        <div className="pt-10 flex border-t border-slate-50">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="flex-1 md:flex-none md:min-w-[240px] bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isUpdating ? "Saving Updates..." : "Save Profile Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
