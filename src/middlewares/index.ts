import { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";
import { Store } from "../utils/store";

export const buildCacheMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const path = req.path;
        (req as any).cachePath = path;
        const cache = Store.get<NodeCache>(Store.KEYS.CACHE);
        if (cache.has(req.path)) {
            console.log("Serving data for path " + req.path + " from cache.");
            return res.status(200).json(cache.get(path));
        }
        return next();
    };
};
