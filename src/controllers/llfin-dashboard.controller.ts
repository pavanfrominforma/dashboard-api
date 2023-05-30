import { Database } from "../database";
import moment from "moment";


export class LLFINDashboardController{

    private db: Database;

    private columns: any = {
        "LLFIN_FEED_NAME": {
            "name": "LLFIN FEED NAME",
            "field": "LLFIN_FEED_NAME",
            "datatype": "string",
            "default": "",
            "position": 1,
            "show": true
        },
        "SCHEMA_NAME": {
            "name": "SCHEMA NAME",
            "field": "SCHEMA_NAME",
            "datatype": "string",
            "default": "",
            "position": 2,
            "show": true
        },
        "TABLE_NAME": {
            "name": "TABLE NAME",
            "field": "TABLE_NAME",
            "datatype": "string",
            "default": "",
            "position": 3,
            "show": true
        },

        "INDEXDATE_1": {
            "name": "INDEX DATE 1",
            "field": "INDEXDATE_1",
            "datatype": "date",
            "default": "",
            "position": 4,
            "show": true
        },
        "INDEXDATE_2": {
            "name": "INDEX DATE 2",
            "field": "INDEXDATE_2",
            "datatype": "date",
            "default": "",
            "position": 5,
            "show": true
        },
        "INDEXDATE_3": {
            "name": "INDEX DATE 3",
            "field": "INDEXDATE_3",
            "datatype": "date",
            "default": "",
            "position": 6,
            "show": true
        },
        "INDEXDATE_4": {
            "name": "INDEX DATE 4",
            "field": "INDEXDATE_4",
            "datatype": "date",
            "default": "",
            "position": 7,
            "show": true
        },
        "INDEXDATE_5": {
            "name": "INDEX DATE 5",
            "field": "INDEXDATE_5",
            "datatype": "date",
            "default": "",
            "position": 8,
            "show": true
        },
        "INDEXDATE_6": {
            "name": "INDEX DATE 6",
            "field": "INDEXDATE_6",
            "datatype": "date",
            "default": "",
            "position": 9,
            "show": true
        },
        "INDEXDATE_7": {
            "name": "INDEX DATE 7",
            "field": "INDEXDATE_7",
            "datatype": "date",
            "default": "",
            "position": 10,
            "show": true
        },
        "SCHEDULE_TIME": {
            "name": "SCHEDULE_TIME",
            "field": "SCHEDULE_TIME",
            "datatype": "string",
            "default": "",
            "position": 11,
            "show": true
        },
        "JOB_FOLDER": {
            "name": "JOB_FOLDER",
            "field": "JOB_FOLDER",
            "datatype": "string",
            "default": "",
            "position": 12,
            "show": true
        },
        "SCCM_JOB_STARTDT": {
            "name": "SCCM_JOB_STARTDT",
            "field": "SCCM_JOB_STARTDT",
            "datatype": "date",
            "default": "",
            "position": 13,
            "show": true
        },
        "SCCM_JOB_ENDDT": {
            "name": "SCCM_JOB_ENDDT",
            "field": "SCCM_JOB_ENDDT",
            "datatype": "date",
            "default": "",
            "position": 14,
            "show": true
        },
        "STATUS": {
            "name": "STATUS",
            "field": "STATUS",
            "datatype": "string",
            "default": "",
            "position": 15,
            "show": true
        },
          "FEED_STATUS": {
            "name": "FEED_STATUS",
            "field": "FEED_STATUS",
            "datatype": "string",
            "default": "",
            "position": 16,
            "show": true
        }
    };
    

    private constructor() {
        this.db = null as any;
    }

    static async getInstance() {
        const instance = new LLFINDashboardController();
        instance.db = Database.getInstanceInitialized();
        return instance;
    }


