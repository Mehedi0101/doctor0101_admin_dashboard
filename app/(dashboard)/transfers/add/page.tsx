"use client";

import React, { useState } from "react";
import { useAddTransportMutation } from "@/redux/api/transportApi";
import { toast } from "sonner";
import {
    Save,
    MapPin,
    Clock,
    Users,
    Bus,
    CheckCircle2,
    Plus,
    X,
    Image as ImageIcon,
    Upload,
    Loader2,
    Info,
    Car,
    Navigation,
    DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AddTransferPage() {
    const router = useRouter();
    const [addTransport, { isLoading: isSubmitting }] = useAddTransportMutation();

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        vehicleModel: "",
        duration: "",
        capacity: 0,
        price: 0,
        pickup: "",
        destination: "",
    });

    // List States for Arrays
    const [features, setFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState("");

    // Image States
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "capacity" || name === "price" ? Number(value) : value
        }));
    };

    const handleAddFeature = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && featureInput.trim()) {
            e.preventDefault();
            if (!features.includes(featureInput.trim())) {
                setFeatures([...features, featureInput.trim()]);
            }
            setFeatureInput("");
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 4) {
            toast.error("You can only upload up to 4 images");
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Explicit validation
        if (!formData.title.trim()) return toast.error("Service Title is required");
        if (!formData.pickup.trim()) return toast.error("Pickup location is required");
        if (!formData.destination.trim()) return toast.error("Destination is required");
        if (!formData.vehicleModel.trim()) return toast.error("Vehicle Model is required");
        if (formData.price <= 0) return toast.error("Price must be greater than 0");
        if (formData.capacity <= 0) return toast.error("Capacity must be greater than 0");
        if (features.length === 0) return toast.error("Please add at least one vehicle feature");
        if (images.length === 0) return toast.error("Please upload at least one image");

        try {
            const submitData = new FormData();

            // Append individual fields
            submitData.append("title", formData.title);
            submitData.append("vehicleModel", formData.vehicleModel);
            submitData.append("duration", formData.duration);
            submitData.append("capacity", formData.capacity.toString());
            submitData.append("price", formData.price.toString());
            submitData.append("pickup", formData.pickup);
            submitData.append("destination", formData.destination);

            // Append Arrays as JSON Strings
            submitData.append("features", JSON.stringify(features));

            // Append Images
            images.forEach(image => {
                submitData.append("images", image);
            });

            const res = await addTransport(submitData).unwrap();
            if (res.success) {
                toast.success("Transport service created successfully!");
                router.push("/transfers");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create Transfer");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Add Transfer Service</h1>
                    <p className="text-slate-500 mt-2 text-lg">Register a new fleet vehicle or transfer route to the platform.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSubmitting ? "Creating Service..." : "Publish Transfer Service"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Form Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Section 1: Route & Core Info */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Navigation className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Route & Pricing</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Service Title <span className="text-red-500 font-bold">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Airport Luxury Sedan Transfer"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Pickup Location <span className="text-red-500 font-bold">*</span></label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            name="pickup"
                                            value={formData.pickup}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Suvarnabhumi Airport"
                                            className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Destination <span className="text-red-500 font-bold">*</span></label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                        <input
                                            type="text"
                                            name="destination"
                                            value={formData.destination}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Bangkok City Center"
                                            className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Total Service Price <span className="text-red-500 font-bold">*</span></label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-extrabold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Transport Specs */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Car className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Transfer Specifications</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Vehicle Model <span className="text-red-500 font-bold">*</span></label>
                                <div className="relative">
                                    <Bus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="vehicleModel"
                                        value={formData.vehicleModel}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Toyota Alphard 2024"
                                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Estimated Duration</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 45 - 60 Minutes"
                                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Passenger Capacity <span className="text-red-500 font-bold">*</span></label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Vehicle Features */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            Vehicle Features / Amenities <span className="text-red-500 font-bold">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyDown={handleAddFeature}
                                placeholder="Add amenity e.g. Free WiFi, AC, Bottled Water (Enter to add)"
                                className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (featureInput.trim()) {
                                        if (!features.includes(featureInput.trim())) setFeatures([...features, featureInput.trim()]);
                                        setFeatureInput("");
                                    }
                                }}
                                className="px-6 bg-slate-100 hover:bg-primary hover:text-white text-slate-600 rounded-2xl font-bold transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {features.map((tag, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-primary/5 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-extrabold group hover:bg-primary hover:text-white transition-colors cursor-default">
                                    <span>{tag}</span>
                                    <X
                                        className="w-4 h-4 cursor-pointer text-primary/60 group-hover:text-white"
                                        onClick={() => handleRemoveFeature(idx)}
                                    />
                                </div>
                            ))}
                            {features.length === 0 && <p className="text-xs text-slate-400 italic px-2">List any specific amenities provided in the vehicle...</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Media Hub */}
                <div className="space-y-8">
                    {/* Image Upload Area */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Transfer Media <span className="text-red-500 font-bold">*</span></h2>
                        </div>

                        <div className="relative group">
                            <input
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                                <Upload className="w-10 h-10 text-slate-400 group-hover:text-primary mb-3 transition-colors" />
                                <span className="text-sm font-bold text-slate-500 group-hover:text-primary text-center px-4">
                                    Click to upload fleet images
                                </span>
                                <span className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">Max 4 Images allowed</span>
                            </div>
                        </div>

                        {/* Image Previews */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {imagePreviews.map((preview, idx) => (
                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
