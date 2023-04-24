import { Request, Response, NextFunction } from "express";
import { Address, User } from "../../models";
import { CustomErrorHandler } from "../../services";
import Validate from "../../validators";

class AddressController {
    public async store(req: Request, res: Response, next: NextFunction) {
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

    public async remove(req: Request, res: Response, next: NextFunction) {
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
}

export default new AddressController();