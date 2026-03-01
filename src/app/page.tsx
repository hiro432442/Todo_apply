"use client";

import { useState } from "react";
import { TodoInput } from "@/components/TodoInput";
import { TodoItem } from "@/components/TodoItem";
import { Filter, FilterType } from "@/components/Filter";
import { useTodos } from "@/hooks/useTodos";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Bell, BellOff } from "lucide-react";

export default function Home() {
  const { todos, addTodo, toggleTodo, deleteTodo, isLoaded, deviceId } = useTodos();
  const { isSubscribed, subscribeToPush } = usePushNotifications();
  const [filter, setFilter] = useState<FilterType>("all");

  if (!isLoaded) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted">読み込み中...</div>;
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <main className="min-h-screen bg-background pb-20 pt-10 px-4 sm:px-6">
      <div className="max-w-md mx-auto relative">
        {!isSubscribed && (
          <button
            onClick={subscribeToPush}
            className="absolute top-0 right-0 flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <BellOff size={14} />
            通知をオン
          </button>
        )}
        {isSubscribed && (
          <div className="absolute top-0 right-0 flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-green-50 text-green-600">
            <Bell size={14} />
            通知オン
          </div>
        )}
        <header className="mb-10 text-center pt-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Tasks</h1>
          <p className="text-muted text-sm tracking-wide">今日も素敵な一日になりますように✨</p>
        </header>

        <TodoInput onAdd={addTodo} />

        {todos.length > 0 && (
          <Filter currentFilter={filter} onChange={setFilter} />
        )}

        <div className="mt-6 flex flex-col gap-1">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 px-4 mt-4 text-muted bg-white/40 rounded-3xl border border-dashed border-border">
              {filter === "all"
                ? "タスクはありません。新しく追加してみましょう！"
                : filter === "active"
                  ? "未完了のタスクはありません 🎉"
                  : "完了したタスクはまだありません"}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                notifyAt={todo.notifyAt}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
