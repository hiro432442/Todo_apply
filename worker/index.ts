// @ts-nocheck
/// <reference lib="webworker" />

self.addEventListener('push', (event: any) => {
    const data = event.data?.json() ?? {};
    const title = data.title || '新しい通知';
    const options = {
        body: data.body || 'タスクの時間です',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: data.data || {}
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
    event.notification.close();
    // Focus or open the app when the notification is clicked
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return self.clients.openWindow('/');
        })
    );
});
