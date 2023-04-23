import { Express } from "express-serve-static-core";

interface IRequestUser {
    _id: string
    email: string
    role: "CUSTOMER" | "ADMIN" | string
}

declare module "express-serve-static-core" {
    interface Request {
        user: IRequestUser
    }
}


