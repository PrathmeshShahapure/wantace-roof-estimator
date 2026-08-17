import express from "express";
import cors from "cors";

import configRoutes from "./routes/config.routes.js";
import estimateRoutes from "./routes/estimate.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/config", configRoutes);
app.use("/api/estimate", estimateRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "Wantace Roof Estimator API is running",
  });
});


export default app;