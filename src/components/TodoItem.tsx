import { Check, Trash2 } from "lucide-react";

interface TodoItemProps {
    id: string;
    text: string;
    completed: boolean;
    notifyAt?: number;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TodoItem({ id, text, completed, notifyAt, onToggle, onDelete }: TodoItemProps) {
    return (
        <div className={`flex items-center justify-between p-4 mb-3 rounded-2xl transition-all duration-300 ${completed ? "bg-white/60 opacity-70" : "bg-white shadow-soft"}`}>
            <div className="flex flex-col gap-0.5" onClick={() => onToggle(id)}>
                <div className="flex items-center gap-4 flex-1 cursor-pointer">
                    <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${completed ? "bg-primary border-primary" : "border-primary-hover"} hover:bg-primary-hover/20`}>
                        {completed && <Check size={14} className="text-white" />}
                    </button>
                    <span className={`text-[15px] font-medium transition-all ${completed ? "line-through text-muted" : "text-foreground"}`}>
                        {text}
                    </span>
                </div>
                {notifyAt && (
                    <div className="pl-10 text-[11px] text-muted-foreground font-medium flex items-center gap-1 opacity-80">
                        🔔 {new Date(notifyAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                )}
            </div>
            <button onClick={() => onDelete(id)} className="p-2 text-muted hover:text-red-400 transition-colors rounded-full hover:bg-red-50" aria-label="Delete">
                <Trash2 size={18} />
            </button>
        </div>
    );
}
