// Express.jsフレームワークをインポート（Webアプリケーションを作成するためのNode.jsフレームワーク）
import express from "express";
// タスク関連のAPIルートを定義したルーターファイルをインポート
import tasksRouter from "./routes/taskRouter";
// CORS（Cross-Origin Resource Sharing）をインポート（異なるドメインからのリクエストを許可するため）
import cors from "cors";

// Expressアプリケーションのインスタンスを作成
const app: express.Express = express();
// サーバーが動作するポート番号を設定（環境変数から取得、なければ3001を使用）
const PORT = process.env.BACKEND_PORT || 3001;

// CORSの設定オブジェクトを定義
// origin: フロントエンドのURLを指定（localhost:3000からのリクエストを許可）
// methods: 許可するHTTPメソッドを指定（GET, POST, PUT, DELETE）
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// ===== ミドルウェアの設定 =====
// JSONパーサーミドルウェアを追加
// リクエストボディのJSONデータを自動的にJavaScriptオブジェクトに変換する
app.use(express.json());

// CORSミドルウェアを追加
// 異なるドメイン（フロントエンド）からのリクエストを許可する
app.use(cors(corsOptions));

// ===== ルーターの設定 =====
// タスク関連のAPIルートを/apiパスにマウント
// 例: /api/tasks でタスク一覧を取得、/api/tasks でタスクを作成など
app.use("/api", tasksRouter);

// ===== サーバーの起動 =====
// 指定したポートでサーバーを起動し、起動完了時にメッセージを表示
app.listen(PORT, () => {
  console.log("Server is running on port 3001");
});
