import { Request, Response, NextFunction } from "express";
import { User } from "../../models";
import { CustomErrorHandler } from "../../services";

class WishListController {
    public async store(req: Request, res: Response, next: NextFunction) {
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

    public async remove(req: Request, res: Response, next: NextFunction) {
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

export default new WishListController();