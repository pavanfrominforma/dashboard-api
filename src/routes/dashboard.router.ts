import { Router, Response, Request } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { Store } from "../utils/store";
import NodeCache from "node-cache";
import { HttpError } from "../utils/exceptions";

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

router.get("/vdp/feeds/comments/predefined", async(req: Request, res: Response) => {
    try{
        const instance = await DashboardController.getInstance();
        const response = await instance.getPredefinedComments();
    }catch(e){
        console.log("Error in vdp/feeds/comments/predefined", e);
        res.status(500).json({ error: "Internal server error occurred! "});
    }
})

router.post("/vdp/feeds/comments", async (req: Request, res: Response) => {
    try {
        const instance = await DashboardController.getInstance();
        const body = req.body as any;

        if (!body?.comment)
            if (!body?.commentId && !body?.dataFeedId && !body?.dataFeedFileId)
                throw new HttpError(
                    400,
                    "commentId or ( dataFeedId and dataFeedFileId ) are required!",
                    null
                );

        let response = await instance.saveComment(body);
        const operation = response.operation == "update" ? "updated" : "added";
        res.status(200).json({
            message: "Comment has been " + operation + " succesfully!",
        });
    } catch (e) {
        if (e instanceof HttpError) {
            console.error(e);
            return res.status(e.statusCode).json({ error: e.message });
        }

        console.error(e);
        res.status(500).json({ error: "Internal server error occurred!" });
    }
});
export const DashboardRouter = router;
