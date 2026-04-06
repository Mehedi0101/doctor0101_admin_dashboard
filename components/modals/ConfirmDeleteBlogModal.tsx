import React from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { useDeleteBlogMutation } from "@/redux/api/blogApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ConfirmDeleteBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    blogId: string;
    blogTitle?: string;
}

export default function ConfirmDeleteBlogModal({
    isOpen,
    onClose,
    blogId,
    blogTitle = "this blog",
}: ConfirmDeleteBlogModalProps) {
    const router = useRouter();
    const [deleteBlog, { isLoading }] = useDeleteBlogMutation();

    if (!isOpen) return null;

    const handleDelete = async () => {
        try {
            const res = await deleteBlog(blogId).unwrap();
            // Automatically push after successful deletion
            toast.success("Blog deleted successfully!");
            router.push("/blogs");
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete blog.");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header section */}
                <div className="p-6 pb-0 flex items-start justify-between">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                </div>

                <div className="p-6 pt-4 space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Delete Blog Article</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Are you sure you want to permanently remove <span className="font-bold text-slate-800">"{blogTitle}"</span>? 
                        This action cannot be undone and will be immediately removed from the platform.
                    </p>
                </div>

                <div className="p-6 pt-2 flex items-center gap-3 bg-slate-50 mt-4 border-t border-slate-100 rounded-b-3xl">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-md shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Trash2 className="w-5 h-5" />
                        )}
                        {isLoading ? "Deleting..." : "Delete Permanently"}
                    </button>
                </div>
            </div>
        </div>
    );
}
