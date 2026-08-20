# ツーリングルート共有

ツーリングのおすすめルートを共有するWebサービスです。地図上でクリックして経路を描き、投稿・一覧表示・いいねができます。

## 技術スタック

- Next.js 16 (App Router) + React 19
- Drizzle ORM + PostgreSQL(本番想定: Neon)
- 自前のメール+パスワード認証(DBセッション + `jose`によるJWT署名Cookie)
- Leaflet + react-leaflet + OpenStreetMap
- OpenRouteService(地名検索・道路に沿ったルート計算。Route Handler経由でAPIキーをサーバー側に隠して中継)

## セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local に DATABASE_URL / SESSION_SECRET / ORS_API_KEY を設定
# SESSION_SECRET は `openssl rand -base64 32` で生成
# ORS_API_KEY は https://openrouteservice.org/dev/#/signup で取得(無料枠あり)
npx drizzle-kit push
npm run dev
```

http://localhost:3000 を開いてください。`ORS_API_KEY` 未設定の場合、地名検索と
道路に沿ったルート計算は失敗しますが(直線表示にフォールバック)、それ以外の機能は動作します。

## デプロイ(Vercel)

`npm run build` は `drizzle-kit push --force && next build` を実行するため、
Vercelでのデプロイのたびに `DATABASE_URL` で指定したPostgresへスキーマが自動反映されます。
Vercel Project Settings → Environment Variables に `DATABASE_URL`(Neonの接続文字列)、
`SESSION_SECRET`、`ORS_API_KEY` を設定してください。

`--force` はデータ消失を伴う変更(カラム削除・リネームなど)も確認なしに適用します。
MVP段階の簡便さを優先した構成なので、本番データが増えてきたら
`drizzle-kit generate` + `drizzle-kit migrate` によるマイグレーションファイル管理への
切り替えを検討してください。

## 主な機能(MVP)

- サインアップ / ログイン(簡易認証)
- 地図検索(地名・住所)で目的地へ移動
- 地図をクリックして経路(ウェイポイント列)を作成、道路に沿ったルートを自動計算
- 番号付きマーカーをドラッグしてルートを微調整
- ルート投稿・一覧表示 / 詳細表示
- いいね機能

## 今後の拡張候補

- ルート自体(ライン)をドラッグして中間点を挿入する編集操作
- ルートの個別共有URL・SNS連携
- キーワード/エリアでの検索・絞り込み
- GPXファイルのインポート/エクスポート
