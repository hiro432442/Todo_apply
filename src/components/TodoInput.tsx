"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

interface TodoInputProps {
    onAdd: (text: string, notifyAt?: number) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
    const [text, setText] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            // Convert time (HH:mm) to a timestamp for today
            let notifyAt: number | undefined;
            if (time) {
                const now = new Date();
                const [hours, minutes] = time.split(':').map(Number);
                const notifyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

                // If the selected time has already passed today, schedule it for tomorrow
                if (notifyDate.getTime() < Date.now()) {
                    notifyDate.setDate(notifyDate.getDate() + 1);
                }
                notifyAt = notifyDate.getTime();
            }

            onAdd(text.trim(), notifyAt);
            setText("");
            setTime("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8 w-full flex-col sm:flex-row">
            <div className="flex-1 flex gap-2 w-full bg-white rounded-2xl px-5 py-3.5 border-2 border-transparent focus-within:border-primary/30 focus-within:shadow-[0_0_0_4px_rgba(230,200,200,0.1)] transition-all shadow-soft overflow-hidden">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="今日のタスクは？"
                    className="flex-1 outline-none text-foreground text-[15px] placeholder:text-muted bg-transparent min-w-[50%]"
                />
                <div className="w-[1px] bg-gray-100 mx-1"></div>
                <input
                    type="time"
                    value={time}
                    className="outline-none text-muted text-sm bg-transparent cursor-pointer min-w-[90px] flex-shrink-0 text-center"
                    title="通知時間を設定（任意）"
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>
            <button
                type="submit"
                disabled={!text.trim()}
                className="bg-primary hover:bg-primary-hover text-white rounded-2xl px-5 py-3 sm:py-0 w-full sm:w-auto h-auto sm:h-[52px] flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft shrink-0"
            >
                <Plus size={22} />
            </button>
        </form>
    );
}
