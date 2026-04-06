"use client";

import React, { useState, useEffect } from "react";
import { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } from "@/redux/api/siteContentApi";
import { toast } from "sonner";
import {
    ShieldCheck as ShieldIcon,
    Plus as PlusIcon,
    Trash2 as TrashIcon,
    Save as SaveIcon,
    Loader2 as LoaderIcon,
    ChevronDown as DownIcon,
    ChevronUp as UpIcon,
    AlertCircle as AlertIcon,
    Edit3 as EditIcon,
    FileText as FileIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IPrivacySection {
    title: string;
    description: string;
}

export default function PrivacyPolicyPage() {
    const { data: response, isLoading: isFetching } = useGetPrivacyPolicyQuery();
    const [updatePrivacyPolicy, { isLoading: isSaving }] = useUpdatePrivacyPolicyMutation();

    const [sections, setSections] = useState<IPrivacySection[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const [tempTitle, setTempTitle] = useState("");
    const [tempDescription, setTempDescription] = useState("");

    useEffect(() => {
        if (response?.data) {
            setSections(response.data);
        }
    }, [response]);

    const handleAdd = () => {
        if (!tempTitle.trim() || !tempDescription.trim()) {
            toast.error("Please fill both title and description");
            return;
        }
        setSections([...sections, { title: tempTitle.trim(), description: tempDescription }]);
        setTempTitle("");
        setTempDescription("");
        setIsAdding(false);
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setTempTitle(sections[index].title);
        setTempDescription(sections[index].description);
    };

    const handleUpdate = () => {
        if (editingIndex === null) return;
        if (!tempTitle.trim() || !tempDescription.trim()) {
            toast.error("Please fill both title and description");
            return;
        }
        const updatedSections = [...sections];
        updatedSections[editingIndex] = { title: tempTitle.trim(), description: tempDescription };
        setSections(updatedSections);
        setEditingIndex(null);
        setTempTitle("");
        setTempDescription("");
    };

    const handleDelete = (index: number) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sections.length - 1) return;

        const updatedSections = [...sections];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [updatedSections[index], updatedSections[swapIndex]] = [updatedSections[swapIndex], updatedSections[index]];
        setSections(updatedSections);
    };

    const handleSave = async () => {
        try {
            const res = await updatePrivacyPolicy(sections).unwrap();
            if (res.success) {
                toast.success("Privacy Policy updated successfully!");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to save Privacy Policy");
        }
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <LoaderIcon className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-500 font-medium mt-4 animate-pulse">Loading Privacy Policy...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage sections and legal terms for user privacy.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving || sections.length === 0}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {isSaving ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SaveIcon className="w-5 h-5" />}
                    {isSaving ? "Saving..." : "Save All Changes"}
                </button>
            </div>

            {/* List and Form */}
            <div className="space-y-8">

                {sections.length === 0 && !isAdding && (
                    <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                            <ShieldIcon className="w-10 h-10 text-primary opacity-40" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">No Sections Found</h3>
                        <p className="text-slate-500 mt-2 font-medium max-w-sm mb-8">
                            Add the first section to the Privacy Policy.
                        </p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" /> Add First Section
                        </button>
                    </div>
                )}

                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <div key={index}>
                            {editingIndex === index ? (
                                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-primary shadow-2xl animate-in zoom-in-95 duration-200">
                                    <h4 className="font-bold text-primary mb-6 flex items-center gap-2">
                                        <EditIcon className="w-5 h-5" /> Editing Section #{index + 1}
                                    </h4>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700 ml-1 hover:text-primary transition-colors">Section Title</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                                value={tempTitle}
                                                onChange={(e) => setTempTitle(e.target.value)}
                                                placeholder="e.g. Data Collection"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Content description</label>
                                            <textarea
                                                rows={8}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-slate-800 resize-none"
                                                value={tempDescription}
                                                onChange={(e) => setTempDescription(e.target.value)}
                                                placeholder="Write the detailed policy text here..."
                                            />
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={handleUpdate}
                                                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                                            >
                                                Update Section
                                            </button>
                                            <button
                                                onClick={() => setEditingIndex(null)}
                                                className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                    <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black">
                                                    {index + 1}
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                                    {section.title}
                                                </h3>
                                            </div>
                                            <div className="max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                                                {section.description}
                                            </div>
                                        </div>
                                        
                                        <div className="flex md:flex-col gap-3 shrink-0 pt-2 border-t md:border-t-0 md:border-l border-slate-50 md:pl-6">
                                            <button
                                                onClick={() => handleEdit(index)}
                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                                title="Edit"
                                            >
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                            <div className="hidden md:flex flex-col gap-2 mt-4 pt-4 border-t border-slate-50">
                                                <button
                                                    onClick={() => handleMove(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-20 flex justify-center"
                                                >
                                                    <UpIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleMove(index, 'down')}
                                                    disabled={index === sections.length - 1}
                                                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-20 flex justify-center"
                                                >
                                                    <DownIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Form Stage */}
                {isAdding ? (
                    <div className="bg-indigo-50/40 p-8 md:p-12 rounded-[3rem] border-2 border-dashed border-indigo-200 animate-in slide-in-from-top-4 duration-400">
                        <h4 className="font-bold text-indigo-600 mb-8 flex items-center gap-3 text-xl">
                            <PlusIcon className="w-6 h-6" /> Add New Policy Section
                        </h4>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-indigo-700 ml-1">Section Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Cookies & Tracking"
                                    className="w-full px-6 py-4 bg-white border border-indigo-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-indigo-700 ml-1">Section Content</label>
                                <textarea
                                    rows={8}
                                    className="w-full px-6 py-4 bg-white border border-indigo-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-slate-800 resize-none"
                                    value={tempDescription}
                                    onChange={(e) => setTempDescription(e.target.value)}
                                    placeholder="Describe your policy in detail..."
                                />
                            </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleAdd}
                                        className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                                    >
                                        Add Section to List
                                    </button>
                                    <button
                                        onClick={() => { setIsAdding(false); setTempTitle(""); setTempDescription(""); }}
                                        className="flex-1 bg-white text-slate-700 py-4 rounded-xl font-bold border border-indigo-100 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        sections.length > 0 && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full py-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3"
                            >
                                <PlusIcon className="w-8 h-8" />
                                <span>Add Another Section</span>
                            </button>
                        )
                    )}

                {/* Unsaved Warning */}
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4 items-start">
                    <div className="p-2 bg-amber-100 rounded-xl shrink-0">
                        <AlertIcon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                        <h5 className="font-bold text-amber-900">Unsaved Changes</h5>
                        <p className="text-sm text-amber-700 font-medium">
                            Remember to click <strong className="text-amber-900 font-black">"Save All Changes"</strong> at the top to sync your modifications with the live platform. Adding or deleting items in this list only updates your local view temporarily.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
