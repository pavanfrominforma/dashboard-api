import { Router, Response, Request } from "express";
import { PSCDashboardController } from "../controllers/psc-dashboard.controller";
import { Store } from "../utils/store";
import NodeCache from "node-cache";
import { HttpError } from "../utils/exceptions";

const router = Router();



/** Load all psc feeds count based on filters  */
router.post("/psc/feeds/count", async (req: Request, res: Response) => {
    try {
        const instance = await PSCDashboardController.getInstance();
        const body = req.body as any;
        let response = await instance.getPSCDashboardCount(body);
        res.status(200).json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error occurred!" });
    }
});

/** Load all psc feeds based on filters  */
router.post("/psc/feeds", async (req: Request, res: Response) => {
    try {
        const instance = await PSCDashboardController.getInstance();
        const body = req.body as any;
        let response = await instance.getPSCDashboard(body);
        res.status(200).json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error occurred!" });
    }
});

export const PSCDashboardRouter = router;
