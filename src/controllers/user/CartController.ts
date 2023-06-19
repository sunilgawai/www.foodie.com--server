import { Request, Response, NextFunction } from "express";
import { CustomErrorHandler } from "../../services";
import { Cart } from "../../models";

class CartController {
    // Get cart.
    public async get(req: Request, res: Response, next: NextFunction) {
        let user_id = req.user._id;

        try {
            let cart = await Cart.findOne({ user_id: user_id })
            if (!cart) {
                return next(CustomErrorHandler.notFound("Cart not found"));
            }

            res.status(200).json({ cart });
        } catch (error) {
            return next(error);
        }
    }

    // Add to cart.
    public async add(req: Request, res: Response, next: NextFunction) {
        let user_id = req.user._id;
        let { items, totalQty } = req.body;
        let cart;

        try {
            let _cart = new Cart({
                items,
                totalQty,
                user_id
            })

            cart = await _cart.save();

            if (!cart) {
                return next(CustomErrorHandler.serverError());
            }
        } catch (error) {
            return next(error);
        }
        return res.status(200).json({ cart: cart });
    }

    // Update product in cart.
    public async update(req: Request, res: Response, next: NextFunction) {
        let user_id = req.user._id;
        let { items, totalQty } = req.body;
        let cart;

        try {

            let _cart = await Cart.findOneAndUpdate({ user_id }, {
                items,
                totalQty
            }, {
                new: true
            })

            console.log(_cart);
            if (!_cart) {
                return next(CustomErrorHandler.notFound("Cart not found"));
            }

            console.log(_cart);
            cart = await _cart.save();

        } catch (error) {
            return next(error);
        }
        return res.status(200).json({ cart: cart });
    }

    // Delete cart.
    public async delete(req: Request, res: Response, next: NextFunction) {
        let user_id = req.user._id;
        try {
            let results = await Cart.findOneAndDelete({ user_id: user_id });

            if (!results) {
                return next(CustomErrorHandler.notFound("Cart not found"));
            }

            res.status(200).json({ message: 'Cart successfully deleted' });
        } catch (error) {
            return next(error);
        }

    }
}

export default new CartController()