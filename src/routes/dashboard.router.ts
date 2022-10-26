import { Router, Response, Request } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { Store } from "../utils/store";
import NodeCache from "node-cache";

const router = Router();

router.get("/vdp/feeds", async (req: Request, res: Response) => {
    try {
        const instance = await DashboardController.getInstance();
        let response = await instance.getVDPDashboard();

        const cachePath = (req as any).cachePath;
        const cache = Store.get<NodeCache>(Store.KEYS.CACHE);
        console.log("Saving path " + cachePath + " to cache");
        cache.set(cachePath, response);
        
        res.status(200).json(response);
    } catch (e) {}
});

export const DashboardRouter = router;
