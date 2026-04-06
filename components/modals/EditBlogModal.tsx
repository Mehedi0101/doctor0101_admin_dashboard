"use client";

import React, { useState, useEffect } from "react";
import { useUpdateBlogMutation } from "@/redux/api/blogApi";
import { toast } from "sonner";
import {
    Save,
    FileText,
    Clock,
    Tag,
    Image as ImageIcon,
    Upload,
    X,
    Loader2,
} from "lucide-react";
import QuillEditor from "@/components/QuillEditor";
import { IBlogDetails } from "@/types/blog";
import { cn } from "@/lib/utils";

const BLOG_CATEGORIES = [
    "Travel Tips",
    "Destination Guide",
    "Airport Transfer",
    "Travel News",
    "Food & Culture",
    "Adventure",
    "Luxury Travel",
    "Budget Travel",
];

interface EditBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    blog: IBlogDetails;
}

export default function EditBlogModal({ isOpen, onClose, blog }: EditBlogModalProps) {
    const [updateBlog, { isLoading: isSubmitting }] = useUpdateBlogMutation();

    // Form State
    const [title, setTitle] = useState(blog.title);
    const [description, setDescription] = useState(blog.description);
    const [category, setCategory] = useState(blog.category);
    const [readtime, setReadtime] = useState<number | "">(blog.readtime);

    // Image State
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>(blog.image);

    // Reset state when blog prop changes (if user opened a different blog, though rare in this flow)
    useEffect(() => {
        if (isOpen) {
            setTitle(blog.title);
            setDescription(blog.description);
            setCategory(blog.category);
            setReadtime(blog.readtime);
            setThumbnail(null);
            setThumbnailPreview(blog.image);
        }
    }, [isOpen, blog]);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Revoke only if it's an object URL (not the original cloud URL)
        if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
            URL.revokeObjectURL(thumbnailPreview);
        }
        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleRemoveThumbnail = () => {
        if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
            URL.revokeObjectURL(thumbnailPreview);
        }
        setThumbnail(null);
        setThumbnailPreview("");
    };

    const isDescriptionEmpty = (html: string) => {
        const stripped = html.replace(/<[^>]*>/g, "").trim();
        return stripped.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return toast.error("Blog title is required.");
        if (isDescriptionEmpty(description)) return toast.error("Blog description cannot be empty.");
        if (!category) return toast.error("Please select a category.");
        if (!readtime || Number(readtime) <= 0) return toast.error("Read time must be greater than 0.");
        if (!thumbnailPreview && !thumbnail) return toast.error("Please provide a thumbnail image.");

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("description", description);
            formData.append("category", category);
            formData.append("readtime", String(readtime));
            if (thumbnail) {
                formData.append("image", thumbnail);
            }

            const res = await updateBlog({ id: blog._id, formData }).unwrap();
            if (res.success) {
                toast.success("Blog updated successfully!");
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update blog.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-6 overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                
                {/* Header Container - Fixed */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 sticky top-0 z-20">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Edit Blog Article</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">Make changes to "{blog.title}"</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form Container - Scrollable */}
                <div className="p-8 overflow-y-auto flex-1 bg-slate-50 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Blog Title */}
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Article Details</h3>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        Blog Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Top 5 Airport Transfer Tips"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-slate-800"
                                    />
                                </div>
                            </div>

                            {/* Quill Editor */}
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        Article Content <span className="text-red-500">*</span>
                                    </h3>
                                </div>
                                <div className="relative z-10">
                                    <QuillEditor
                                        value={description}
                                        onChange={setDescription}
                                        placeholder="Start writing your article here..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Settings & Media */}
                        <div className="space-y-8">
                            {/* Category & Read Time */}
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Tag className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Post Settings</h3>
                                </div>

                                {/* Category */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-slate-800 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a category...</option>
                                        {BLOG_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Read Time */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        Read Time (minutes) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            value={readtime}
                                            onChange={(e) => setReadtime(e.target.value === "" ? "" : Number(e.target.value))}
                                            placeholder="e.g. 5"
                                            className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnail Upload */}
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <ImageIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        Thumbnail <span className="text-red-500">*</span>
                                    </h3>
                                </div>

                                {thumbnailPreview ? (
                                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 group">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveThumbnail}
                                            className="absolute top-3 right-3 p-2 bg-slate-900/40 hover:bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {/* Status badge representing if it's a new or old image */}
                                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-900/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg shadow-sm">
                                            {thumbnailPreview.startsWith("blob:") ? "New Image" : "Current Image"}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-full h-44 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                                            <Upload className="w-10 h-10 text-slate-400 group-hover:text-primary mb-3 transition-colors" />
                                            <span className="text-sm font-bold text-slate-500 group-hover:text-primary text-center px-4">
                                                Click to upload new thumbnail
                                            </span>
                                            <span className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">
                                                JPG, PNG, WEBP
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Container - Fixed */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-end gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSubmitting ? "Saving Changes..." : "Save Changes"}
                    </button>
                </div>

            </div>
        </div>
    );
}
