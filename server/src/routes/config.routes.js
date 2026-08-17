import express from "express";
import { getConfig } from "../controllers/config.controller.js";

const router = express.Router();

router.get("/", getConfig);

export default router;
