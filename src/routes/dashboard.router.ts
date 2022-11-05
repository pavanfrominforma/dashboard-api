import { Router, Response, Request } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { Store } from "../utils/store";
import NodeCache from "node-cache";

const router = Router();

router.post("/vdp/feeds/count", async (req: Request, res: Response) => {
    try {
        const instance = await DashboardController.getInstance();
        const body = req.body as any;
        let response = await instance.getVdpDashboardCount(body);
        res.status(200).json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error occurred!" });
    }
});

router.post("/vdp/feeds", async (req: Request, res: Response) => {
    try {
        const instance = await DashboardController.getInstance();
        const body = req.body as any;
        let response = await instance.getVDPDashboard(body);
        res.status(200).json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error occurred!" });
    }
});

export const DashboardRouter = router;
