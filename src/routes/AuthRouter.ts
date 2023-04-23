import { AuthController } from "../controllers";
import { Router } from "express";
import { auth, handleFormData } from "../middlewares";

class AuthRouter {
    public authRouter: Router;
    constructor() {
        this.authRouter = Router();
        this.initRoutes();
    }

    public initRoutes() {
        /**
         * Register User
         */
        this.authRouter.post('/register', handleFormData.single('avatar'), AuthController.register);

        /**
         * Login User
         */
        this.authRouter.post('/login', AuthController.login);
        /**
         * Logout User
         */
        this.authRouter.post('/logout', AuthController.logout);
        /**
         * Refresh Token
         */
        this.authRouter.post('/refresh', auth, AuthController.refresh);
        /**
         * Get User Profile.
         */

        /**
         * Reset Password
         */
    }
}

export default new AuthRouter().authRouter;