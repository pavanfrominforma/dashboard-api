import { Router, Response, Request } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();

router.get("/vdp/feeds", async (req: Request, res: Response) => {
    try{
        const instance = await DashboardController.getInstance();
        

    }catch(e){ }
});

export const DashboardRouter = router;
