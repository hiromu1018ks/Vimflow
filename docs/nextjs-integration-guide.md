# Next.jsへの統合手順書

## 現在の構成（更新済み）

### 統合後のプロジェクト構造
- **フレームワーク**: Next.js 15.3.4 (port: 3000)
- **UI**: Tailwind CSS + shadcn/ui
- **状態管理**: React hooks (useState, useEffect)
- **API通信**: fetch API (localhost:3001/api) - バックエンドAPIと連携
- **バックエンド**: Express.js (port: 3001) - 別途実行中
- **データベース**: PostgreSQL (Prisma ORM)

### 実装済み機能
- フロントエンドファイルをプロジェクトルートに移動済み
- package.json統合済み（プロジェクト名: basic-todo-app）
- tsconfig.json でバックエンドディレクトリを除外設定済み
- APIのfetch処理実装済み（タスク取得・作成）

## 統合手順

### 1. プロジェクト構造の準備

```bash
# 現在のプロジェクト構造（統合済み）
basic-todo-app/
├── backend/               # Express APIサーバー（port: 3001）
│   ├── prisma/           # データベーススキーマ
│   ├── src/
│   │   ├── routes/       # API Routes
│   │   ├── service/      # ビジネスロジック
│   │   └── server.ts     # Express サーバー
│   └── package.json      # バックエンド依存関係
├── src/                   # Next.js フロントエンド（port: 3000）
│   ├── app/
│   │   ├── page.tsx      # メインページ
│   │   └── layout.tsx    # レイアウト
│   ├── components/       # UIコンポーネント
│   ├── lib/             # ユーティリティ
│   └── types/           # 型定義
├── package.json          # フロントエンド依存関係
├── next.config.ts
└── tsconfig.json
```

### 2. 依存関係の統合

#### 必要なパッケージのインストール

```bash
# フロントエンドディレクトリで実行
npm install @prisma/client prisma zod
npm install -D @types/node
```

#### package.jsonの更新

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "db:seed": "tsx prisma/seed.ts",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

### 3. Next.js API Routes への移行（将来的な作業）

現在はバックエンドAPIが別途動作中ですが、将来的にNext.js API Routesに移行する場合：

#### 3.1 Prismaファイルの移動

```bash
# バックエンドからルートディレクトリへコピー
cp -r backend/prisma/ ./
cp backend/.env ./ # データベース接続情報
```

#### 3.2 Prismaクライアントの設定

`prisma/schema.prisma`を更新:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}
```

#### 3.3 Prismaクライアントの初期化

```bash
cd frontend
npx prisma generate
```

### 4. API Routesの作成

#### 4.1 タスク用API Routes

`src/app/api/tasks/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// GET /api/tasks - タスク一覧取得
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ status: 'success', data: tasks });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - タスク作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = taskSchema.parse(body);
    
    const newTask = await prisma.task.create({
      data: validatedData
    });
    
    return NextResponse.json(
      { status: 'success', data: newTask },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to create task' },
      { status: 500 }
    );
  }
}
```

#### 4.2 個別タスク操作API

`src/app/api/tasks/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

// PUT /api/tasks/[id] - タスク更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);
    
    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({ status: 'success', data: updatedTask });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - タスク削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json(
      { status: 'success', message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
```

### 5. フロントエンドコードの更新

#### 5.1 API呼び出しの現在の状態

`src/app/page.tsx`の現在の設定:

```typescript
// 現在（バックエンドAPIと連携）
const URL = "http://localhost:3001/api";

// 将来的にNext.js API Routesに移行時
// const URL = "/api";
```

**実装済み機能：**
- タスク一覧取得（getAllTodos）
- タスク作成（addTodo） - APIと連携済み

#### 5.2 型定義の統合

`src/types/type.ts`をバックエンドの型定義と統合

### 6. 環境変数の設定

`.env`ファイルの作成:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 7. Next.js設定の最適化

`next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: true,
  },
  // Prismaの最適化
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin({
      resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
    }));
    return config;
  },
};

export default nextConfig;
```

### 8. 現在の実行手順

#### 8.1 バックエンドサーバーの起動

```bash
# バックエンドAPIサーバーを起動（port: 3001）
cd backend
npm install
npm run dev
```

#### 8.2 フロントエンドの起動

```bash
# プロジェクトルートで Next.js を起動（port: 3000）
npm install
npm run dev
```

#### 8.3 データベースのシード（必要に応じて）

```bash
cd backend
npm run seed
```

#### 8.3 動作確認項目

- [ ] タスク一覧の表示
- [ ] タスクの作成
- [ ] タスクの更新
- [ ] タスクの削除
- [ ] データベースの永続化

### 9. 将来の完全統合

**現在の状態**: フロントエンドファイルは統合済み、バックエンドAPIは独立動作

**完全統合時の手順**:
1. Next.js API Routes の実装
2. Prisma設定の移行
3. 環境変数の統合
4. バックエンドディレクトリの削除

```bash
# 完全統合後にバックエンドディレクトリを削除
rm -rf backend/
```

### 10. プロダクションデプロイメント

#### 10.1 ビルドの確認

```bash
npm run build
npm start
```

#### 10.2 環境変数の設定

プロダクション環境で以下の環境変数を設定:

- `DATABASE_URL`: プロダクションデータベースURL
- `NEXTAUTH_SECRET`: セッション暗号化キー
- `NEXTAUTH_URL`: プロダクションURL

## 利点

### パフォーマンス向上
- **フロントエンド・バックエンド間の通信レイテンシ削減**
- **サーバーサイドレンダリング (SSR) の活用**
- **静的生成 (SSG) によるCDN配信最適化**

### 開発効率の向上
- **単一コードベースでの開発**
- **型安全性の向上** (フロントエンド・バックエンド間)
- **デプロイプロセスの簡素化**

### インフラストラクチャーコスト削減
- **単一サーバーでのホスティング**
- **Vercel等のサーバーレスプラットフォーム活用**

## 注意点

### データベース接続
- Next.jsのサーバーレス環境では接続プールの管理に注意
- Prismaのconnection limitingを適切に設定

### セキュリティ
- API Routesでの適切な認証・認可の実装
- CORS設定の見直し (統合後は不要)

### スケーラビリティ
- 大規模アプリケーションの場合、マイクロサービス分離も検討

## トラブルシューティング

### よくある問題

1. **Prismaクライアント生成エラー**
   ```bash
   npx prisma generate --force
   ```

2. **データベース接続エラー**
   - `.env`ファイルの`DATABASE_URL`を確認
   - データベースサーバーの起動状態を確認

3. **型エラー**
   - `npm run build`でTypeScriptエラーを確認
   - 型定義ファイルの同期を確認

4. **API Route 404エラー**
   - ファイル名と配置場所を確認
   - `app/api/`ディレクトリ構造を確認