# Push Notification Feature Tasks

### 1. データベース設定と依存関係
- [x] パッケージのインストール (`@vercel/postgres`, `web-push`, `@types/web-push`)
- [x] Vercel Postgres の接続設定 (`.env.local`に生成)
- [x] 初期テーブルの作成スクリプト (`/api/init-db`)の準備

### 2. バックエンドAPIの実装
- [x] Todo取得/追加 API (`/api/todos`)
- [x] Todo更新/削除 API (`/api/todos/[id]`)
- [x] Push購読 API (`/api/push/subscribe`)
- [x] Push送信実行 API (`/api/push/send`)

### 3. フロントエンドの改修
- [x] TodoInput に時間設定機能を追加
- [x] useTodos フックを LocalStorage から API 通信に書き換え
- [x] Push通知許可・購読用フック (`usePushNotifications.ts`) の作成
- [x] `public/sw.js` (Service Worker) でPushイベントをリッスンし通知を表示する処理の実装

### 4. GitHub Actions (Cron) の設定
- [x] `.github/workflows/notify-cron.yml` の作成
