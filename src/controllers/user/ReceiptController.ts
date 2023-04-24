import { Request, Response, NextFunction } from "express";

class ReceiptController {
    // Get Receipt of Order.
    public async get(req: Request, res: Response, next: NextFunction) {
        res.json({message: "You got your receipt."})
    }
}

export default new ReceiptController();