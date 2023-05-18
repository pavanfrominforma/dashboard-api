import { Database } from "../database";
import moment from "moment";


export class SanctionsDashboardController{

    private db: Database;

    private columns: any = {
        "SANCTION_SOURCE": {
           "name": "SANCTION SOURCE",
           "field": "SANCTION_SOURCE",
           "datatype": "string",
           "default": "",
           "position": 1,
           "show": true
       },
        "PUBLISH_DATE": {
           "name": "PUBLISH DATE",
           "field": "PUBLISH_DATE",
           "datatype": "date",
           "default": "",
           "position": 2,
           "show": true
       },
       "VESSEL_SANCTIONS": {
           "name": "VESSEL SANCTIONS",
           "field": "VESSEL_SANCTIONS",
           "datatype": "number",
           "default": "",
           "position": 3,
           "show": true
       },
       "VSLSANCTIONS": {
           "name": "VSL SANCTIONS",
           "field": "VSLSANCTIONS",
           "datatype": "number",
           "default": "",
           "position": 4,
           "show": true
       },
       "COMPANY_SANCTIONS": {
           "name": "COMPANY SANCTIONS",
           "field": "COMPANY_SANCTIONS",
           "datatype": "number",
           "default": "",
           "position": 5,
           "show": true
       },
       "COMSANCTIONS": {
           "name": "COMSANCTIONS",
           "field": "COMSANCTIONS",
           "datatype": "number",
           "default": "",
           "position": 6,
           "show": true
       },
       "PERSON_SANCTIONS": {
           "name": "PERSON SANCTIONS",
           "field": "PERSON_SANCTIONS",
           "datatype": "number",
           "default": "",
           "position": 7,
           "show": true
       },
       "PSNSANCTIONS": {
           "name": "PSNSANCTIONS",
           "field": "PSNSANCTIONS",
           "datatype": "number",
           "default": "",
           "position": 8,
           "show": true
       },
       "VSLSANCTION_STATUS": {
           "name": "VSLSANCTION STATUS",
           "field": "VSLSANCTION_STATUS",
           "datatype": "string",
           "default": "",
           "position": 9,
           "show": true
       },
       "COMSANCTION_STATUS": {
           "name": "COMSANCTION STATUS",
           "field": "COMSANCTION_STATUS",
           "datatype": "string",
           "default": "",
           "position": 10,
           "show": true
       },

       "PSNSANCTION_STATUS": {
           "name": "PSNSANCTION STATUS",
           "field": "PSNSANCTION_STATUS",
           "datatype": "string",
           "default": "",
           "position": 11,
           "show": true
       },

       "SCHEDULE_TIME": {
           "name": "SCHEDULE TIME",
           "field": "SCHEDULE_TIME",
           "datatype": "date",
           "default": "",
           "position": 12,
           "show": true
       },
       "JOB_FOLDER": {
           "name": "JOB FOLDER",
           "field": "JOB_FOLDER",
           "datatype": "string",
           "default": "",
           "position": 13,
           "show": true
       },
       "SCCM_JOB_STARTDT": {
           "name": "SCCM JOB START DATE",
           "field": "SCCM_JOB_STARTDT",
           "datatype": "date",
           "default": "",
           "position": 14,
           "show": true
       },
       "SCCM_JOB_ENDDT": {
           "name": "SCCM_JOB_ENDDT",
           "field": "SCCM_JOB_ENDDT",
           "datatype": "date",
           "default": "",
           "position": 15,
           "show": true
       },
       "FEED_STATUS": {
           "name": "FEED STATUS",
           "field": "FEED_STATUS",
           "datatype": "string",
           "default": "",
           "position": 16,
           "show": true
       },
       
   };

    private constructor() {
        this.db = null as any;
    }

    static async getInstance() {
        const instance = new SanctionsDashboardController();
        instance.db = Database.getInstanceInitialized();
        return instance;
    }


    
    async getStatusCounts(query: string, opts: SanctionsDashboardController.SanctionsDashboardOpts){
        const filters = this.getFilterAsSqlQuery(opts);
        const filtersJoined = filters.join("and");
        let filter =
            filtersJoined || filtersJoined != ""
                ? "where "+  filters.join(" and ")
                : "";
        const newQuery = query.replace("##filters##", filter);
        const results = await this.db.execute(
            newQuery
        );
        console.log("Query exec complete...! ", results.rows);
        const resultMap = {
            active: 0,
            inactive: 0,
            due: 0
        } as any;
        
        for (let row of results.rows as any[]) {
            const feedtype = row.FEEDTYPE;
            let feedStatus = '';
            
            if(row.STATUS == 'Active' || row.STATUS.toLowerCase() == 'success')
                feedStatus = "active";
            else if(row.STATUS == 'Due')
                feedStatus = 'due';
            else if(row.STATUS == 'Failed' )
                feedStatus = 'inactive'

            const total = Number(row.COUNT);
            if (feedStatus != '')
                resultMap[feedStatus] = total;
        }

        return resultMap;
    }   

