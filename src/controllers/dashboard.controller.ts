import { Request, Response } from "express";
import { Connection, initOracleClient } from "oracledb";
import { Database } from "../database";

export class DashboardController {
    private db: Database;

    private constructor() {
        this.db = null as any;
    }

    static async getInstance() {
        const instance = new DashboardController();
        instance.db = Database.getInstanceInitialized();
        return instance;
    }

    async getVDPDashboard() {
        console.log("Executing results query");
        const results = await this.db.execute(
            "select * from vdp_loading_summary"
        );
        const responseResults = {
            count: results.rows?.length,
            headers: results.metaData?.map((data: any) => data.name),
            data: results.rows,
        };
        return responseResults;
    }
}
