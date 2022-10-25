import express from "express";
import { DashboardRouter } from "./dashboard.router";

const router = express.Router();
router.use(DashboardRouter);

export const V1Router = router;
