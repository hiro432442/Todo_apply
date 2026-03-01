import { useState, useCallback, useEffect } from 'react';

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export function usePushNotifications() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);

            // Check if already subscribed
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription().then((subscription) => {
                    setIsSubscribed(!!subscription);
                });
            });
        }
    }, []);

    const subscribeToPush = useCallback(async () => {
        if (!('serviceWorker' in navigator && 'PushManager' in window)) {
            alert('プッシュ通知がサポートされていないブラウザです。');
            return;
        }

        const permissionResult = await Notification.requestPermission();
        setPermission(permissionResult);

        if (permissionResult !== 'granted') {
            alert('通知が許可されませんでした。アプリの設定から通知を許可してください。');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                if (!publicVapidKey) {
                    throw new Error('Push public key mapping missing');
                }

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                });
            }

            const deviceId = localStorage.getItem('device_id') || 'unknown';

            // Send subscription to our backend
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deviceId,
                    subscription,
                }),
            });

            setIsSubscribed(true);
            return true;
        } catch (error) {
            console.error('Failed to subscribe to push notifications', error);
            alert('プッシュ通知の登録に失敗しました: ' + (error as Error).message);
            return false;
        }
    }, []);

    return { isSubscribed, subscribeToPush, permission };
}
