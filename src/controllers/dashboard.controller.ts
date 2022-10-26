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
        const results = await this.db.execute(
            "select * from vdp_loading_summary"
        );

        const fields = results.metaData?.map((field: any) => {
            let position = "";
            if (
                field.name.toLowerCase().indexOf("feed") != -1 &&
                field.name.toLowerCase().indexOf("name") != -1
            )
                position = "first";
            else if (
                field.name.toLowerCase().indexOf("status") != -1 &&
                field.name.toLowerCase().indexOf("feed") != -1
            )
                position = "last";

            return {
                name: field.name,
                field: field.name,
                position: position,
            };
        });

        const responseResults = {
            count: results.rows?.length,
            headers: fields,
            data: results.rows,
        };
        return responseResults;
    }
}
