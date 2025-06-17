import express from "express";

const app: express.Express = express();

// サーバー起動
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

app.get("/", (req, res) => {
  res.send("OK");
});
