import { NextFunction, Request, Response } from "express";
import Validate from "../../validators";
import { Address, User } from "../../models";
import { CustomErrorHandler } from "../../services";
class UserController {
    /**
     * Get user Details
     * @param req _id
     * @param res user details
     * @param next error
     */
    public async get_profile(req: Request, res: Response, next: NextFunction) {
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

    public async post_address(req: Request, res: Response, next: NextFunction) {
        // Validate Request..
        const { error } = Validate.postAddress(req.body);
        if (error) {
            return next(error);
        }

        // Get Logged In user.
        let user;
        try {
            user = await User.findById({ _id: req.user._id });
            // console.log('data', { user, req: req.user })
            if (!user) {
                return next(CustomErrorHandler.serverError());
            }
        } catch (error) {
            return next(error);
        }

        // Create and save address.
        const address = new Address({
            address_type: req.body.address_type,
            country: req.body.country,
            state_province_region: req.body.state_province_region,
            city_town: req.body.city_town,
            zip_postal_code: req.body.zip_postal_code,
            street: req.body.street,
            landmark: req.body.landmark,
            secondary_contact: req.body.secondary_contact,
            latitude: req.body.latitude ? req.body.latitude : undefined,
            longitude: req.body.longitude ? req.body.longitude : undefined
        });
        let saved_address;

        try {
            saved_address = await address.save();
            await user.updateOne({
                $push: {
                    address: saved_address._id
                }
            });
        } catch (error) {
            return next(error);
        }

        res.status(200).json({ updated_address: saved_address });
    }

    public async delete_address(req: Request, res: Response, next: NextFunction) {
        const _id = req.params._id;
        console.log("id", req.params._id)
        let result;
        try {
            result = await Address.findByIdAndDelete({ _id });
            if (!result) {
                return next(CustomErrorHandler.notFound("Address not found. May be already deleted."));
            }

            // Delete Address _id from user's account.
            try {
                await User.findByIdAndUpdate({ _id: req.user._id }, {
                    $pull: {
                        address: _id
                    }
                })
            } catch (error) {
                return next(error);
            }

        } catch (error) {
            return next(error);
        }
        res.status(200).json({ message: "address deleted" });
    }

    public async add_to_wishlist(req: Request, res: Response, next: NextFunction) {
        const { _id } = req.body;
        let results, already_exists;
        let message = "Already added to wishlist.";
        try {
            already_exists = await User.findOne({
                wishlist: {
                    _id: _id
                }
            })
        } catch (error) {
            return next(error);
        }
        if (!already_exists) {
            message = "Product Added to Wishlist.";
            try {
                results = await User.findByIdAndUpdate({ _id: req.user._id }, {
                    $push: {
                        wishlist: _id
                    }
                })
            } catch (error) {
                return next(error);
            }

            if (!results) {
                return next(CustomErrorHandler.serverError());
            }
        }

        res.status(200).json({ message });
    }

    public async remove_from_wishlist(req: Request, res: Response, next: NextFunction) {
        const { _id } = req.params;
        // Get logged in user.
        let user, deleted, message;
        message = "Product was not in wishlist."
        try {
            user = await User.findById({ _id: req.user._id });
        } catch (error) {
            return next(error);
        }
        
        if (user) {
            console.log('user found', user.wishlist.find((key) => key.toString() == _id));
            // Check if product is in wishlist.
            // if (user.wishlist.find((key) => key.toString() == _id)) {
            //     console.log('product found in wishlist');
            //     try {
            //         deleted = await user.update({
            //             $pull: {
            //                 wishlist: _id
            //             }
            //         });
            //         if (deleted) {
            //             message = "product deleted from wishlist";
            //             console.log('product deleted from wishlist');
            //         }
            //     } catch (error) {
            //         return next(error);
            //     }
            // }

            try {
                await user?.save();
            } catch (error) {
                return next(error);
            }

        }

        // Save the updated details.

        // If not res.
        // Delete product if present.
        // Respond.

        // let results, message, product_found;
        // try {
        //     product_found = await User.findOne({ wishlist: _id });
        //     console.log('product found')
        // } catch (error) {
        //     return next(error);
        // }

        // try {
        //     results = await User.findByIdAndUpdate({ _id: req.user._id }, {
        //         $pull: {
        //             wishlist: _id
        //         }
        //     });
        //     console.log('results', results)
        // } catch (error) {
        //     return next(error);
        // }
        // message = "product was not in wishlist.";

        // if (results) {
        //     console.log('inside if products', !results)
        //     message = "Product deleted from wishlist.";
        // }
        // if (!results) {
        //     message = "Already removed from wishlist."
        // return next(CustomErrorHandler.notFound("Product not found in wishlist."));
        // }
        res.status(200).json({ message });
    }
}

export default new UserController();