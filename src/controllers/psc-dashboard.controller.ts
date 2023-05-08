import { Database } from "../database";
import moment from "moment";


export class PSCDashboardController{

    private db: Database;

    private columns: any = {
        "PSC_FEED": {
            "name": "PSC FEED",
            "field": "PSC_FEED",
            "datatype": "string",
            "default": "",
            "position": 1,
            "show": true
        },
        "MOU_CODE": {
            "name": "MOU CODE",
            "field": "MOU_CODE",
            "datatype": "string",
            "default": "",
            "position": 2,
            "show": true
        },
        "MOU_NAME": {
            "name": "MOU NAME",
            "field": "MOU_NAME",
            "datatype": "string",
            "default": "",
            "position": 3,
            "show": true
        },
        "INSP_COUNT": {
            "name": "INSP COUNT",
            "field": "INSP_COUNT",
            "datatype": "number",
            "default": "",
            "position": 4,
            "show": true
        },
        "DETAINED_COUNT": {
            "name": "DETAINED COUNT",
            "field": "DETAINED_COUNT",
            "datatype": "number",
            "default": "",
            "position": 5,
            "show": true
        },
        "INSP_COUNT_7": {
            "name": "INSP COUNT 7",
            "field": "INSP_COUNT_7",
            "datatype": "number",
            "default": "",
            "position": 6,
            "show": true
        },
        "INSP_COUNT_30": {
            "name": "INSP COUNT 30",
            "field": "INSP_COUNT_30",
            "datatype": "number",
            "default": "",
            "position": 7,
            "show": true
        },
        "DETAINED_COUNT_7": {
            "name": "DETAINED COUNT 7",
            "field": "DETAINED_COUNT_7",
            "datatype": "number",
            "default": "",
            "position": 8,
            "show": true
        },
        "DETAINED_COUNT_30": {
            "name": "DETAINED COUNT 30",
            "field": "DETAINED_COUNT_30",
            "datatype": "number",
            "default": "",
            "position": 9,
            "show": true
        },
        "DEF_COUNT_7": {
            "name": "DEF COUNT 7",
            "field": "DEF_COUNT_7",
            "datatype": "number",
            "default": "",
            "position": 10,
            "show": true
        },
        "DEF_COUNT_30": {
            "name": "DEF COUNT 30",
            "field": "DEF_COUNT_30",
            "datatype": "number",
            "default": "",
            "position": 11,
            "show": true
        },
        "CERT_COUNT_7": {
            "name": "CERT COUNT 7",
            "field": "CERT_COUNT_7",
            "datatype": "number",
            "default": "",
            "position": 12,
            "show": true
        },
        "CERT_COUNT_30": {
            "name": "CERT COUNT 30",
            "field": "CERT_COUNT_30",
            "datatype": "number",
            "default": "",
            "position": 13,
            "show": true
        },
        "EARLY_INITIAL_DATE": {
            "name": "EARLY INITIAL DATE",
            "field": "EARLY_INITIAL_DATE",
            "datatype": "date",
            "default": "",
            "position": 14,
            "show": true
        },
        "LAST_INITIAL_DATE": {
            "name": "LAST INITIAL DATE",
            "field": "LAST_INITIAL_DATE",
            "datatype": "date",
            "default": "",
            "position": 15,
            "show": true
        },
        "LAST_LOADED": {
            "name": "LAST LOADED",
            "field": "LAST_LOADED",
            "datatype": "date",
            "default": "",
            "position": 16,
            "show": true
        },
        "SCHEDULE_TIME": {
            "name": "SCHEDULE TIME",
            "field": "SCHEDULE_TIME",
            "datatype": "string",
            "default": "",
            "position": 17,
            "show": true
        },
        "JOB_FOLDER": {
            "name": "JOB FOLDER",
            "field": "JOB_FOLDER",
            "datatype": "string",
            "default": "",
            "position": 18,
            "show": true
        },
        "SCCM_JOB_STARTDT": {
            "name": "SCCM JOB STARTDT",
            "field": "SCCM_JOB_STARTDT",
            "datatype": "string",
            "default": "",
            "position": 19,
            "show": true
        },
        "SCCM_JOB_ENDDT": {
            "name": "SCCM JOB ENDDT",
            "field": "SCCM_JOB_ENDDT",
            "datatype": "string",
            "default": "",
            "position": 20,
            "show": true
        },
        "LOADING_STATUS": {
            "name": "LOADING STATUS",
            "field": "LOADING_STATUS",
            "datatype": "string",
            "default": "",
            "position": 21,
            "show": true
        },
        "FEED_STATUS": {
            "name": "FEED STATUS",
            "field": "FEED_STATUS",
            "datatype": "string",
            "default": "",
            "position": 22,
            "show": true
        },
    };

    private constructor() {
        this.db = null as any;
    }

    static async getInstance() {
        const instance = new PSCDashboardController();
        instance.db = Database.getInstanceInitialized();
        return instance;
    }


    /**
     * Returns all the counts of VDP types.
     * @param opts 
     * @returns [{type: class, count: 10}]
     */
    async getPSCDashboardCount(opts: PSCDashboardController.PSCDashboardOpts) {
        const filters = this.getFilterAsSqlQuery(opts);
        const filtersJoined = filters.join("and");
        let filter =
            filtersJoined || filtersJoined != ""
                ? " and " + filters.join(" and ")
                : "";
        const results = await this.db.execute(
            `SELECT Loading_Status as STATUS,count(*) COUNT from VDP.PSC_SUMMARY_FOR_DASHBOARD_VM 
            where psc_feed is not null ${filter} group by Loading_Status`
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
        opts: PSCDashboardController.PSCDashboardOpts,
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
                const k = `TO_TIMESTAMP(substr(${prefix}${key},1,10), 'DD-MM-YYYY hh24:mi:ss')`
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
    
    async getPSCDashboard(opts: PSCDashboardController.PSCDashboardOpts){
        let filters = this.getFilterAsSqlQuery(opts, "");
        let filter = "";
        if (filters.join("") != "") filter = " and " + filters.join(" and ");
        let query = `SELECT * from VDP.PSC_SUMMARY_FOR_DASHBOARD_VM where psc_feed is not null ${filter}`;
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

namespace PSCDashboardController{
    export interface PSCDashboardOpts{
        filter: any
    }
}