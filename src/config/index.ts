import dotenv from "dotenv";

dotenv.config();

export const AppConfig = {
    PORT: process.env.PORT,
    ORACLE_CONFIG_PATH: process.env.ORACLE_CONFIG_PATH,
    CACHE_TTL: Number(process.env.CACHE_TTL),
};

export const DbConfig = {
    user: process.env?.DB_USERNAME as string,
    password: process.env?.DB_PASSWORD as string,
    connectionString: process.env?.DB_CONNECTION_STRING as string,
    poolIncrement: 0,
    poolMax: 4,
    poolMin: 4
};
