import { CustomErrorHandler, JwtService } from "../../services";
import { NextFunction, Request, Response } from "express";
import { REFRESH_TOKEN_SECRET } from "../../../config";
import { RefreshToken, User } from "../../models";
// import { IJwtPayload } from "../../@types";
import Validate from "../../validators";
import bcrypt from "bcrypt";


class AuthController {
    // Registering the user.
    public async register(req: Request, res: Response, next: NextFunction) {
        const { name, email, phone, password } = req.body;
        console.log(req.file)
        console.table(req.body);

        // Validate Request.
        const { error } = Validate.registerRequest(req.body);
        // Handle Request Error.
        if (error) {
            return next(error);
        }

        // Check if User already exists.
        let exists;
        try {
            exists = await User.findOne({ email: email });
            if (exists) {
                return next(CustomErrorHandler.alreadyExists('This email is already registered, try login or use new instead.'));
            }
        } catch (error) {
            return next(error);
        }

        // Check is user has provide avatar.
        let user_avatar = req.file?.path;
        if (req.file) {
            console.log(' avatar found')
            user_avatar = req.file.path;
            console.log(user_avatar)
        }

        // Hash the password.
        let hashedPassword = await bcrypt.hash(password, 10);

        // Register User.
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            avatar: req.file?.path ? req.file?.path : undefined
        })

        // Save user and Create JWT Access & Refresh Tokens.
        let saved_user, access_token, refresh_token;

        try {
            saved_user = await user.save();

            // Access Token;
            access_token = JwtService.sign({
                _id: saved_user._id,
                role: saved_user.role,
                email: saved_user.email
            });

            // Refresh Token saving & whitelisting.
            refresh_token = JwtService.sign({
                _id: saved_user._id,
                role: saved_user.role,
                email: saved_user.email
            }, '1w', REFRESH_TOKEN_SECRET);

            await RefreshToken.create({ refresh_token });
        } catch (error) {
            return next(error);
        }
        // Return Response.
        res.json({ access_token, refresh_token, user: saved_user })
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        // Validate Request.
        const { error } = Validate.loginRequest(req.body);
        if (error) {
            return next(error);
        }

        // Check if User exists or not
        // Compare the password.
        let user;
        try {
            user = await User.findOne({ email: req.body.email }).populate(['address', 'wishlist']).select('-__v -createdAt -updatedAt');
            if (!user) {
                return next(CustomErrorHandler.notFound("Email not found. Please enter a valid email or register first."));
            }

            let equal = await bcrypt.compare(req.body.password, user.password);
            if (!equal) {
                return next(CustomErrorHandler.wrongCredentials("password not matched, please enter a valid password"));
            }
        } catch (error) {
            return next(error);
        }

        // Create JWT & Access Tokens.
        // Database Whitelisting.
        let access_token, refresh_token;
        try {
            // Access Token;
            access_token = JwtService.sign({
                _id: user._id,
                role: user.role,
                email: user.email
            });

            // Refresh Token saving & whitelisting.
            refresh_token = JwtService.sign({
                _id: user._id,
                role: user.role,
                email: user.email
            }, '1w', REFRESH_TOKEN_SECRET);

            await RefreshToken.create({ refresh_token });
        } catch (error) {
            return next(error);
        }
        // Return Response.
        res.status(200).json({ user, access_token, refresh_token });
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        // Validate Request.
        const { error } = Validate.logoutRequest(req.body);
        if (error) {
            return next(error);
        }

        try {
            // Check if Token exists in database or not.
            await RefreshToken.findOneAndDelete({ refresh_token: req.body.refresh_token });
        } catch (error) {
            return next(new Error("Something went wrong in database!"));
        }

        res.status(200).json({ message: "You are logged out from www.foodies.com" });
    }

    public async refresh(req: Request, res: Response, next: NextFunction) {
        // Validate Request.
        const { error } = Validate.refreshRequest(req.body);
        if (error) {
            return next(error);
        }
        // Check if Token exists in database or not.
        let result, user, access_token, refresh_token;
        try {
            result = await RefreshToken.findOne({ refresh_token: req.body.refresh_token });
            if (!result?.refresh_token) {
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token."));
            }
            // verify token.
            let user_id;
            try {
                // Get user data from refresh token.
                interface IJwtPayload {
                    _id: string,
                    email: string,
                    role: string
                }
                const { _id } = await <IJwtPayload>JwtService.verify(result.refresh_token, REFRESH_TOKEN_SECRET!);
                user_id = _id;
            } catch (error) {
                return next(error);
            }

            // Check if user is in our database.
            user = await User.findOne({ _id: user_id });
            if (!user) {
                return next(CustomErrorHandler.unAuthorized("No User Found."))
            }

            // Get user data from refresh token.
            // Create JWT & Access Tokens.
            // Database Whitelisting.

            try {
                // Access Token;
                access_token = JwtService.sign({
                    _id: user._id,
                    role: user.role,
                    email: user.email
                });

                // Refresh Token saving & whitelisting.
                refresh_token = JwtService.sign({
                    _id: user._id,
                    role: user.role,
                    email: user.email
                }, '1w', REFRESH_TOKEN_SECRET);

                await RefreshToken.create({ refresh_token });
            } catch (error) {
                return next(error);
            }

        } catch (error) {
            return next(error);
        }

        // Return Response.
        res.status(200).json({ user, access_token, refresh_token });

    }
}

export default new AuthController();