import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CustomErrorHandler } from "../services";
import { DEBUG_MODE } from "../../config";
import { ValidationError } from "joi";

interface IData {
    message: string
    originalError?: string
}

const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let data: IData = {
        message: "Internal Server Error",
        ...(DEBUG_MODE === 'true' && { originalError: err.message })
    }
    // Check Joi Error Instance.
    if (err instanceof ValidationError) {
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    // Check Customer error Instance.
    if(err instanceof CustomErrorHandler) {
        statusCode = err.status
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json(data);
}


export default errorHandler;