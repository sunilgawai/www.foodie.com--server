import { Router } from "express";
import { auth } from "../middlewares";
import { AddressController, CartController, ProfileController, UserController, WishListController } from "../controllers";
import OrderController from "../controllers/common/OrderController";

class UserRouter {
    public userRouter: Router;
    constructor() {
        this.userRouter = Router();
        this.initProfileRoutes();
        this.initAddressRoutes();
        this.initWishlistRoutes();
        this.initOrderRoutes();
        this.initCartRoutes();
    }

    private initProfileRoutes() {
        /**
         * Get Profile Details.
         */
        this.userRouter.get('/profile', auth, ProfileController.get);

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
        this.userRouter.post('/address', auth, AddressController.store);

        /**
         * Get address list.
         */
        this.userRouter.delete('/address/:_id', auth, AddressController.remove);
    }

    private initWishlistRoutes() {
        /**
         * Add product to wishlist.
         */
        this.userRouter.post('/wishlist', auth, WishListController.store);

        /**
         * Remove product from wishlist
         */
        this.userRouter.put('/wishlist/:_id', auth, WishListController.remove);
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

    private initCartRoutes() {
        // Get Cart.
        this.userRouter.get('/cart', auth, CartController.get);

        // POST Cart.
        this.userRouter.post('/cart', auth, CartController.add);

        // UPDATE Cart.
        this.userRouter.put('/cart', auth, CartController.update);

        // DELETE Cart.
        this.userRouter.delete('/cart', auth, CartController.delete);
    }
}

export default new UserRouter().userRouter;