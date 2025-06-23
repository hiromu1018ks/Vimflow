import express from "express";
import tasksRouter from "./routes/taskRouter";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app: express.Express = express(); // Expressアプリケーションのインスタンスを作成
const PORT = process.env.BACKEND_PORT || 3001; // サーバーが動作するポート番号を設定（環境変数から取得、なければ3001を使用）

// CORSの設定オブジェクトを定義
const corsOptions = {
  origin: "http://localhost:3000", // フロントエンドのURLを指定（localhost:3000からのリクエストを許可）
  methods: ["GET", "POST", "PUT", "DELETE"], // methods: 許可するHTTPメソッドを指定（GET, POST, PUT, DELETE）
};

// Rate Limitの設定
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分間
  max: 100, // 15分間に100回まで
  message: "Too many requests, please try again later.",
});

// ===== ミドルウェアの設定 =====
app.use(express.json()); // JSONパーサーミドルウェアを追加, リクエストボディのJSONデータを自動的にJavaScriptオブジェクトに変換する

app.use(cors(corsOptions)); // CORSミドルウェアを追加, 異なるドメイン（フロントエンド）からのリクエストを許可する

app.use("/api", limiter); // Rate Limitミドルウェアを追加, 15分間に100回までのリクエストを許可する

// ===== ルーターの設定 =====
app.use("/api", tasksRouter); // タスク関連のAPIルートを/apiパスにマウント, 例: /api/tasks でタスク一覧を取得、/api/tasks でタスクを作成など

// ===== サーバーの起動 =====
// 指定したポートでサーバーを起動し、起動完了時にメッセージを表示
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