    async getSanctionsDashboardCount(opts: SanctionsDashboardController.SanctionsDashboardOpts) {
        let query = `select vslsanction_status as STATUS,count(*) as COUNT from VDP.SANCTION_SUMMARY_FOR_DASHBOARD_VW 
            ##filters## group by vslsanction_status`
        const vslSanctionStatus = await this.getStatusCounts(query, opts);
        
        query = `select comsanction_status as STATUS,count(*) as COUNT from VDP.SANCTION_SUMMARY_FOR_DASHBOARD_VW 
            ##filters## group by comsanction_status`;
        const comSanctionStatus = await this.getStatusCounts(query, opts);
        
        query = `select psnsanction_status as STATUS,count(*) as COUNT from VDP.SANCTION_SUMMARY_FOR_DASHBOARD_VW
            ##filters## group by psnsanction_status`;
        const psnSanctionStatus = await this.getStatusCounts(query, opts);

        return {
            vslStatus: vslSanctionStatus,
            comStatus: comSanctionStatus,
            psnStatus: psnSanctionStatus
        }
    }



    /**
     * Returns all the counts of VDP types.
     * @param opts 
     * @returns [{type: class, count: 10}]
     */
//     async getSanctionsDashboardCount(opts: SanctionsDashboardController.SanctionsDashboardOpts) {

//         //select vslsanction_status,count(*) Total from VDP.SANCTION_SUMMARY_FOR_DASHBOARD_VW group by vslsanction_status;
// //select comsanction_status,count(*) Total from VDP.SANCTION_SUMMARY_FOR_DASHBOARD_VW group by comsanction_status;
// //select psnsanction_status,count(*) Total from VDP.SANCTION_SUMMARY_FOR_DASHBOARD_VW group by psnsanction_status;
//         const filters = this.getFilterAsSqlQuery(opts);
//         const filtersJoined = filters.join("and");
//         let filter =
//             filtersJoined || filtersJoined != ""
//                 ? " and " + filters.join(" and ")
//                 : "";
//         const results = await this.db.execute(
//             ``
//         );
//         console.log("Query exec complete...!");
//         const resultMap = {
//             active: 0,
//             inactive: 0,
//             due: 0
//         } as any;
        
//         for (let row of results.rows as any[]) {
//             const feedtype = row.FEEDTYPE;
//             let feedStatus = '';
            
//             if(row.STATUS == 'Active')
//                 feedStatus = "active";
//             else if(row.STATUS == 'Due')
//                 feedStatus = 'due';
//             else if(row.STATUS == 'Failed')
//                 feedStatus = 'inactive'

//             const total = Number(row.COUNT);
//             if (feedStatus != '')
//                 resultMap[feedStatus] = total;
//         }

//         return resultMap;
//     }



        /**
     * Takes options and returns a sql query to apply filters.
     * @param opts 
     * @param prefix 
     * @returns 
     */
    getFilterAsSqlQuery(
        opts: SanctionsDashboardController.SanctionsDashboardOpts,
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
    
    async getSanctionDashboard(opts: SanctionsDashboardController.SanctionsDashboardOpts){
        let filters = this.getFilterAsSqlQuery(opts, "");
        let filter = "";
        if (filters.join("") != "") filter = "where " + filters.join(" and ");
        let query = `select * from VDP.SANCTION_SUMMARY_FOR_DASHBOARD_VW  ${filter} order by SANCTION_SOURCE`;
        const results = await this.db.execute(query);
        // console.log("Data is ", results)
        let fields = Object.values(this.columns);
        const responseResults = {
            count: results.rows?.length,
            headers: fields,
            data: results.rows,
        };
        return responseResults;
    }


}

namespace SanctionsDashboardController{
    export interface SanctionsDashboardOpts{
        filter: any
    }
}