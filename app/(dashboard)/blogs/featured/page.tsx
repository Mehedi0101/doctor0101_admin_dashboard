"use client";

import React, { useState } from "react";
import { useGetAllBlogsQuery } from "@/redux/api/blogApi";
import { Loader2, Star, Calendar, Clock, RefreshCw } from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import SelectFeaturedBlogModal from "@/components/modals/SelectFeaturedBlogModal";

export default function FeaturedBlogPage() {
    const { data: response, isLoading } = useGetAllBlogsQuery();
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

    const featuredBlog = response?.data?.featured?.[0] || null;
    const allBlogs = response?.data?.all || [];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-500 font-medium mt-4 animate-pulse">Loading featured blog...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Featured Blog</h1>
                    <p className="text-slate-500 mt-2 text-lg">Highlight your most important content to users.</p>
                </div>
                <button
                    onClick={() => setIsSelectModalOpen(true)}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                >
                    <RefreshCw className="w-5 h-5" />
                    Change Featured Blog
                </button>
            </div>

            {/* Featured Blog Display */}
            {!featuredBlog ? (
                <div className="bg-white/60 p-20 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                        <Star className="w-10 h-10 text-amber-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">No Featured Blog Selected</h3>
                    <p className="text-slate-500 mt-2 font-medium max-w-sm mb-8">
                        You currently do not have a featured blog. Select one from your published articles.
                    </p>
                    <button
                        onClick={() => setIsSelectModalOpen(true)}
                        className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-colors"
                    >
                        Select a Blog
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden relative">
                    <div className="absolute top-6 left-6 z-10 bg-amber-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-500/30">
                        <Star className="w-4 h-4 fill-white" />
                        Currently Featured
                    </div>
                    
                    <div className="relative aspect-[21/9] w-full bg-slate-100">
                        <img 
                            src={featuredBlog.image} 
                            alt={featuredBlog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                        
                        <div className="absolute bottom-10 left-10 right-10">
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                                {featuredBlog.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-6 text-white/80 font-bold">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-amber-400" />
                                    Published {dayjs(featuredBlog.createdAt).format("MMM D, YYYY")}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                    {featuredBlog.readtime} min read
                                </div>
                                <Link 
                                    href={`/blogs/${featuredBlog._id}`}
                                    className="ml-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-xl text-white transition-colors"
                                >
                                    View Full Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            <SelectFeaturedBlogModal 
                isOpen={isSelectModalOpen}
                onClose={() => setIsSelectModalOpen(false)}
                blogs={allBlogs}
            />
        </div>
    );
}
