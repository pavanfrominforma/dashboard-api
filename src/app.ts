import express from 'express';
import { AppConfig } from './config';


const app = express();

app.listen(AppConfig.PORT, () => {
    console.log("Running dashboard server on port " + AppConfig.PORT);
})