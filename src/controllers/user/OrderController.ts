import { Request, Response, NextFunction } from "express";
import { Order, OrderItem, User } from "../../models";
import { CustomErrorHandler } from "../../services";
import Validate from "../../validators";

class OrderController {
    public async store(req: Request, res: Response, next: NextFunction) {
        // Validate request.
        const { error } = Validate.post_order_request(req.body);
        if (error) {
            return next(error);
        }
        
        // Get User.
        let user
        try {
            user = await User.findOne({ _id: req.user._id });
        } catch (error) {
            return next(error);
        }
        if (!user) {
            return next(CustomErrorHandler.unAuthorized());
        }

        // Create Order Items.
        const cart = req.body.items as {
            products: {
                [_id: string]: number
            },
            totalQty: number
        }

        let items_keys = Object.keys(cart.products);

        let order_items_ids = Promise.all(items_keys.map(async (key: string) => {
            let orderItem = new OrderItem({
                product: key,
                quantity: cart.products[key]
            })
            let saved_item = await orderItem.save();
            if(!saved_item) {
                return next(CustomErrorHandler.serverError());
            }
            return saved_item._id;
        }))
        // Need to get resolved ids from above promise.
        let resolved_items = await order_items_ids;

        // Create Order.
        const order = new Order({
            user_id: user._id,
            items: resolved_items, // We will recieve cart items an object of order items with quantity.
            status: req.body.status,
            payment_type: req.body.payment_type,
            payment_done: req.body.payment_done,
            total_price: req.body.total_price, // Needs to get this price from database. not from user.
            shipping_address: user.address[0], // This address is from user's saved addresses.
            message: req.body.message
        })
        // Place/Save Order.
        let order_result;
        try {
            order_result = await order.save();
            if (!order_result) {
                return next(CustomErrorHandler.serverError());
            }
            // console.log('saved_address', order_result);
        } catch (error) {
            return next(error);
        }

        // Update user's order details.
        let user_results;
        try {
            await user.update({
                $push: {
                    orders: order_result._id
                }
            })
            user_results = await user.save();

            console.log('updated_user_order_details', { user_results, user });
        } catch (error) {
            return next(error);
        }

        // Response to user.
        res.status(200).json({ message: "Order Placed Sucessfuly.", order: order_result })
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        const _id = req.params._id;
        let order;
        try {
            order = await Order.findOne({ _id: _id }).populate('user_id', 'shipping_address')
                .populate({
                    path: 'items', populate: 'product'
                })
            if (!order) {
                return next(CustomErrorHandler.notFound("Order Not Found"));
            }
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ order });
    }

    public async cancel(req: Request, res: Response, next: NextFunction) {
        // Needs to work in this field as user cannot delete order if it is in progress.
        const _id = req.params._id;
        let deleted;
        try {
            deleted = await Order.findByIdAndDelete({ _id: _id });
            if (!deleted) {
                return next(CustomErrorHandler.notFound("Order Not Found"));
            }
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ message: "Order Successfully deleted", order: deleted });
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        let orders;
        try {
            orders = await Order.find().populate('user_id', 'shipping_address')
                .populate({
                    path: 'items', populate: 'product'
                })
            if (!orders) {
                return next(CustomErrorHandler.notFound("Orders Not Found"));
            }
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ orders });
    }

    // Here customer will only get order history where he placed orders and not all 
    // orders from DataBase.
    public async get_history(req: Request, res: Response, next: NextFunction) {
        console.log(req)
        let history, user;
        try {
            user = await User.findOne({_id: req.user._id});
            console.log(user);
            if(!user) {
                return next(CustomErrorHandler.unAuthorized());
            }
        } catch (error) {
            return next(error);
        }
        console.log({user: user._id, req: req.user._id})
        try {
            history = await Order.find({user_id: user._id})
            .populate({
                path: 'items', populate: {
                    path: 'product', populate: 'category'
                }
            });
            console.log(history);
        } catch (error) {
            console.log(error);
            return next(error);
        }
        if(!history) {
            return next(CustomErrorHandler.notFound("No orders found."));
        }
        
        res.status(200).json({ orders: history });
    }
}

export default new OrderController;