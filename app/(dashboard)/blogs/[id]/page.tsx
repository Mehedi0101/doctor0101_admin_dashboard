"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleBlogQuery } from "@/redux/api/blogApi";
import {
  ArrowLeft,
  Clock,
  Tag,
  Calendar,
  Edit2,
  Trash2,
  Heart,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import "react-quill-new/dist/quill.snow.css";

import EditBlogModal from "@/components/modals/EditBlogModal";
import ConfirmDeleteBlogModal from "@/components/modals/ConfirmDeleteBlogModal";

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params?.id as string;

  const { data: response, isLoading } = useGetSingleBlogQuery(blogId, {
    skip: !blogId,
  });
  const blog = response?.data;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-slate-500 font-medium mt-4 animate-pulse">
          Loading blog details...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm max-w-3xl mx-auto mt-20">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Trash2 className="w-10 h-10 text-red-500 opacity-80" />
        </div>
        <h3 className="text-2xl font-black text-slate-800">Blog Not Found</h3>
        <p className="text-slate-500 mt-2 font-medium max-w-sm mb-8">
          The requested blog article does not exist or has been removed.
        </p>
        <button
          onClick={() => router.back()}
          className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-6 z-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold px-4 py-2 hover:bg-slate-50 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleEditClick}
            className="px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm shadow-primary/5"
          >
            <Edit2 className="w-4 h-4" />
            Edit Article
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-6 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <article className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        {/* Hero Image */}
        <div className="relative aspect-[21/9] w-full bg-slate-100">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

          {/* Floating Meta tags on image */}
          <div className="absolute bottom-8 left-10 flex items-center gap-3">
            <div className="bg-primary px-4 py-2 rounded-xl text-white font-black text-sm tracking-wide shadow-lg shadow-primary/30 flex items-center gap-2 border border-primary-light">
              <Tag className="w-4 h-4" />
              {blog.category}
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-sm border border-white/20 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {blog.readtime} min read
            </div>
          </div>
        </div>

        <div className="p-12">
          {/* Header Details */}
          <div className="border-b border-slate-100 pb-8 mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-6 mt-6 text-slate-500 font-bold">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Published {dayjs(blog.createdAt).format("MMMM D, YYYY")}
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                {blog.likeCount} {blog.likeCount === 1 ? "Like" : "Likes"}
              </div>
            </div>
          </div>

          {/* Rich HTML Content mapping (Quill Output) */}
          <div className="ql-snow">
            <div
              className="ql-editor p-0 text-slate-700 text-lg space-y-4 [&>p]:min-h-[1.5rem]"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          </div>
        </div>
      </article>

      {blog && (
        <>
          <EditBlogModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            blog={blog}
          />
          <ConfirmDeleteBlogModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            blogId={blog._id}
            blogTitle={blog.title}
          />
        </>
      )}
    </div>
  );
}
