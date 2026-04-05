"use client";

import React, { useEffect, useState } from "react";
import { useGetSingleTourQuery, useUpdateTourMutation } from "@/redux/api/tourApi";
import { toast } from "sonner";
import { 
    Save, 
    MapPin, 
    Clock, 
    Users, 
    Globe, 
    CheckCircle2, 
    Plus, 
    X, 
    Image as ImageIcon,
    Upload,
    Loader2,
    Calendar,
    Phone,
    Info,
    Star,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditTourModalProps {
    tourId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditTourModal({ tourId, isOpen, onClose }: EditTourModalProps) {
    const { data: tourResponse, isLoading: isFetching, isError } = useGetSingleTourQuery(tourId, { skip: !isOpen });
    const [updateTour, { isLoading: isUpdating }] = useUpdateTourMutation();
    const tour = tourResponse?.data;

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        duration: "",
        type: "group" as "group" | "individual",
        frequency: "",
        totalSpot: 0,
        availableSpot: 0,
        featured: false,
        contactNo: "",
    });

    // List States for Arrays
    const [features, setFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState("");
    
    const [includedItems, setIncludedItems] = useState<string[]>([]);
    const [includedInput, setIncludedInput] = useState("");

    // Image States
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    // Populate data when tour is fetched
    useEffect(() => {
        if (tour) {
            setFormData({
                title: tour.title || "",
                description: tour.description || "",
                location: tour.location || "",
                duration: tour.duration || "",
                type: tour.type || "group",
                frequency: tour.frequency || "",
                totalSpot: tour.totalSpot || 0,
                availableSpot: tour.availableSpot || 0,
                featured: tour.featured || false,
                contactNo: tour.contactNo || "",
            });
            setFeatures(tour.features || []);
            setIncludedItems(tour.includedItems || []);
            setExistingImages(tour.images || []);
        }
    }, [tour]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleAddFeature = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && featureInput.trim()) {
            e.preventDefault();
            if (!features.includes(featureInput.trim())) setFeatures([...features, featureInput.trim()]);
            setFeatureInput("");
        }
    };

    const handleAddIncluded = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && includedInput.trim()) {
            e.preventDefault();
            if (!includedItems.includes(includedInput.trim())) setIncludedItems([...includedItems, includedInput.trim()]);
            setIncludedInput("");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (existingImages.length + newImages.length + files.length > 4) {
            toast.error("You can only have up to 4 images total");
            return;
        }

        const updatedNewImages = [...newImages, ...files];
        setNewImages(updatedNewImages);

        const updatedPreviews = files.map(file => URL.createObjectURL(file));
        setNewImagePreviews([...newImagePreviews, ...updatedPreviews]);
    };

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index: number) => {
        const updatedNewImages = [...newImages];
        updatedNewImages.splice(index, 1);
        setNewImages(updatedNewImages);

        const updatedPreviews = [...newImagePreviews];
        URL.revokeObjectURL(updatedPreviews[index]);
        updatedPreviews.splice(index, 1);
        setNewImagePreviews(updatedPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim()) return toast.error("Tour Title is required");
        if (features.length === 0) return toast.error("Please add at least one feature");
        if (Number(formData.availableSpot) > Number(formData.totalSpot)) {
            return toast.error("Available spots cannot exceed total spots capacity");
        }

        try {
            const submitData = new FormData();
            
            // Append standard fields
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value.toString());
            });

            // Append Arrays as JSON strings
            submitData.append("features", JSON.stringify(features));
            submitData.append("includedItems", JSON.stringify(includedItems));
            
            // To handle updates correctly, we might want to tell the server which images to KEEP.
            // If the server replaces ALL images, we should send the new ones + existing ones? 
            // Usually, a PATCH for images with FormData replaces all or appends. 
            // In your tour.service.ts, updateData.images = images (the newly uploaded ones).
            // So currently your backend REPLACES the old images if new ones are sent. 
            // For now, I'll send ALL images (new ones) but your backend doesn't handle keeping existing ones yet.
            // I will implement a simpler logic: send new images.
            
            newImages.forEach(image => {
                submitData.append("images", image);
            });

            const res = await updateTour({ id: tourId, data: submitData }).unwrap();
            if (res.success) {
                toast.success("Tour package updated successfully!");
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update tour package");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            
            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between px-10 py-8 border-b border-slate-100 shrink-0 bg-slate-50/50">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configure Tour Package</h2>
                        <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Update ID: <span className="text-slate-700">{tourId}</span></p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-10 space-y-8">
                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Retreiving Package Details...</p>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Connection Failed</h3>
                            <p className="text-slate-500 max-w-xs">We couldn't fetch the current tour data. Please verify your connection.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Core Info */}
                                <div className="space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <Info className="w-5 h-5 text-primary" />
                                        <h3 className="text-xl font-extrabold text-slate-800">Core Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tour Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-slate-800"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    <input
                                                        type="text"
                                                        name="contactNo"
                                                        value={formData.contactNo}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none text-slate-600 leading-relaxed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tour Specs */}
                                <div className="space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-primary" />
                                        <h3 className="text-xl font-extrabold text-slate-800">Specifications</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                                            <input
                                                type="text"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Frequency</label>
                                            <input
                                                type="text"
                                                name="frequency"
                                                value={formData.frequency}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Package Type</label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 font-black cursor-pointer appearance-none"
                                            >
                                                <option value="group">Group Package</option>
                                                <option value="individual">Individual Package</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Total Spots</label>
                                            <input
                                                type="number"
                                                name="totalSpot"
                                                value={formData.totalSpot}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 font-black"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Available Spots</label>
                                            <input
                                                type="number"
                                                name="availableSpot"
                                                value={formData.availableSpot}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-black text-emerald-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Tags */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Features */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                            Features
                                        </h4>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={featureInput}
                                                onChange={(e) => setFeatureInput(e.target.value)}
                                                onKeyDown={handleAddFeature}
                                                placeholder="Add feature..."
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary transition-all text-sm font-bold outline-none"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {features.map((item, idx) => (
                                                <div key={idx} className="px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20 flex items-center gap-2 group">
                                                    {item}
                                                    <X className="w-3 h-3 cursor-pointer opacity-40 group-hover:opacity-100" onClick={() => setFeatures(features.filter((_, i) => i !== idx))} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Inclusions */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-secondary" />
                                            Inclusions
                                        </h4>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={includedInput}
                                                onChange={(e) => setIncludedInput(e.target.value)}
                                                onKeyDown={handleAddIncluded}
                                                placeholder="Add inclusion..."
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary transition-all text-sm font-bold outline-none"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {includedItems.map((item, idx) => (
                                                <div key={idx} className="px-3 py-1.5 bg-secondary/5 text-secondary text-[10px] font-black uppercase tracking-widest rounded-lg border border-secondary/20 flex items-center gap-2 group">
                                                    {item}
                                                    <X className="w-3 h-3 cursor-pointer opacity-40 group-hover:opacity-100" onClick={() => setIncludedItems(includedItems.filter((_, i) => i !== idx))} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                {/* Featured Status */}
                                <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Star className={cn("w-5 h-5", formData.featured ? "text-secondary fill-secondary" : "text-slate-300")} />
                                        <span className="font-extrabold text-slate-800">Featured</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </label>
                                </div>

                                {/* Media Cluster */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Media Management</h4>
                                    
                                    {/* Existing Images */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {existingImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                                                <img src={img} alt="Current" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => handleRemoveExistingImage(idx)} className="p-2 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* New Previews */}
                                        {newImagePreviews.map((pv, idx) => (
                                            <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden border border-primary/20 group animate-in zoom-in-50">
                                                <img src={pv} alt="New" className="w-full h-full object-cover" />
                                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase rounded-full">New</div>
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => handleRemoveNewImage(idx)} className="p-2 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Upload Slot */}
                                        {(existingImages.length + newImages.length) < 4 && (
                                            <div className="relative aspect-square border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                                                <input type="file" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                <Upload className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase text-center mt-2 tracking-tighter">Total Capacity: 4 Images</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-10 py-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-8 py-4 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                    >
                        Discard Changes
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUpdating || isFetching}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50"
                    >
                        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isUpdating ? "Applying Updates..." : "Save Configuration"}
                    </button>
                </div>
            </div>
        </div>
    );
}
