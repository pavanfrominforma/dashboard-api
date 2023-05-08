import express from "express";
import { DashboardRouter } from "./dashboard.router";
import { PSCDashboardRouter } from "./psc-dashboard.router";

const router = express.Router();
router.use(DashboardRouter);
router.use(PSCDashboardRouter)

export const V1Router = router;
