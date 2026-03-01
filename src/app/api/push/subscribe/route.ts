import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { deviceId, subscription } = body;

        if (!deviceId || !subscription) {
            return NextResponse.json({ error: 'Device ID and subscription are required' }, { status: 400 });
        }

        const { endpoint, keys } = subscription;

        // UPSERT: Insert or update the subscription for this device
        await sql`
      INSERT INTO subscriptions (device_id, endpoint, p256dh, auth)
      VALUES (${deviceId}, ${endpoint}, ${keys.p256dh}, ${keys.auth})
      ON CONFLICT (device_id) DO UPDATE 
      SET endpoint = EXCLUDED.endpoint,
          p256dh = EXCLUDED.p256dh,
          auth = EXCLUDED.auth;
    `;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
