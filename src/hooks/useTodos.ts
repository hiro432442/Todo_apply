import { useState, useEffect, useCallback } from "react";

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    notifyAt?: number;
}

// Generate or retrieve a persistent device ID from localStorage
const getDeviceId = () => {
    if (typeof window === 'undefined') return '';
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
        deviceId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2);
        localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
};

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchTodos = useCallback(async () => {
        const deviceId = getDeviceId();
        if (!deviceId) return;
        try {
            const res = await fetch(`/api/todos?deviceId=${deviceId}`);
            if (res.ok) {
                const data = await res.json();
                setTodos(data);
            }
        } catch (error) {
            console.error('Failed to fetch todos', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const addTodo = async (text: string, notifyAt?: number) => {
        const deviceId = getDeviceId();
        const newId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : Date.now().toString() + Math.random().toString(36).substring(2, 9);

        const newTodo: Todo = {
            id: newId,
            text,
            completed: false,
            createdAt: Date.now(),
            notifyAt
        };

        // Optimistic update
        setTodos((prev) => [newTodo, ...prev]);

        // Sync with API
        try {
            await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newTodo, deviceId })
            });
        } catch (error) {
            console.error('Failed to add todo', error);
        }
    };

    const toggleTodo = async (id: string) => {
        const deviceId = getDeviceId();
        const todoToToggle = todos.find(t => t.id === id);
        if (!todoToToggle) return;

        const newCompletedStatus = !todoToToggle.completed;

        // Optimistic update
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: newCompletedStatus } : todo
            )
        );

        // Sync with API
        try {
            await fetch(`/api/todos/${id}?deviceId=${deviceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: newCompletedStatus })
            });
        } catch (error) {
            console.error('Failed to update todo', error);
        }
    };

    const deleteTodo = async (id: string) => {
        const deviceId = getDeviceId();

        // Optimistic update
        setTodos((prev) => prev.filter((todo) => todo.id !== id));

        // Sync with API
        try {
            await fetch(`/api/todos/${id}?deviceId=${deviceId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Failed to delete todo', error);
        }
    };

    return { todos, addTodo, toggleTodo, deleteTodo, isLoaded, deviceId: getDeviceId() };
}
