import dotenv from "dotenv";
dotenv.config();

export const {
    APP_PORT,
    DB_URL,
    DEBUG_MODE,
    JWT_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
} = process.env;