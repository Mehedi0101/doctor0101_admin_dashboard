"use client";

import React, { useState } from "react";
import { useCreateBlogMutation } from "@/redux/api/blogApi";
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
import { useRouter } from "next/navigation";
import QuillEditor from "@/components/QuillEditor";

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

export default function AddBlogPage() {
    const router = useRouter();
    const [createBlog, { isLoading: isSubmitting }] = useCreateBlogMutation();

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [readtime, setReadtime] = useState<number | "">("");

    // Image State
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleRemoveThumbnail = () => {
        if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
        setThumbnail(null);
        setThumbnailPreview("");
    };

    // Strip Quill markup to check if content is truly empty
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
        if (!thumbnail) return toast.error("Please upload a thumbnail image.");

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("description", description);      // Raw Quill HTML
            formData.append("category", category);
            formData.append("readtime", String(readtime));
            formData.append("image", thumbnail);

            const res = await createBlog(formData).unwrap();
            if (res.success) {
                toast.success("Blog published successfully!");
                router.push("/blogs");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to publish blog.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Write a Blog Post</h1>
                    <p className="text-slate-500 mt-2 text-lg">Compose and publish a new article to the platform.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSubmitting ? "Publishing..." : "Publish Blog"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Blog Title */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Article Details</h2>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Blog Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Top 5 Airport Transfer Tips for First-Time Travelers"
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
                            <h2 className="text-xl font-bold text-slate-800">
                                Article Content <span className="text-red-500">*</span>
                            </h2>
                        </div>
                        <p className="text-xs text-slate-400 font-medium -mt-2">
                            The content below will be stored exactly as formatted (rich HTML).
                        </p>
                        <QuillEditor
                            value={description}
                            onChange={setDescription}
                            placeholder="Start writing your article here. Use the toolbar to format headings, bold text, lists, and more..."
                        />
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
                            <h2 className="text-xl font-bold text-slate-800">Post Settings</h2>
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
                            <h2 className="text-xl font-bold text-slate-800">
                                Thumbnail <span className="text-red-500">*</span>
                            </h2>
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
                                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                >
                                    <X className="w-4 h-4" />
                                </button>
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
                                        Click to upload thumbnail
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
    );
}
