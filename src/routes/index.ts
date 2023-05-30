import express from "express";
import { DashboardRouter } from "./dashboard.router";
import { PSCDashboardRouter } from "./psc-dashboard.router";
import { SanctionsDashboardRouter } from "./sanctions-dashboard.router";
import { LLFINDashboardRouter } from "./llfin-dashboard.router";


const router = express.Router();
router.use(DashboardRouter);
router.use(PSCDashboardRouter)
router.use(SanctionsDashboardRouter);
router.use(LLFINDashboardRouter);

export const V1Router = router;
