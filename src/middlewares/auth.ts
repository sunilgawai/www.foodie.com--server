import { NextFunction, Request, Response } from "express";
import { CustomErrorHandler, JwtService } from "../services";
import { JWT_TOKEN_SECRET } from "../../config";
import { IJwtPayload } from "../typings";

const auth = (req: Request, res: Response, next: NextFunction) => {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }

    let token = authHeader.split(' ')[1];
    // Verify token.
    try {
        let { _id, email, role } = <IJwtPayload>JwtService.verify(token, JWT_TOKEN_SECRET);

        // Need to acctach above properties on Express.Request Interface for global accessibility.
        req.user = { _id, email, role };
        next();
    } catch (error) {
        return next(error);
    }
}

export default auth;