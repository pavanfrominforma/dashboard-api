import express from "express";
import { DashboardRouter } from "./dashboard.router";
import { PSCDashboardRouter } from "./psc-dashboard.router";
import { SanctionsDashboardRouter } from "./sanctions-dashboard.router";

const router = express.Router();
router.use(DashboardRouter);
router.use(PSCDashboardRouter)
router.use(SanctionsDashboardRouter);

export const V1Router = router;
