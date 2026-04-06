import React, { useState } from "react";
import { Search, X, Loader2, Star } from "lucide-react";
import { useMakeBlogFeaturedMutation } from "@/redux/api/blogApi";
import { toast } from "sonner";
import { IBlogOverviewItem } from "@/types/blog";
import { cn } from "@/lib/utils";

interface SelectFeaturedBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    blogs: IBlogOverviewItem[];
}

export default function SelectFeaturedBlogModal({
    isOpen,
    onClose,
    blogs,
}: SelectFeaturedBlogModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [makeBlogFeatured, { isLoading }] = useMakeBlogFeaturedMutation();
    const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

    if (!isOpen) return null;

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSetFeatured = async (blogId: string) => {
        try {
            setSelectedBlogId(blogId);
            const res = await makeBlogFeatured(blogId).unwrap();
            if (res.success) {
                toast.success("Featured blog updated successfully!");
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to set featured blog.");
        } finally {
            setSelectedBlogId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header Container */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Select Featured Blog</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">
                            Choose an article to feature prominently.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            className="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Container - Scrollable */}
                <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
                    {filteredBlogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-10">
                            <Search className="w-10 h-10 text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-700">No blogs found</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredBlogs.map((blog) => (
                                <div
                                    key={blog._id}
                                    className="bg-white border border-slate-100 rounded-3xl p-4 flex gap-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all items-center group"
                                >
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h4 className="text-base font-bold text-slate-900 line-clamp-2 leading-tight">
                                            {blog.title}
                                        </h4>
                                        <button
                                            disabled={isLoading}
                                            onClick={() => handleSetFeatured(blog._id)}
                                            className="mt-3 text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                                        >
                                            {isLoading && selectedBlogId === blog._id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Star className="w-4 h-4" />
                                            )}
                                            {isLoading && selectedBlogId === blog._id ? "Setting..." : "Set as Featured"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
