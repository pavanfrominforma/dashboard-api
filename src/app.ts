import express from "express";
import { AppConfig } from "./config";
import cors from "cors";
import bodyParser from "body-parser";
import { V1Router } from "./routes";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", V1Router);

app.listen(AppConfig.PORT, () => {
    console.log("Running dashboard server on port " + AppConfig.PORT);
});
