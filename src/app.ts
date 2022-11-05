import express from "express";
import { AppConfig, DbConfig } from "./config";
import cors from "cors";
import bodyParser from "body-parser";
import { V1Router } from "./routes";
import { Database } from "./database";
import NodeCache from "node-cache";
import { buildCacheMiddleware } from "./middlewares";
import { Store } from "./utils/store";

(async () => {
    console.log("Initializing database connection...");

    await Database.getInstance(DbConfig);
    console.log("Connected to database completed.");

    const cache = new NodeCache({
        stdTTL: AppConfig.CACHE_TTL,
    });
    Store.set(Store.KEYS.CACHE, cache);

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // const cacheMiddleware = buildCacheMiddleware();
    // app.use(cacheMiddleware);

    app.use("/api", V1Router);

    app.listen(AppConfig.PORT, () => {
        console.log("Running dashboard server on port " + AppConfig.PORT);
    });
})();
