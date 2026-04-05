"use client";

import React, { useEffect, useState } from "react";
import { useGetSingleTransportQuery, useUpdateTransportMutation } from "@/redux/api/transportApi";
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
    DollarSign,
    Car,
    Navigation,
    Info,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditTransferModalProps {
    transferId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditTransferModal({ transferId, isOpen, onClose }: EditTransferModalProps) {
    const { data: transferResponse, isLoading: isFetching, isError } = useGetSingleTransportQuery(transferId, { skip: !isOpen });
    const [updateTransport, { isLoading: isUpdating }] = useUpdateTransportMutation();
    const transfer = transferResponse?.data;

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
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    // Populate data when transfer is fetched
    useEffect(() => {
        if (transfer) {
            setFormData({
                title: transfer.title || "",
                vehicleModel: transfer.vehicleModel || "",
                duration: transfer.duration || "",
                capacity: transfer.capacity || 0,
                price: transfer.price || 0,
                pickup: transfer.pickup || "",
                destination: transfer.destination || "",
            });
            setFeatures(transfer.features || []);
            setExistingImages(transfer.images || []);
        }
    }, [transfer]);

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
            if (!features.includes(featureInput.trim())) setFeatures([...features, featureInput.trim()]);
            setFeatureInput("");
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
        
        if (!formData.title.trim()) return toast.error("Service Title is required");
        if (!formData.pickup.trim()) return toast.error("Pickup location is required");
        if (!formData.destination.trim()) return toast.error("Destination is required");
        if (!formData.vehicleModel.trim()) return toast.error("Vehicle Model is required");
        if (formData.price <= 0) return toast.error("Price must be greater than 0");
        if (formData.capacity <= 0) return toast.error("Capacity must be greater than 0");
        if (features.length === 0) return toast.error("Please add at least one vehicle feature");

        try {
            const submitData = new FormData();
            
            // Append standard fields
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value.toString());
            });

            // Append Arrays as JSON strings
            submitData.append("features", JSON.stringify(features));
            
            newImages.forEach(image => {
                submitData.append("images", image);
            });

            const res = await updateTransport({ id: transferId, data: submitData }).unwrap();
            if (res.success) {
                toast.success("Transfer service updated successfully!");
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update transfer service");
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
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configure Transfer Service</h2>
                        <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Update ID: <span className="text-slate-700">{transferId}</span></p>
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
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Retreiving Service Details...</p>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Connection Failed</h3>
                            <p className="text-slate-500 max-w-xs">We couldn't fetch the current transport data. Please verify your connection.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Route Info */}
                                <div className="space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <Navigation className="w-5 h-5 text-primary" />
                                        <h3 className="text-xl font-extrabold text-slate-800">Route & Pricing</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Service Title</label>
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
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pickup Location</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    <input
                                                        type="text"
                                                        name="pickup"
                                                        value={formData.pickup}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                                    <input
                                                        type="text"
                                                        name="destination"
                                                        value={formData.destination}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Total Service Price</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-extrabold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transport Specs */}
                                <div className="space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <Car className="w-5 h-5 text-primary" />
                                        <h3 className="text-xl font-extrabold text-slate-800">Transfer Specifications</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1.5 col-span-2 md:col-span-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Model</label>
                                            <div className="relative">
                                                <Bus className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    name="vehicleModel"
                                                    value={formData.vehicleModel}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 col-span-2 md:col-span-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Estimated Duration</label>
                                            <div className="relative">
                                                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    name="duration"
                                                    value={formData.duration}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 col-span-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Passenger Capacity</label>
                                            <div className="relative">
                                                <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="number"
                                                    name="capacity"
                                                    value={formData.capacity}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 font-black"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Tags */}
                                <div>
                                    {/* Features */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                            Vehicle Features
                                        </h4>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={featureInput}
                                                onChange={(e) => setFeatureInput(e.target.value)}
                                                onKeyDown={handleAddFeature}
                                                placeholder="Add feature e.g. Free WiFi..."
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary transition-all text-sm font-bold outline-none"
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
                                        <div className="flex flex-wrap gap-2">
                                            {features.map((item, idx) => (
                                                <div key={idx} className="px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20 flex items-center gap-2 group cursor-default">
                                                    {item}
                                                    <X className="w-3 h-3 cursor-pointer opacity-40 group-hover:opacity-100" onClick={() => setFeatures(features.filter((_, i) => i !== idx))} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                {/* Media Cluster */}
                                <div className="space-y-4 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Transfer Media</h4>
                                    
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
                                            <div className="relative aspect-square border-2 border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
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
