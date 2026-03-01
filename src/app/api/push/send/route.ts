import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import webpush from 'web-push';

export async function POST(request: Request) {
    try {
        // Initialize web-push only when the API is actually called
        // This prevents build errors during Next.js static generation when env vars might be missing
        if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
            console.error('VAPID keys are missing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        webpush.setVapidDetails(
            'mailto:support@example.com',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        );

        // 1. Verify the authorization header matches our CRON_SECRET
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const now = Date.now();

        // 2. Fetch todos that need to be notified
        // notify_at is set, it's strictly in the past or exactly now, and it hasn't been notified or completed yet.
        const { rows: todos } = await sql`
      SELECT t.id as todo_id, t.text, t.device_id, s.endpoint, s.p256dh, s.auth
      FROM todos t
      JOIN subscriptions s ON t.device_id = s.device_id
      WHERE t.notify_at <= ${now}
        AND t.notified = FALSE
        AND t.completed = FALSE;
    `;

        if (todos.length === 0) {
            return NextResponse.json({ success: true, message: 'No notifications to send' });
        }

        const notificationsPromises = todos.map(async (todo) => {
            const pushSubscription = {
                endpoint: todo.endpoint,
                keys: {
                    p256dh: todo.p256dh,
                    auth: todo.auth,
                }
            };

            const payload = JSON.stringify({
                title: 'タスクの時間です！',
                body: todo.text,
            });

            try {
                await webpush.sendNotification(pushSubscription, payload);
                // Mark as notified in DB
                await sql`
          UPDATE todos
          SET notified = TRUE
          WHERE id = ${todo.todo_id};
        `;
                return { success: true, id: todo.todo_id };
            } catch (err: any) {
                console.error('Error sending push notification', err);
                // If the subscription is invalid/expired (status 410 or 404), we might want to delete it.
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await sql`DELETE FROM subscriptions WHERE endpoint = ${todo.endpoint}`;
                }
                return { success: false, id: todo.todo_id, error: err.message };
            }
        });

        const results = await Promise.all(notificationsPromises);

        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error('Process error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
