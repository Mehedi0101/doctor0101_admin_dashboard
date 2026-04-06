"use client";

import React, { useState, useEffect } from "react";
import { useGetFaqsQuery, useUpdateFaqsMutation } from "@/redux/api/siteContentApi";
import { IFAQ } from "@/types/siteContent";
import { toast } from "sonner";
import { 
    HelpCircle, 
    Plus, 
    Trash2, 
    Save, 
    Loader2, 
    ChevronDown, 
    ChevronUp, 
    AlertCircle,
    Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FaqManagementPage() {
    const { data: response, isLoading: isFetching, isError } = useGetFaqsQuery();
    const [updateFaqs, { isLoading: isSaving }] = useUpdateFaqsMutation();
    
    // Local State for staged changes
    const [faqs, setFaqs] = useState<IFAQ[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // New/Edit Item State
    const [tempQuestion, setTempQuestion] = useState("");
    const [tempAnswer, setTempAnswer] = useState("");

    // Initialize local state from API
    useEffect(() => {
        if (response?.data) {
            setFaqs(response.data);
        }
    }, [response]);

    const handleAdd = () => {
        if (!tempQuestion.trim() || !tempAnswer.trim()) {
            toast.error("Please fill both question and answer");
            return;
        }
        setFaqs([...faqs, { question: tempQuestion.trim(), answer: tempAnswer.trim() }]);
        setTempQuestion("");
        setTempAnswer("");
        setIsAdding(false);
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setTempQuestion(faqs[index].question);
        setTempAnswer(faqs[index].answer);
    };

    const handleUpdate = () => {
        if (editingIndex === null) return;
        if (!tempQuestion.trim() || !tempAnswer.trim()) {
            toast.error("Please fill both question and answer");
            return;
        }
        const updatedFaqs = [...faqs];
        updatedFaqs[editingIndex] = { question: tempQuestion.trim(), answer: tempAnswer.trim() };
        setFaqs(updatedFaqs);
        setEditingIndex(null);
        setTempQuestion("");
        setTempAnswer("");
    };

    const handleDelete = (index: number) => {
        const updatedFaqs = faqs.filter((_, i) => i !== index);
        setFaqs(updatedFaqs);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === faqs.length - 1) return;

        const updatedFaqs = [...faqs];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [updatedFaqs[index], updatedFaqs[swapIndex]] = [updatedFaqs[swapIndex], updatedFaqs[index]];
        setFaqs(updatedFaqs);
    };

    const handleSave = async () => {
        try {
            const res = await updateFaqs(faqs).unwrap();
            if (res.success) {
                toast.success("FAQ section updated successfully on the server!");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to save FAQs");
        }
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-500 font-medium mt-4 animate-pulse">Loading FAQs...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">FAQ Management</h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage questions and answers displayed in the support section.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving || faqs.length === 0}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? "Saving..." : "Save All Changes"}
                </button>
            </div>

            {/* List and Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* FAQ List */}
                <div className="lg:col-span-12 space-y-6">
                    
                    {faqs.length === 0 && !isAdding && (
                        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                                <HelpCircle className="w-10 h-10 text-primary opacity-40" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800">No FAQs Yet</h3>
                            <p className="text-slate-500 mt-2 font-medium max-w-sm mb-8">
                                Start by adding a frequently asked question to your platform.
                            </p>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add First FAQ
                            </button>
                        </div>
                    )}

                    {faqs.map((faq, index) => (
                        <div key={index} className="group relative">
                            {editingIndex === index ? (
                                /* Edit Interaction */
                                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-primary shadow-xl animate-in zoom-in-95 duration-200">
                                    <h4 className="font-bold text-primary mb-6 flex items-center gap-2">
                                        <Edit3 className="w-5 h-5" /> Editing FAQ #{index + 1}
                                    </h4>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Question</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                                value={tempQuestion}
                                                onChange={(e) => setTempQuestion(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Answer</label>
                                            <textarea
                                                rows={4}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-slate-800 resize-none"
                                                value={tempAnswer}
                                                onChange={(e) => setTempAnswer(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-4 pt-2">
                                            <button
                                                onClick={handleUpdate}
                                                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                                            >
                                                Update FAQ
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
                                /* Normal Item */
                                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex gap-6 flex-1">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                                <span className="font-black text-indigo-500 text-lg">{index + 1}</span>
                                            </div>
                                            <div className="space-y-3 flex-1">
                                                <h3 className="text-xl font-bold text-slate-900 leading-tight">Q: {faq.question}</h3>
                                                <p className="text-slate-600 leading-relaxed font-medium">A: {faq.answer}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex md:flex-col gap-2 shrink-0">
                                            <button
                                                onClick={() => handleEdit(index)}
                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <div className="hidden md:flex flex-col gap-1 border-t border-slate-100 mt-2 pt-2">
                                                <button
                                                    onClick={() => handleMove(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30"
                                                >
                                                    <ChevronUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleMove(index, 'down')}
                                                    disabled={index === faqs.length - 1}
                                                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30"
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add FAQ Form */}
                    {isAdding ? (
                        <div className="bg-indigo-50/30 p-8 rounded-[2.5rem] border-2 border-dashed border-indigo-200 animate-in slide-in-from-top-4 duration-300">
                             <h4 className="font-bold text-indigo-600 mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5" /> Add New FAQ
                            </h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-indigo-700 ml-1">Question</label>
                                    <input
                                        type="text"
                                        placeholder="Enter the question..."
                                        className="w-full px-6 py-4 bg-white border border-indigo-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                        value={tempQuestion}
                                        onChange={(e) => setTempQuestion(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-indigo-700 ml-1">Answer</label>
                                    <textarea
                                        placeholder="Enter the answer..."
                                        rows={4}
                                        className="w-full px-6 py-4 bg-white border border-indigo-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-slate-800 resize-none"
                                        value={tempAnswer}
                                        onChange={(e) => setTempAnswer(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <button
                                        onClick={handleAdd}
                                        className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                    >
                                        Add to List
                                    </button>
                                    <button
                                        onClick={() => { setIsAdding(false); setTempQuestion(""); setTempAnswer(""); }}
                                        className="flex-1 bg-white text-slate-700 py-4 rounded-xl font-bold border border-indigo-100 hover:bg-indigo-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        faqs.length > 0 && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full py-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3"
                            >
                                <Plus className="w-8 h-8" />
                                <span>Add Another FAQ to List</span>
                            </button>
                        )
                    )}
                </div>

                {/* Footer Note */}
                <div className="lg:col-span-12">
                     <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4 items-start">
                        <div className="p-2 bg-amber-100 rounded-xl shrink-0">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
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
        </div>
    );
}
