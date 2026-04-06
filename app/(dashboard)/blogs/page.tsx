"use client";

import React, { useState } from "react";
import { useGetAllBlogsQuery } from "@/redux/api/blogApi";
import { Plus, Search, Calendar, Clock, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

export default function AllBlogsPage() {
    const { data: response, isLoading, isFetching } = useGetAllBlogsQuery();
    const [searchTerm, setSearchTerm] = useState("");

    const blogs = response?.data?.all || [];

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">All Blogs</h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage your platform's articles and travel guides.</p>
                </div>
                <Link
                    href="/blogs/add"
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Write New Blog
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center max-w-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search blogs by title..."
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            {isLoading || isFetching ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            ) : filteredBlogs.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <BookOpen className="w-10 h-10 text-primary opacity-80" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">No blogs found</h3>
                    <p className="text-slate-500 mt-2 font-medium max-w-sm">
                        {searchTerm ? "Try adjusting your search criteria." : "You haven't published any blogs yet."}
                    </p>
                    {!searchTerm && (
                        <Link href="/blogs/add" className="mt-8 px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                            Write Your First Blog
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredBlogs.map((blog) => (
                        <Link
                            key={blog._id}
                            href={`/blogs/${blog._id}`}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col"
                        >
                            {/* Card Image */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Card Body */}
                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-slate-500 text-sm mt-3 line-clamp-3 leading-relaxed flex-1">
                                    {blog.overview}
                                </p>

                                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary/60" />
                                        <span>{dayjs(blog.createdAt).format("MMM D, YYYY")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary/60" />
                                        <span>{blog.readtime} min read</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
