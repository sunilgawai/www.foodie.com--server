import { CategoryController, ProductController } from "../controllers";
import { Router } from "express";
import { handleFormData } from "../middlewares";

class AuthRouter {
    public adminRouter: Router;
    constructor() {
        this.adminRouter = Router();
        this.initCategoryRoutes();
        this.initProductRoutes();
        this.initDiscountCouponRoutes();
        this.initOrderRoutes();
        this.initOrderHistoryRoutes();
    }

    private initCategoryRoutes() {
        /**
         * Store Category.
         */
        this.adminRouter.post('/category', handleFormData.single('icon'), CategoryController.store);

        /**
         * Get Category.
         */
        this.adminRouter.get('/category', CategoryController.get);

        /**
         * Update Category.
         */
        this.adminRouter.put('/category/:_id', CategoryController.update);

        /**
         * Delete Category.
         */
        this.adminRouter.delete('/category/:_id', CategoryController.delete);
    }

    private initProductRoutes() {
        /**
         * Store Product
         */
        this.adminRouter.post('/products', handleFormData.fields([{
            name: 'image',
            maxCount: 1
        },
        {
            name: 'images',
            maxCount: 4
        }]), ProductController.create);

        /**
         * Get Products
         */
        this.adminRouter.get('/products', ProductController.get);

        /**
         * Update Products
         */
        this.adminRouter.put('/products/:_id', handleFormData.fields([{
            name: 'image',
            maxCount: 1
        },
        {
            name: 'images',
            maxCount: 4
        }]), ProductController.update);

        /**
         * Delete Product.
         */
        this.adminRouter.delete('/products/:_id', ProductController.delete);
    }

    private initDiscountCouponRoutes() {
        /**
         * Store Coupon Code.
         */

        this.adminRouter.post('/coupon');
        /**
         * Get Coupon Code.
         */

        this.adminRouter.get('/coupon');
        /**
         * Update Coupon Code.
         */
        this.adminRouter.put('/coupon/:_id');

        /**
         * Delete Coupon Code.
         */
        this.adminRouter.delete('/coupon/:_id');
    }

    private initOrderRoutes() {
        /**
         * Update User Order.
         */
        this.adminRouter.put('/order/:_id');

        /**
         * Delete User Order.
         */
        this.adminRouter.delete('/order/:_id');
    }

    private initOrderHistoryRoutes() {
        /**
         * Get Order History.
         */
        this.adminRouter.get('order-history');

        /**
         * Update Order History.
         */
        this.adminRouter.put('order-history');

        /**
         * Delete Order History.
         */
        this.adminRouter.delete('/order-history/:_id')
    }
}

export default new AuthRouter().adminRouter;