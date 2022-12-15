import { Request, Response } from "express";
import { Connection, initOracleClient } from "oracledb";
import { Database } from "../database";
import moment from "moment";

export class DashboardController {
    private db: Database;

    private columns: any = {
        FEEDNAME: {
            name: "FEEDNAME",
            field: "FEEDNAME",
            datatype: "string",
            default: "",
            position: 1,
            show: true,
        },
        FEEDTYPE: {
            name: "FEEDTYPE",
            field: "FEEDTYPE",
            datatype: "string",
            default: "",
            show: true,
            position: 2,
        },
        FEEDFREQUENCY: {
            name: "FEEDFREQUENCY",
            field: "FEEDFREQUENCY",
            datatype: "string",
            default: "",
            position: 3,
            show: true,
        },
        FILEPATH: {
            name: "FILEPATH",
            field: "FILEPATH",
            datatype: "string",
            default: "",
            position: 4,
            show: true,
        },
        FEEDDELIVERYMETHOD: {
            name: "FEEDDELIVERYMETHOD",
            field: "FEEDDELIVERYMETHOD",
            datatype: "string",
            default: "",
            position: 5,
            show: true,
        },
        FILENAME: {
            name: "FILENAME",
            field: "FILENAME",
            datatype: "string",
            default: "",
            position: 6,
            show: true,
        },
        SENDER: {
            name: "SENDER",
            field: "SENDER",
            datatype: "string",
            default: "",
            position: 7,
            show: true,
        },
        DNP: {
            name: "DNP",
            field: "DNP",
            datatype: "string",
            default: "Y",
            position: 8,
            show: false,
        },
        LASTLOADEDDATE1: {
            name: "LASTLOADEDDATE1",
            field: "LASTLOADEDDATE1",
            datatype: "date",
            default: "",
            position: 9,
            show: true,
        },
        LASTLOADEDCOUNT1: {
            name: "LASTLOADEDCOUNT1",
            field: "LASTLOADEDCOUNT1",
            datatype: "number",
            default: "",
            position: 10,
            show: true,
        },
        LASTLOADEDDATE2: {
            name: "LASTLOADEDDATE2",
            field: "LASTLOADEDDATE2",
            datatype: "date",
            default: "",
            position: 11,
            show: true,
        },
        LASTLOADEDCOUNT2: {
            name: "LASTLOADEDCOUNT2",
            field: "LASTLOADEDCOUNT2",
            datatype: "number",
            default: "",
            position: 12,
            show: true,
        },
        LASTLOADEDDATE3: {
            name: "LASTLOADEDDATE3",
            field: "LASTLOADEDDATE3",
            datatype: "date",
            default: "",
            position: 13,
            show: true,
        },
        LASTLOADEDCOUNT3: {
            name: "LASTLOADEDCOUNT3",
            field: "LASTLOADDEDCOUNT3",
            datatype: "number",
            default: "",
            position: 14,
            show: true,
        },
        LASTLOADEDDATE4: {
            name: "LASTLOADEDDATE4",
            field: "LASTLOADEDDATE4",
            datatype: "date",
            default: "",
            position: 15,
            show: true,
        },
        LASTLOADEDCOUNT4: {
            name: "LASTLOADEDCOUNT4",
            field: "LASTLOADEDCOUNT4",
            datatype: "number",
            default: "",
            position: 16,
            show: true,
        },
        LASTLOADEDDATE5: {
            name: "LASTLOADEDDATE5",
            field: "LASTLOADEDDATE5",
            datatype: "date",
            default: "",
            position: 17,
            show: true,
        },
        LASTLOADEDCOUNT5: {
            name: "LASTLOADEDCOUNT5",
            field: "LASTLOADEDCOUNT5",
            datatype: "number",
            default: "",
            position: 18,
            show: true,
        },
        FEEDSTATUS: {
            name: "FEEDSTATUS",
            field: "FEEDSTATUS",
            datatype: "string",
            default: "Active",
            position: 19,
            show: true,
        },
    };

    private constructor() {
        this.db = null as any;
    }

    static async getInstance() {
        const instance = new DashboardController();
        instance.db = Database.getInstanceInitialized();
        return instance;
    }

    async getVdpDashboardCount(opts: DashboardController.VDPDashboardOpts) {
        const filters = this.getFilterAsSqlQuery(opts);
        const filtersJoined = filters.join("and");
        let filter =
            filtersJoined || filtersJoined != ""
                ? " where " + filters.join(" and ")
                : "";
        const results = await this.db.execute(
            `
            with vdp as
            (
            select feedname,feedtype,feedfrequency,feeddeliverymethod,to_DATE(substr(lastloadeddate1,1,10),'DD-MM-YYYY') lastloadeddate,
                    ROW_NUMBER() OVER (PARTITION BY feedname,feedtype,feedfrequency,feeddeliverymethod ORDER BY to_DATE(substr(lastloadeddate1,1,10),'DD-MM-YYYY') DESC) AS ROW_NUM
            from vdp.vls
            --group by feedname,feedtype,feedfrequency,feeddeliverymethod
            )
            ,feed_cnt as
            (select vls.* from vdp
            inner join vdp.vls on
            vdp.feedname = vls.feedname
            and vdp.feedtype = vls.feedtype
            and vdp.feedfrequency = vls.feedfrequency
            and vdp.feeddeliverymethod = vls.feeddeliverymethod
            and vdp.lastloadeddate = to_DATE(substr(vls.lastloadeddate1,1,10),'DD-MM-YYYY')
            and vdp.row_num = 1)
            select feedtype, FeedStatus, count(*) Total from feed_cnt ${filter}
            group by feedtype, FeedStatus
            `
        );
        console.log("Query exec complete...!");
        const resultMap = {} as any;

        for (let row of results.rows as any[]) {
            const feedtype = row.FEEDTYPE;
            const feedStatus =
                row.FEEDSTATUS == "Active" ? "active" : "inactive";
            const total = Number(row.TOTAL);

            if (!resultMap[feedtype])
                resultMap[feedtype] = {
                    active: 0,
                    inactive: 0,
                };

            resultMap[feedtype][feedStatus] = total;
        }

        const resultList = Object.keys(resultMap).map((key: string) =>
            Object({
                feedtype: key,
                ...resultMap[key],
            })
        );
        return resultList;
    }

