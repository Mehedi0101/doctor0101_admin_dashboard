"use client";

import React, { useState, useEffect } from "react";
import { useGetHomeContentQuery, useUpdateContactNowMutation } from "@/redux/api/homeContentApi";
import { toast } from "sonner";
import {
    Save,
    Image as ImageIcon,
    Phone,
    Type,
    AlignLeft,
    Upload,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactNowPage() {
    const { data: homeData, isLoading: isFetching } = useGetHomeContentQuery();
    const [updateContactNow, { isLoading: isUpdating }] = useUpdateContactNowMutation();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        contactNo: "",
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Sync form data when data is fetched
    useEffect(() => {
        if (homeData?.data?.contactNowCard) {
            const card = homeData.data.contactNowCard;
            setFormData({
                title: card.title || "",
                description: card.description || "",
                contactNo: card.contactNo || "",
            });
            setImagePreview(card.backgroundImage || null);
        }
    }, [homeData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const submitData = new FormData();
            submitData.append("title", formData.title);
            submitData.append("description", formData.description);
            submitData.append("contactNo", formData.contactNo);
            if (selectedImage) {
                submitData.append("image", selectedImage);
            }

            const res = await updateContactNow(submitData).unwrap();
            if (res.success) {
                toast.success("Contact Now section updated successfully!");
                setSelectedImage(null);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update section");
        }
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-medium italic">Loading content preferences...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Now Management</h1>
                    <p className="text-slate-500 mt-2">Customize the "Contact Now" call-to-action card on your homepage.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                            <Type className="w-4 h-4 text-primary" />
                            Card Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g. Need help with your booking?"
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                            <AlignLeft className="w-4 h-4 text-primary" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="e.g. Our team is available 24/7 to assist you..."
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium resize-none"
                            required
                        />
                    </div>

                    {/* Contact Number Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                            <Phone className="w-4 h-4 text-primary" />
                            Contact Number
                        </label>
                        <input
                            type="text"
                            name="contactNo"
                            value={formData.contactNo}
                            onChange={handleInputChange}
                            placeholder="e.g. +1 (234) 567-890"
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                            required
                        />
                    </div>

                    {/* Background Image Upload */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            Background Image
                        </label>
                        <div className="relative group">
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                                <Upload className="w-8 h-8 text-slate-400 group-hover:text-primary mb-2 transition-colors" />
                                <span className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">
                                    {selectedImage ? selectedImage.name : "Click to upload new image"}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Max 5MB • JPG, PNG</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className={cn(
                            "w-full bg-primary text-white rounded-2xl py-4 font-extrabold hover:bg-primary-hover transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed",
                            isUpdating && "animate-pulse"
                        )}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>Updating Content...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-6 h-6" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Preview Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 ml-2">Live Preview</h3>
                    <div className="relative w-full aspect-[16/10] bg-slate-100 rounded-[20px] overflow-hidden shadow-2xl shadow-slate-300">
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                            style={{
                                backgroundImage: `url(${imagePreview || '/placeholder-cta.jpg'})`,
                            }}
                        />

                        {/* Dark Gradient Overlay (matching Flutter: bottom 0.85 to top 0.10) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                        {/* Content (matching Flutter Positioned bottom:0 with padding 16) */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                            {/* TITLE (17.sp, bold, 1.4 height) */}
                            <h2 className="text-[17px] font-bold leading-[1.4] line-clamp-2">
                                {formData.title || "Your Title Here"}
                            </h2>

                            {/* SUBTITLE (11.sp, 0.95 alpha, 8.h space) */}
                            <p className="text-[11px] text-white/95 mt-2 line-clamp-3">
                                {formData.description || "Your description will appear here as the subtitle."}
                            </p>

                            {/* BUTTON (125.w, 100.r, 0D6EFD color, 12.h space) */}
                            <div className="mt-3">
                                <div className="inline-flex items-center justify-center w-[125px] py-[10px] px-[20px] bg-[#0D6EFD] rounded-full shadow-lg">
                                    <span className="text-[14px] font-semibold text-white whitespace-nowrap">
                                        Contact Now
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
