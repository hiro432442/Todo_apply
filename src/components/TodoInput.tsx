"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

interface TodoInputProps {
    onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(text.trim());
            setText("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8 w-full">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="今日のタスクは？"
                className="flex-1 bg-white rounded-2xl px-5 py-3.5 outline-none text-foreground text-[15px] border-2 border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(230,200,200,0.1)] transition-all shadow-soft placeholder:text-muted"
            />
            <button
                type="submit"
                disabled={!text.trim()}
                className="bg-primary hover:bg-primary-hover text-white rounded-2xl px-5 py-3.5 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
            >
                <Plus size={22} />
            </button>
        </form>
    );
}