    getFilterAsSqlQuery(
        opts: DashboardController.VDPDashboardOpts,
        prefix = ""
    ) {
        const userFilter: any = opts.filter || {};
        const filters = [];
        const filterKeys: string[] = Object.keys(this.columns);
        for (let key of filterKeys) {
            const meta = this.columns[key] as any;
            let value = userFilter[key];
            if (!value || value === "") continue;

            if (meta.datatype === "string") value = `'${value}'`;
            else if (meta.datatype == "number") value = value;

            const queryBlock = `${prefix}${key}=${value}`;
            filters.push(queryBlock);
        }
        return filters;
    }
    async getVDPDashboard(opts: DashboardController.VDPDashboardOpts) {
        let filters = this.getFilterAsSqlQuery(opts, "vls.");
        let filter = "";
        if (filters.join("") != "") filter = " and " + filters.join(" and ");
        const results = await this.db.execute(
            `
            with vdp as
            (
            select feedname,feedtype,feedfrequency,feeddeliverymethod,to_DATE(substr(lastloadeddate1,1,10),'DD-MM-YYYY') lastloadeddate,
                    ROW_NUMBER() OVER (PARTITION BY feedname,feedtype,feedfrequency,feeddeliverymethod ORDER BY to_DATE(substr(lastloadeddate1,1,10),'DD-MM-YYYY') DESC) AS ROW_NUM
            from vdp.vls
            --group by feedname,feedtype,feedfrequency,feeddeliverymethod
            ), comm as
            (select vls.*
            from vdp
            inner join vdp.vls on
            vdp.feedname = vls.feedname
            and vdp.feedtype = vls.feedtype
            and vdp.feedfrequency = vls.feedfrequency
            and vdp.feeddeliverymethod = vls.feeddeliverymethod
            and vdp.lastloadeddate = to_DATE(substr(vls.lastloadeddate1,1,10),'DD-MM-YYYY')
            and vdp.row_num = 1  ${filter} )
            select feedname,feedtype,feedfrequency,feeddeliverymethod,filename,sender,dnp,lastloadeddate1,lastloadedcount1,lastloadeddate2,lastloadedcount2,lastloadeddate3,lastloadedcount3,lastloadeddate4,lastloadedcount4,lastloadeddate5,lastloadedcount5,
                    feedstatus,filepath,datafeedid,datafeedfileid,comments, c.id as commentid, updated_date,updated_by
            from comm
            left join vdp.vls_comments c on comm.datafeedid = c.data_feed_id and comm.datafeedfileid = c.data_feed_file_id
            order by feedname            
            `
        );

        const fields = Object.values(this.columns);
        const responseResults = {
            count: results.rows?.length,
            headers: fields,
            data: results.rows,
        };
        return responseResults;
    }

    async getPredefinedComments(){
        const query = "SELECT id, comments as name, created_date from vdp.vls_log";
        const results = await this.db.execute(query);
        return results.rows;
    }
    
    async saveComment(opts: DashboardController.SaveCommentOpts) {
        let { commentId, dataFeedFileId, dataFeedId, comment } = opts;
        comment = (comment || "").replace(/\'/gis, "''");
        if (commentId && commentId != null && commentId > 0) {
            const query = `update vdp.vls_comments set comments = '${comment}' where id = ${Number(
                commentId
            )}`;
            await this.db.executeWrite(query);
            return {
                operation: "update",
                status: true,
            };
        } else {
            const query = `insert into vdp.vls_comments(DATA_FEED_ID, DATA_FEED_FILE_ID, COMMENTS, CREATED_DATE, UPDATED_BY)
                values (
                    ${Number(dataFeedId)},
                    ${Number(dataFeedFileId)},
                    '${comment}',
                    CURRENT_DATE,
                    '${opts?.updatedBy || "Admin"}'
                )
            `;
            await this.db.executeWrite(query);
            return {
                operation: "add",
                status: true,
            };
        }
    }
}

namespace DashboardController {
    export interface VDPDashboardOpts {
        filter: {
            FEEDNAME: string;
            FEEDTYPE: string;
            FEEDFREQUENCY: string;
            FEEDDELIVERYMETHOD: string;
            FILENAME: string;
            SENDER: string;
            DNP: string;
            LASTLOADEDDATE1: string;
            LASTLOADEDCOUNT1: string;
            LASTLOADEDDATE2: string;
            LASTLOADEDCOUNT2: string;
            LASTLOADEDDATE3: string;
            LASTLOADEDCOUNT3: string;
            LASTLOADEDDATE4: string;
            LASTLOADEDCOUNT4: string;
            LASTLOADEDDATE5: string;
            LASTLOADEDCOUNT5: string;
            FEEDSTATUS: string;
            FILEPATH: string;
        };
    }

    export interface SaveCommentOpts {
        commentId?: number;
        dataFeedId?: number;
        dataFeedFileId?: number;
        comment: string;
        updatedBy?: string;
    }
}
