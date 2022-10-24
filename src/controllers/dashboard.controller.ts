import { Request, Response } from 'express';


export class DashboardController{

    private constructor(){ };

    static async getInstance(){
        const instance = new DashboardController();
        return instance;
    }

    getVDPDashboard(){

    }
}
