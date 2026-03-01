export type FilterType = "all" | "active" | "completed";

interface FilterProps {
    currentFilter: FilterType;
    onChange: (filter: FilterType) => void;
}

export function Filter({ currentFilter, onChange }: FilterProps) {
    const tabs: { value: FilterType; label: string }[] = [
        { value: "all", label: "すべて" },
        { value: "active", label: "未完了" },
        { value: "completed", label: "完了" },
    ];

    return (
        <div className="flex gap-1 mb-6 bg-white/40 p-1.5 rounded-full w-fit mx-auto border border-border shadow-sm backdrop-blur-sm">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300 ${currentFilter === tab.value
                            ? "bg-white text-foreground shadow-sm"
                            : "text-muted hover:text-foreground"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
