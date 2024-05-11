const Joi = require("joi");

module.exports.joiSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required()
}).required();