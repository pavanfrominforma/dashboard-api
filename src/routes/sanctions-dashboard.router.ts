import { Router, Response, Request } from "express";
import { SanctionsDashboardController } from "../controllers/sanctions.controller";
import { Store } from "../utils/store";
import NodeCache from "node-cache";
import { HttpError } from "../utils/exceptions";

const router = Router();



/** Load all psc feeds count based on filters  */
router.post("/sanctions/feeds/count", async (req: Request, res: Response) => {
    try {
        const instance = await SanctionsDashboardController.getInstance();
        const body = req.body as any;
        let response = await instance.getSanctionsDashboardCount(body);
        res.status(200).json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error occurred!" });
    }
});

/** Load all psc feeds based on filters  */
router.post("/sanctions/feeds", async (req: Request, res: Response) => {
    try {
        const instance = await SanctionsDashboardController.getInstance();
        const body = req.body as any;
        let response = await instance.getSanctionDashboard(body);
        res.status(200).json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error occurred!" });
    }
});

export const SanctionsDashboardRouter = router;
