import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const deviceId = searchParams.get('deviceId');
        const body = await request.json();

        if (!deviceId) {
            return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
        }

        // Toggle completed state (the frontend only toggles it right now)
        // If we want to support editing the text or notifyAt we'd add it here.
        if ('completed' in body) {
            await sql`
        UPDATE todos
        SET completed = ${body.completed}
        WHERE id = ${id} AND device_id = ${deviceId};
      `;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const deviceId = searchParams.get('deviceId');

        if (!deviceId) {
            return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
        }

        await sql`
      DELETE FROM todos
      WHERE id = ${id} AND device_id = ${deviceId};
    `;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
