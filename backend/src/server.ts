import express from "express";
import tasksRouter from "./routes/taskRouter";

const app: express.Express = express();
const PORT = 3001;

// サーバー起動
app.listen(PORT, () => {
  console.log("Server is running on port 3001");
});

// タスク関連ルーター
app.use("/api", tasksRouter);
