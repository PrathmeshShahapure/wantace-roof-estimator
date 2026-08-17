import express from "express";
import { getEstimate } from "../controllers/estimate.controller.js";

const router = express.Router();

router.post("/", getEstimate);

export default router;
