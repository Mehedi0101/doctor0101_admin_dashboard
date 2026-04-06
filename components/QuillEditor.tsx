"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Must be loaded client-side only — Quill accesses the DOM
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const QUILL_MODULES = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        ["link"],
        [{ color: [] }, { background: [] }],
        ["clean"],
    ],
};

const QUILL_FORMATS = [
    "header", "bold", "italic", "underline", "strike",
    "list", "indent", "blockquote", "code-block",
    "link", "color", "background",
];

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
    return (
        <div className="quill-wrapper">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder={placeholder || "Start writing your content..."}
            />
            <style jsx global>{`
                .quill-wrapper .ql-container {
                    border-bottom-left-radius: 1rem;
                    border-bottom-right-radius: 1rem;
                    border-color: #e2e8f0;
                    font-family: inherit;
                    font-size: 0.95rem;
                }
                .quill-wrapper .ql-toolbar {
                    border-top-left-radius: 1rem;
                    border-top-right-radius: 1rem;
                    border-color: #e2e8f0;
                    background: #f8fafc;
                }
                .quill-wrapper .ql-editor {
                    min-height: 320px;
                    line-height: 1.8;
                    color: #1e293b;
                }
                .quill-wrapper .ql-editor.ql-blank::before {
                    color: #94a3b8;
                    font-style: normal;
                    font-weight: 500;
                }
                .quill-wrapper .ql-editor:focus {
                    outline: none;
                }
                .quill-wrapper .ql-container.ql-snow:focus-within {
                    border-color: var(--primary, #7c3aed);
                    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.08);
                }
                .quill-wrapper .ql-toolbar.ql-snow:has(+ .ql-container:focus-within) {
                    border-color: var(--primary, #7c3aed);
                }
            `}</style>
        </div>
    );
}