    /**
     * Returns all the counts of VDP types.
     * @param opts 
     * @returns [{type: class, count: 10}]
     */
    async getLLFINDashboardCount(opts: LLFINDashboardController.LLFINDashboardOpts) {
        const filters = this.getFilterAsSqlQuery(opts);
        const filtersJoined = filters.join("and");
        let filter =
            filtersJoined || filtersJoined != ""
                ? " and " + filters.join(" and ")
                : "";
        const results = await this.db.execute(
            `select STATUS,COUNT(*) COUNT from vdp.llfin_summary_dash where status is not null ${filter} group by STATUS`
        );
        console.log("Query exec complete...!");
        const resultMap = {
            active: 0,
            inactive: 0,
            due: 0
        } as any;
        
        for (let row of results.rows as any[]) {
            const feedtype = row.FEEDTYPE;
            let feedStatus = '';
            
            if(row.STATUS == 'Active')
                feedStatus = "active";
            else if(row.STATUS == 'Due')
                feedStatus = 'due';
            else if(row.STATUS == 'Failed')
                feedStatus = 'inactive'

            const total = Number(row.COUNT);
            if (feedStatus != '')
                resultMap[feedStatus] = total;
        }

        return resultMap;
    }



        /**
     * Takes options and returns a sql query to apply filters.
     * @param opts 
     * @param prefix 
     * @returns 
     */
    getFilterAsSqlQuery(
        opts: LLFINDashboardController.LLFINDashboardOpts,
        prefix = ""
    ) {
        const userFilter: any = opts.filter || {};
        const filters = [];
        const filterKeys: string[] = Object.keys(this.columns);
        for (let key of filterKeys) {
            const meta = this.columns[key] as any;
            let value = userFilter[key];
            let queryBlock = '';

            if (!value || value === "") continue;

            if (meta.datatype === "string"){
                value = `${value.toLowerCase()}`;
                queryBlock = `LOWER(${prefix}${key}) LIKE '%${value}%'`
            }
            else if (meta.datatype == "number"){
                queryBlock = `${prefix}${key}=${value}`;
            }else if(meta.datatype == 'date'){

                queryBlock = '';
                let sd = null, ed = null;

                if(value.startDate) 
                    sd = moment(value.startDate).startOf('d').format("YYYY-MMM-DD HH:mm:ss").toUpperCase();

                if(value.endDate)
                    ed = moment(value.endDate).endOf('d').format('YYYY-MMM-DD HH:mm:ss').toUpperCase();
                    
                const ORACLE_FORMAT = "YYYY-MM-DD hh24:mi:ss";
                const k = `TO_TIMESTAMP(substr(${prefix}${key},1,10) DEFAULT NULL ON CONVERSION ERROR, 'DD-MM-YYYY hh24:mi:ss')`
                if(sd && ed) 
                    queryBlock = `${k} BETWEEN TO_TIMESTAMP('${sd}', '${ORACLE_FORMAT}') 
                        AND TO_TIMESTAMP('${ed}', '${ORACLE_FORMAT}') `;
                else if(sd && !ed)
                    queryBlock = `${k} >= TO_TIMESTAMP('${sd}', '${ORACLE_FORMAT}') `
                else if(ed && !sd)
                    queryBlock =  `${k} <= TO_TIMESTAMP('${sd}', '${ORACLE_FORMAT}') `
            } 

            if(queryBlock == '') continue;
            filters.push(queryBlock);
        }
        return filters;
    }
    
    async getLLFINDashboard(opts: LLFINDashboardController.LLFINDashboardOpts){
        let filters = this.getFilterAsSqlQuery(opts, "");
        let filter = "";
        if (filters.join("") != "") filter = " and " + filters.join(" and ");
        let query = `select * from vdp.llfin_summary_dash where status is not null ${filter}`;
        const results = await this.db.execute(query);
        let fields = Object.values(this.columns);
        const responseResults = {
            count: results.rows?.length,
            headers: fields,
            data: results.rows,
        };
        return responseResults;
    }


}

namespace LLFINDashboardController{
    export interface LLFINDashboardOpts{
        filter: any
    }
}