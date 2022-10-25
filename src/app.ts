import express from "express";
import { AppConfig, DbConfig } from "./config";
import cors from "cors";
import bodyParser from "body-parser";
import { V1Router } from "./routes";
import { Database } from "./database";

(async () => {
    console.log("Initializing database connection...");

    await Database.getInstance(DbConfig);
    console.log("Connected to database completed.");

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.use("/api", V1Router);

    app.listen(AppConfig.PORT, () => {
        console.log("Running dashboard server on port " + AppConfig.PORT);
    });
})();
