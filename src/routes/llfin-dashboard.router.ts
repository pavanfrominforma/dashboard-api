import { Router, Response, Request } from "express";
import { LLFINDashboardController } from "../controllers/llfin-dashboard.controller";
import { Store } from "../utils/store";
import NodeCache from "node-cache";
import { HttpError } from "../utils/exceptions";

const router = Router();



/** Load all LLFIN feeds count based on filters  */
router.post("/llfin/feeds/count", async (req: Request, res: Response) => {
    try {
        const instance = await LLFINDashboardController.getInstance();
        const body = req.body as any;
        let response = await instance.getLLFINDashboardCount(body);
        res.status(200).json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error occurred!" });
    }
});

/** Load all LLFIN feeds based on filters  */
router.post("/llfin/feeds", async (req: Request, res: Response) => {
    try {
        const instance = await LLFINDashboardController.getInstance();
        const body = req.body as any;
        let response = await instance.getLLFINDashboard(body);
        res.status(200).json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error occurred!" });
    }
});

export const LLFINDashboardRouter = router;
