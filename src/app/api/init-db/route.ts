import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 端末ごとのPush購読情報を保存するテーブル
        await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        device_id VARCHAR(255) UNIQUE NOT NULL,
        endpoint TEXT NOT NULL,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // タスク情報を保存するテーブル
        // ログイン機能がないため、ブラウザごとに生成した device_id でデータを紐付けます
        await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id VARCHAR(255) PRIMARY KEY,
        device_id VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at BIGINT NOT NULL,
        notify_at BIGINT,
        notified BOOLEAN DEFAULT FALSE
      );
    `;

        return NextResponse.json({ message: 'Database tables initialized successfully' });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
