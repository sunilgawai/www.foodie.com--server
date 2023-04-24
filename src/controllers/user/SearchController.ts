import { Request, Response, NextFunction } from "express";

class SearchController {
    // Get Receipt of Order.
    public async get(req: Request, res: Response, next: NextFunction) {
        res.json({message: "You got your results."})
    }
}

export default new SearchController();