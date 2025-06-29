# Basic Todo App

このプロジェクトは、Next.js 14、Prisma、NextAuth.js を使用して構築されたシンプルなToDo管理アプリケーションです。ユーザー認証、タスクの作成、読み取り、更新、削除（CRUD）機能、およびテーマ切り替え機能を備えています。

## 機能

- **ユーザー認証**: NextAuth.js を使用した安全な認証システム。
- **タスク管理**:
  - タスクの追加
  - タスクの一覧表示
  - タスクの完了状態の切り替え
  - タスクの編集
  - タスクの削除
- **テーマ切り替え**: ライトモードとダークモードの切り替え。
- **Vimキーバインド**: (もし実装されていれば) Vimライクなキーバインドでの操作。

## 使用技術

- **フレームワーク**: [Next.js 14](https://nextjs.org/) (App Router)
- **データベース**: [Prisma](https://www.prisma.io/) (ORM)
- **認証**: [NextAuth.js](https://next-auth.js.org/)
- **UIコンポーネント**: [Radix UI](https://www.radix-ui.com/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **型定義**: [TypeScript](https://www.typescriptlang.org/)

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/basic-todo-app.git
cd basic-todo-app
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
# または
bun install
```

### 3. 環境変数の設定

プロジェクトのルートディレクトリに `.env` ファイルを作成し、以下の環境変数を設定します。

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"
```

- `DATABASE_URL`: 使用するデータベースの接続文字列。PostgreSQL, MySQL, SQLite など、Prismaがサポートするデータベースを使用できます。
- `NEXTAUTH_SECRET`: NextAuth.js のセッションを保護するための秘密鍵。`openssl rand -base64 32` などで生成できます。
- `NEXTAUTH_URL`: アプリケーションがデプロイされるURL。開発環境では `http://localhost:3000`。

### 4. データベースのセットアップ

Prismaを使用してデータベーススキーマを適用し、初期データを投入します。

```bash
# データベーススキーマを適用
npm run db:push

# 初期データを投入 (オプション)
npm run db:seed
```

### 5. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くとアプリケーションが表示されます。

## デプロイ

Next.js アプリケーションのデプロイには、[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使用するのが最も簡単です。詳細については、[Next.js デプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。

