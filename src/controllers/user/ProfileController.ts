import { Request, Response, NextFunction } from "express";
import { User } from "../../models";
import { CustomErrorHandler } from "../../services";


class ProfileController {
    public async get(req: Request, res: Response, next: NextFunction) {
        let profile;
        try {
            profile = await User.findOne({ _id: req.user._id })
                .populate('address')
                .select('-__v -createdAt -updatedAt -password')

            if (!profile) {
                return next(CustomErrorHandler.notFound("Profile Not Found..."));
            }
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ profile });
    }
}