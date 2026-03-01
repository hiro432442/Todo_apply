import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const deviceId = searchParams.get('deviceId');

        if (!deviceId) {
            return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
        }

        const { rows } = await sql`
      SELECT id, text, completed, created_at as "createdAt", notify_at as "notifyAt", notified 
      FROM todos 
      WHERE device_id = ${deviceId}
      ORDER BY created_at DESC;
    `;

        // type casting and converting to number where necessary because bigint comes back as string sometimes
        const todos = rows.map((row) => ({
            ...row,
            createdAt: Number(row.createdAt),
            notifyAt: row.notifyAt ? Number(row.notifyAt) : undefined,
        }));

        return NextResponse.json(todos);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, deviceId, text, completed, createdAt, notifyAt } = body;

        if (!id || !deviceId || !text || !createdAt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await sql`
      INSERT INTO todos (id, device_id, text, completed, created_at, notify_at)
      VALUES (${id}, ${deviceId}, ${text}, ${completed ? true : false}, ${createdAt}, ${notifyAt || null});
    `;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
