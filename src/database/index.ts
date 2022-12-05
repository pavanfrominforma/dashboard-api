import {
    getConnection,
    Connection,
    Result,
    initOracleClient,
    OUT_FORMAT_OBJECT,
} from "oracledb";
import { DbConnectionError } from "../utils/exceptions";
import { AppConfig, DbConfig } from "../config";

export class Database {
    private static db: Database;

    private connection: Connection;

    private constructor(private opts: Database.InitOptions) {
        this.connection = null as any;
    }

    private async initialize() {
        console.log("Config ", DbConfig.connectionString);
        initOracleClient({ libDir: AppConfig.ORACLE_CONFIG_PATH });
        this.connection = await getConnection(this.opts);
    }
    static async getInstance(opts: Database.InitOptions) {
        if (Database.db) return Database.db;
        Database.db = new Database(opts);
        await Database.db.initialize();
        return Database.db;
    }

    static getInstanceInitialized() {
        return Database.db;
    }

    public static getConnection(): Connection {
        if (!Database.db)
            throw new DbConnectionError(
                "Connection not initialized, call getInstance method."
            );
        return Database.db.connection;
    }

    public async executeWrite(query: string): Promise<any>{
        console.log("Executing write query ", query);
        const results = await this.connection.execute(query);
        console.log("Write results ", results);
    }

    public async execute(query: string): Promise<Result<any>> {
        console.log("EXecuting query ", query);
        const records = await this.connection.execute(query, [], {
            outFormat: OUT_FORMAT_OBJECT,
        });
        console.log("Query execution complete ");
        return records;
    }
}

export namespace Database {
    export interface InitOptions {
        user: string;
        password: string;
        connectionString: string;
    }
}
