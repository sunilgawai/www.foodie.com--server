import { NextFunction, Request, Response } from "express";

class AdminController {
    public async store(req: Request, res: Response, next: NextFunction) { }
}

export default new AdminController();