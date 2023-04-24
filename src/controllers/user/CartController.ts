import { Request, Response, NextFunction } from "express";
import { CustomErrorHandler } from "../../services";
import Validate from "../../validators";

class CartController {
    // Add to cart.
    public async add(req: Request, res: Response, next: NextFunction) {

    }
    // Update product in cart.
    public async update(req: Request, res: Response, next: NextFunction) {
        
    }
    // Remove product from cart.
    public async remove(req: Request, res: Response, next: NextFunction) {

    }
    // Delete cart.
    public async delete(req: Request, res: Response, next: NextFunction) {

    }
}

export default new CartController()