import express from "express";
import cors from "cors";
import config from "dotenv/config"
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "Wantace Roof Estimator API is running",
  });
});

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
