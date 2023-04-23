import { Router } from "express";
import { auth } from "../middlewares";
import { UserController } from "../controllers";
import OrderController from "../controllers/common/OrderController";

class UserRouter {
    public userRouter: Router;
    constructor() {
        this.userRouter = Router();
        this.initProfileRoutes();
        this.initAddressRoutes();
        this.initWishlistRoutes();
        this.initOrderRoutes();
    }

    private initProfileRoutes() {
        /**
         * Get Profile Details.
         */
        this.userRouter.get('/profile', auth, UserController.get_profile);

        /**
         * Update Profile Details.
         */
        this.userRouter.put('/profile');

        /**
         * Get Order History.
         */
        this.userRouter.get('/order');

        /**
         * Delete Order.
         */
        this.userRouter.delete('/order/:_id');
    }

    private initAddressRoutes() {
        /**
         * Create/Store address.
         */
        this.userRouter.post('/address', auth, UserController.post_address);

        /**
         * Get address list.
         */
        this.userRouter.delete('/address/:_id', auth, UserController.delete_address);
    }

    private initWishlistRoutes() {
        /**
         * Add product to wishlist.
         */
        this.userRouter.post('/wishlist', auth, UserController.add_to_wishlist);

        /**
         * Remove product from wishlist
         */
        this.userRouter.put('/wishlist/:_id', auth, UserController.remove_from_wishlist);
    }

    private initOrderRoutes() {
        /**
         * Place Order
         */
        this.userRouter.post('/order', auth, OrderController.store);

         /**
         * Get All Orders.
         */
        this.userRouter.get('/order', auth, OrderController.getAll);

        /**
         * Get One Order.
         */
        this.userRouter.get('/order/:_id', auth, OrderController.get);

        /**
          * Delete Order.
          */
        this.userRouter.delete('/order/:_id', auth, OrderController.delete);

        /**
         * Get Order History.
         */
        this.userRouter.get('/order/history', auth, OrderController.history);

    }
}

export default new UserRouter().userRouter;