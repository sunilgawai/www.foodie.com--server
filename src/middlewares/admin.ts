import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { CustomErrorHandler } from "../services";

const admin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({_id: req.user._id });
        if(user?.role !== "ADMIN") {
            return next(CustomErrorHandler.unAuthorized());
        }

        next();
    } catch (error) {
        return next(error);
    }
}

export default admin;