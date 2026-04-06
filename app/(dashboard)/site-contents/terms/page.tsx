"use client";

import React, { useState, useEffect } from "react";
import { useGetTermsAndConditionsQuery, useUpdateTermsAndConditionsMutation } from "@/redux/api/siteContentApi";
import { toast } from "sonner";
import {
    Scale,
    Plus,
    Trash2,
    Save,
    Loader2,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Edit3,
    FileText,
    List
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ITermSection {
    title: string;
    description: string;
    clauses: string[];
}

export default function TermsAndConditionsPage() {
    const { data: response, isLoading: isFetching } = useGetTermsAndConditionsQuery();
    const [updateTerms, { isLoading: isSaving }] = useUpdateTermsAndConditionsMutation();

    const [sections, setSections] = useState<ITermSection[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Edit/Add stage state
    const [tempTitle, setTempTitle] = useState("");
    const [tempDescription, setTempDescription] = useState("");
    const [tempClauses, setTempClauses] = useState<string[]>([]);
    const [newClause, setNewClause] = useState("");

    useEffect(() => {
        if (response?.data) {
            setSections(response.data);
        }
    }, [response]);

    const handleAddSection = () => {
        if (!tempTitle.trim() || !tempDescription.trim()) {
            toast.error("Please fill title and description");
            return;
        }
        setSections([...sections, { title: tempTitle.trim(), description: tempDescription.trim(), clauses: tempClauses }]);
        resetTemp();
        setIsAdding(false);
    };

    const handleEditSection = (index: number) => {
        setEditingIndex(index);
        setTempTitle(sections[index].title);
        setTempDescription(sections[index].description);
        setTempClauses([...(sections[index].clauses || [])]);
    };

    const handleUpdateSection = () => {
        if (editingIndex === null) return;
        if (!tempTitle.trim() || !tempDescription.trim()) {
            toast.error("Please fill title and description");
            return;
        }
        const updated = [...sections];
        updated[editingIndex] = { title: tempTitle.trim(), description: tempDescription.trim(), clauses: tempClauses };
        setSections(updated);
        resetTemp();
        setEditingIndex(null);
    };

    const handleDeleteSection = (index: number) => {
        setSections(sections.filter((_, i) => i !== index));
    };

    const handleMoveSection = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sections.length - 1) return;
        const updated = [...sections];
        const swap = direction === 'up' ? index - 1 : index + 1;
        [updated[index], updated[swap]] = [updated[swap], updated[index]];
        setSections(updated);
    };

    const resetTemp = () => {
        setTempTitle("");
        setTempDescription("");
        setTempClauses([]);
        setNewClause("");
    };

    // Clause Management
    const addClause = () => {
        if (!newClause.trim()) return;
        setTempClauses([...tempClauses, newClause.trim()]);
        setNewClause("");
    };

    const removeClause = (idx: number) => {
        setTempClauses(tempClauses.filter((_, i) => i !== idx));
    };

    const handleSave = async () => {
        try {
            const res = await updateTerms(sections).unwrap();
            if (res.success) {
                toast.success("Terms & Conditions updated successfully!");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to save changes");
        }
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-500 font-medium mt-4 animate-pulse">Loading Terms & Conditions...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Terms & Conditions</h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage detailed legal clauses and operational rules.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving || sections.length === 0}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? "Saving..." : "Save All Changes"}
                </button>
            </div>

            <div className="space-y-8">
                {sections.length === 0 && !isAdding && (
                    <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                            <Scale className="w-10 h-10 text-primary opacity-40" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">No Terms Created</h3>
                        <p className="text-slate-500 mt-2 font-medium max-w-sm mb-8">
                            Add the first legal section to established the platform's rules.
                        </p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Add First Section
                        </button>
                    </div>
                )}

                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <div key={index}>
                            {editingIndex === index ? (
                                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-primary shadow-2xl animate-in zoom-in-95 duration-200">
                                    <h4 className="font-bold text-primary mb-8 flex items-center gap-2 text-xl">
                                        <Edit3 className="w-6 h-6" /> Editing Section #{index + 1}
                                    </h4>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Section Title</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                                value={tempTitle}
                                                onChange={(e) => setTempTitle(e.target.value)}
                                                placeholder="e.g. Cancellation Policy"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Intro Description</label>
                                            <textarea
                                                rows={4}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-slate-800 resize-none"
                                                value={tempDescription}
                                                onChange={(e) => setTempDescription(e.target.value)}
                                            />
                                        </div>

                                        {/* Nested Clauses */}
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                                <List className="w-4 h-4 text-primary" /> Specific Clauses
                                            </label>
                                            <div className="space-y-3">
                                                {tempClauses.map((clause, cIdx) => (
                                                    <div key={cIdx} className="flex gap-2 group">
                                                        <div className="flex-1 px-5 py-3 bg-indigo-50/50 text-indigo-900 font-bold text-sm rounded-xl border border-indigo-100">
                                                            {clause}
                                                        </div>
                                                        <button
                                                            onClick={() => removeClause(cIdx)}
                                                            className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <input
                                                    type="text"
                                                    placeholder="Add a specific clause..."
                                                    className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-bold"
                                                    value={newClause}
                                                    onChange={(e) => setNewClause(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addClause()}
                                                />
                                                <button
                                                    onClick={addClause}
                                                    className="px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4 border-t border-slate-100">
                                            <button
                                                onClick={handleUpdateSection}
                                                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                                            >
                                                Update Terms Section
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
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
                                                    {index + 1}
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                                    {section.title}
                                                </h3>
                                            </div>
                                            <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                                                {section.description}
                                            </p>

                                            {/* Clause display */}
                                            {section.clauses && section.clauses.length > 0 && (
                                                <div className="space-y-3 pt-2">
                                                    {section.clauses.map((clause, cIdx) => (
                                                        <div key={cIdx} className="flex gap-4 items-start">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                            <p className="text-sm font-bold text-slate-800">{clause}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex md:flex-col gap-3 shrink-0 pt-2 border-t md:border-t-0 md:border-l border-slate-50 md:pl-6">
                                            <button
                                                onClick={() => handleEditSection(index)}
                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSection(index)}
                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <div className="hidden md:flex flex-col gap-2 mt-4 pt-4 border-t border-slate-50">
                                                <button
                                                    onClick={() => handleMoveSection(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-20 flex justify-center"
                                                >
                                                    <ChevronUp className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleMoveSection(index, 'down')}
                                                    disabled={index === sections.length - 1}
                                                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-20 flex justify-center"
                                                >
                                                    <ChevronDown className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Section Stage */}
                {isAdding ? (
                    <div className="bg-indigo-50/40 p-8 md:p-12 rounded-[3rem] border-2 border-dashed border-indigo-200 animate-in slide-in-from-top-4 duration-400">
                        <h4 className="font-bold text-indigo-600 mb-8 flex items-center gap-3 text-xl">
                            <Plus className="w-6 h-6" /> Add New Terms Section
                        </h4>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-indigo-700 ml-1">Section Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Terms of Service"
                                    className="w-full px-6 py-4 bg-white border border-indigo-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-slate-800"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-indigo-700 ml-1">Intro Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Brief introduction for this section..."
                                    className="w-full px-6 py-4 bg-white border border-indigo-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-slate-800 resize-none"
                                    value={tempDescription}
                                    onChange={(e) => setTempDescription(e.target.value)}
                                />
                            </div>

                            {/* Clauses Stage */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-indigo-700 ml-1">Add Clauses</label>
                                <div className="space-y-3">
                                    {tempClauses.map((clause, cIdx) => (
                                        <div key={cIdx} className="flex gap-2">
                                            <div className="flex-1 px-5 py-3 bg-white text-slate-800 font-bold text-sm rounded-xl border border-indigo-100">
                                                {clause}
                                            </div>
                                            <button
                                                onClick={() => removeClause(cIdx)}
                                                className="p-3 bg-indigo-50 text-indigo-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Add a new clause..."
                                        className="flex-1 px-5 py-4 bg-white border border-indigo-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 text-sm font-bold"
                                        value={newClause}
                                        onChange={(e) => setNewClause(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addClause()}
                                    />
                                    <button
                                        onClick={addClause}
                                        className="px-8 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                    >
                                        Add Clause
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-indigo-100">
                                <button
                                    onClick={handleAddSection}
                                    className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                                >
                                    Add Section to List
                                </button>
                                <button
                                    onClick={() => { setIsAdding(false); resetTemp(); }}
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
                            <Plus className="w-8 h-8" />
                            <span>Add Another Section</span>
                        </button>
                    )
                )}

                {/* Save Warning */}
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
    );
}
