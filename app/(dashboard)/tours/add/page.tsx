"use client";

import React, { useState } from "react";
import { useAddTourMutation } from "@/redux/api/tourApi";
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
    Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AddTourPage() {
    const router = useRouter();
    const [addTour, { isLoading: isSubmitting }] = useAddTourMutation();

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        duration: "",
        type: "group" as "group" | "individual",
        frequency: "",
        totalSpot: 0,
        featured: false,
        contactNo: "",
    });

    // List States for Arrays
    const [features, setFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState("");
    
    const [includedItems, setIncludedItems] = useState<string[]>([]);
    const [includedInput, setIncludedInput] = useState("");

    // Image States
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
            if (!features.includes(featureInput.trim())) {
                setFeatures([...features, featureInput.trim()]);
            }
            setFeatureInput("");
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const handleAddIncluded = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && includedInput.trim()) {
            e.preventDefault();
            if (!includedItems.includes(includedInput.trim())) {
                setIncludedItems([...includedItems, includedInput.trim()]);
            }
            setIncludedInput("");
        }
    };

    const handleRemoveIncluded = (index: number) => {
        setIncludedItems(includedItems.filter((_, i) => i !== index));
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
        
        // Explicit validation for Core Information
        if (!formData.title.trim()) return toast.error("Tour Title is required");
        if (!formData.location.trim()) return toast.error("Location is required");
        if (!formData.contactNo.trim()) return toast.error("Contact Number is required");
        if (!formData.description.trim()) return toast.error("Description is required");

        // Validation for Specifications
        if (!formData.duration.trim()) return toast.error("Duration is required");
        if (!formData.frequency.trim()) return toast.error("Frequency is required");
        if (formData.totalSpot <= 0) return toast.error("Total Spot must be greater than 0");

        // List Validation
        if (features.length === 0) return toast.error("Please add at least one feature");
        if (includedItems.length === 0) return toast.error("Please add at least one included item");
        if (images.length === 0) return toast.error("Please upload at least one image");

        try {
            const submitData = new FormData();
            
            // Append individual fields
            submitData.append("title", formData.title);
            submitData.append("description", formData.description);
            submitData.append("location", formData.location);
            submitData.append("duration", formData.duration);
            submitData.append("type", formData.type);
            submitData.append("frequency", formData.frequency);
            submitData.append("totalSpot", formData.totalSpot.toString());
            submitData.append("featured", formData.featured.toString());
            submitData.append("contactNo", formData.contactNo);

            // Append Arrays as JSON Strings (expected by backend parseFormData)
            submitData.append("features", JSON.stringify(features));
            submitData.append("includedItems", JSON.stringify(includedItems));

            // Append Images
            images.forEach(image => {
                submitData.append("images", image);
            });

            const res = await addTour(submitData).unwrap();
            if (res.success) {
                toast.success("Tour package created successfully!");
                router.push("/tours");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create tour package");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create New Tour Package</h1>
                    <p className="text-slate-500 mt-2 text-lg">Define a new adventure for your customers with full specifications.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSubmitting ? "Creating Tour..." : "Publish Tour Package"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Form Details */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Section 1: Core Information */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Info className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Core Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Tour Title <span className="text-red-500 font-bold">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Tropical Paradise Getaway"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Location <span className="text-red-500 font-bold">*</span></label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Bali, Indonesia"
                                            className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Contact Number <span className="text-red-500 font-bold">*</span></label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            name="contactNo"
                                            value={formData.contactNo}
                                            onChange={handleInputChange}
                                            placeholder="e.g. +1 234 567 890"
                                            className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Description <span className="text-red-500 font-bold">*</span></label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    placeholder="Describe the tour experience in detail..."
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium resize-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Specifications */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Tour Specifications</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Duration</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 5 Days, 4 Nights"
                                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Frequency</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="frequency"
                                        value={formData.frequency}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Weekly on Saturdays"
                                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Tour Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold appearance-none cursor-pointer"
                                >
                                    <option value="group">Group Package</option>
                                    <option value="individual">Individual Package</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Total Available Spots</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        name="totalSpot"
                                        value={formData.totalSpot}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Attributes (Features & Inclusion) */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                        {/* Features */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Tour Features / Highlights
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyDown={handleAddFeature}
                                    placeholder="Add specialty e.g. Free Cancellation (Enter to add)"
                                    className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (featureInput.trim()) {
                                            setFeatures([...features, featureInput.trim()]);
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
                                {features.length === 0 && <p className="text-xs text-slate-400 italic px-2">No features added yet...</p>}
                            </div>
                        </div>

                        {/* Included Items */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-secondary" />
                                What's Included in the Price?
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={includedInput}
                                    onChange={(e) => setIncludedInput(e.target.value)}
                                    onKeyDown={handleAddIncluded}
                                    placeholder="e.g. Hotel Stays, 3 Meals (Enter to add)"
                                    className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all outline-none font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (includedInput.trim()) {
                                            setIncludedItems([...includedItems, includedInput.trim()]);
                                            setIncludedInput("");
                                        }
                                    }}
                                    className="px-6 bg-slate-100 hover:bg-secondary hover:text-white text-slate-600 rounded-2xl font-bold transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {includedItems.map((tag, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-secondary/5 text-secondary border border-secondary/20 px-4 py-2 rounded-xl text-sm font-extrabold group hover:bg-secondary hover:text-white transition-colors cursor-default">
                                        <span>{tag}</span>
                                        <X 
                                            className="w-4 h-4 cursor-pointer text-secondary/60 group-hover:text-white" 
                                            onClick={() => handleRemoveIncluded(idx)} 
                                        />
                                    </div>
                                ))}
                                {includedItems.length === 0 && <p className="text-xs text-slate-400 italic px-2">No items listed yet...</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Media & Publish */}
                <div className="space-y-8">
                    {/* Featured Toggle Card */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary/10 rounded-lg">
                                    <Star className="w-5 h-5 text-secondary" />
                                </div>
                                <span className="font-bold text-slate-800">Featured Tour</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                            </label>
                        </div>
                        <p className="text-xs text-slate-500 italic">Featured tours are displayed on the homepage with high visibility.</p>
                    </div>

                    {/* Image Upload Area */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Tour Media</h2>
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
                                    Drag & drop or Click to upload images
                                </span>
                                <span className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">Max 4 Images • Upto 2MB each</span>
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
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-[#09122c] text-white p-8 rounded-3xl shadow-xl space-y-4">
                        <h4 className="font-bold flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" />
                            Quick Tips
                        </h4>
                        <ul className="text-xs space-y-3 text-slate-300 font-medium">
                            <li className="flex gap-2">
                                <span className="text-primary font-bold">•</span>
                                Use high-resolution images to attract more bookings.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary font-bold">•</span>
                                Detailed descriptions help in search engine discovery.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary font-bold">•</span>
                                Frequency should be clear (e.g. "Monthly First Week").
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
