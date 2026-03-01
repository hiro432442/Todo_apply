import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Todo App',
        short_name: 'Todo',
        description: 'おしゃれで使いやすいモダンなTodoアプリ',
        start_url: '/',
        display: 'standalone',
        background_color: '#FAF9F6',
        theme_color: '#FAF9F6',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
