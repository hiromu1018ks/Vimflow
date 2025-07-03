# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 【MUST GLOBAL】Gemini活用（プロジェクトのCLAUDE.mdより優先）

### 三位一体の開発原則
ユーザーの**意思決定**、Claudeの**分析と実行**、Geminiの**検証と助言**を組み合わせ、開発の質と速度を最大化する：
- **ユーザー**：プロジェクトの目的・要件・最終ゴールを定義し、最終的な意思決定を行う**意思決定者**
  - 反面、具体的なコーディングや詳細な計画を立てる力、タスク管理能力ははありません。
- **Claude**：高度な計画力・高品質な実装・リファクタリング・ファイル操作・タスク管理を担う**実行者**
  - 指示に対して忠実に、順序立てて実行する能力はありますが、意志がなく、思い込みは勘違いも多く、思考力は少し劣ります。
- **Gemini**：深いコード理解・Web検索 (Google検索) による最新情報へのアクセス・多角的な視点からの助言・技術的検証を行う**助言者**
  - プロジェクトのコードと、インターネット上の膨大な情報を整理し、的確な助言を与えてくれますが、実行力はありません。

### 実践ガイド
- **ユーザーの要求を受けたら即座に`gemini -p <質問内容>`で壁打ち**を必ず実施
- Geminiの意見を鵜呑みにせず、1意見として判断。聞き方を変えて多角的な意見を抽出
- Claude Code内蔵のWebSearchツールは使用しない
- Geminiがエラーの場合は、聞き方を工夫してリトライ：
  - ファイル名や実行コマンドを渡す（Geminiがコマンドを実行可能）
  - 複数回に分割して聞く
- **モデルの使い分け**: 質問の難易度に応じて**Proモデル**と**Flashモデル**を使い分けます。ただし、Claude CodeがProモデルに尋ねるべきと判断した質問でも、レート制限により直ちに回答が得られない場合は、**Flashモデル**を使用してください。
### 主要な活用場面
1. **実現不可能な依頼**: Claude Codeでは実現できない要求への対処 (例: `今日の天気は？`)
2. **前提確認**: ユーザー、Claude自身に思い込みや勘違い、過信がないかどうか逐一確認 (例: `この前提は正しいか？`）
3. **技術調査**: 最新情報・エラー解決・ドキュメント検索・調査方法の確認（例: `Rails 7.2の新機能を調べて`）
4. **設計検証**: アーキテクチャ・実装方針の妥当性確認（例: `この設計パターンは適切か？`）
5. **問題解決**: Claude自身が自力でエラーを解決できない場合に対処方法を確認 (例: `この問題の対処方法は？`)
6. **コードレビュー**: 品質・保守性・パフォーマンスの評価（例: `このコードの改善点は？`）
7. **計画立案**: タスクの実行計画レビュー・改善提案（例: `この実装計画の問題点は？`）
8. **技術選定**: ライブラリ・手法の比較検討 （例: `このライブラリは他と比べてどうか？`）

## Commands

### Development

```bash
npm run dev              # Start Next.js dev server (port 3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

### Database Operations

```bash
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database with initial data
docker-compose up -d    # Start PostgreSQL container (port 5433)
```

### Backend Server (Alternative Express.js)

```bash
cd backend && npm run ts    # Start Express server with hot reload (port 3001)
cd backend && npm run seed  # Seed database via Express backend
```

## Architecture

This is a full-stack todo application with **Vim-style keyboard navigation** built on:

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API routes (primary) + Express.js server (alternative)
- **Database**: PostgreSQL + Prisma ORM

### Key Directories

- `src/app/` - Next.js App Router with API routes at `/api/tasks`
- `src/hooks/` - Custom hooks: `useTodos` (CRUD), `useTaskEdit` (editing), `useVimMode` (keyboard navigation)
- `src/components/ui/` - shadcn/ui components
- `backend/` - Alternative Express.js server
- `prisma/` - Database schema and migrations

### Database Schema

Single `Task` model with `id`, `task`, `createdAt`, `updatedAt` fields using UUID primary keys.

### Custom Hooks Architecture

The app uses a clean separation pattern:

- **useTodos**: Handles all CRUD operations and loading states
- **useTaskEdit**: Manages task editing mode and operations
- **useVimMode**: Implements Vim-style keyboard navigation (j/k navigation, dd deletion, o/i for adding, Enter for
  editing)

### API Endpoints

- `GET/POST/PUT/DELETE /api/tasks` - Next.js API routes (primary)
- Express backend available as alternative with rate limiting

### Environment

```env
DATABASE_URL="postgresql://basic_todo_user:basic_todo_password@localhost:5433/basic_todo_db"
```

### Type Safety

All components use TypeScript with Zod validation for API requests and Prisma-generated types for database operations.