import { useState, useEffect } from "react";

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("pwa-todos");
        if (saved) {
            try {
                setTodos(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse todos", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("pwa-todos", JSON.stringify(todos));
        }
    }, [todos, isLoaded]);

    const addTodo = (text: string) => {
        const newId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : Date.now().toString() + Math.random().toString(36).substring(2, 9);

        const newTodo: Todo = {
            id: newId,
            text,
            completed: false,
            createdAt: Date.now(),
        };
        setTodos((prev) => [newTodo, ...prev]);
    };

    const toggleTodo = (id: string) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id: string) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    return { todos, addTodo, toggleTodo, deleteTodo, isLoaded };
}
