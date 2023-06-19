import Joi, { object } from "joi";

class Validate {
    static registerRequest = (req_body: object) => Joi.object({
        avatar: Joi.string(),
        name: Joi.string().min(6).max(20).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(10).max(10).required(),
        password: Joi.string().min(6).max(16).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: Joi.ref('password')
    }).validate(req_body)

    static loginRequest = (req_body: object) => Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(16).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    }).validate(req_body)

    static logoutRequest = (req_body: object) => Joi.object({
        refresh_token: Joi.string().required()
    }).validate(req_body)

    static refreshRequest = (req_body: object) => Joi.object({
        refresh_token: Joi.string().required()
    }).validate(req_body)

    // Admin requests...
    static admin_product_request = (req_body: object) => Joi.object({
        name: Joi.string().max(30).required(),
        price: Joi.string().min(3).max(7).required(),
        size: Joi.string().required(),
        description: Joi.string().min(12).max(300).required(),
        details: Joi.string().min(12).max(300).required(),
        // image: Joi.string().required(),
        // images: Joi.array().required(),
        isFeatured: Joi.boolean().required(),
        isActive: Joi.boolean(),
        category: Joi.string().required(),
        countInStock: Joi.number().required(),
        ratings: Joi.number().required(),
        descount: Joi.string(),
        reviews: Joi.string(),
    }).validate(req_body);

    static admin_category_request = (req_body: object) => Joi.object({
        name: Joi.string().max(12).required(),
        isActive: Joi.boolean().required(),
        icon: Joi.string(),
    }).validate(req_body);

    // User Requests...
    static postAddress = (req_body: object) => Joi.object({
        address_type: Joi.string().required(),
        country: Joi.string().required(),
        state_province_region: Joi.string().required(),
        city_town: Joi.string().required(),
        zip_postal_code: Joi.number().required(),
        street: Joi.string().required(),
        landmark: Joi.string().required(),
        secondary_contact: Joi.number().required(),
        latitude: Joi.string(),
        longitude: Joi.string()
    }).validate(req_body)

    static post_order_request = (req_body: object) => Joi.object({
        items: Joi.object().required(),
        status: Joi.string().required(),
        payment_type: Joi.string().required(),
        payment_done: Joi.boolean().required(),
        total_price: Joi.number().required(),
        shipping_address: Joi.string().required(),
        message: Joi.string(),
    }).validate(req_body)
}
export { default as AdminValidation } from "./AdminValidation"
export default Validate;