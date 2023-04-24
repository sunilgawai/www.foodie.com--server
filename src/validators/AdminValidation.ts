import Joi from "joi"

class AdminValidation {
    static post_category = (req_body: object) => Joi.object({
        name: Joi.string().max(12).required(),
        isActive: Joi.boolean().required()
    }).validate(req_body);
}

export default AdminValidation;