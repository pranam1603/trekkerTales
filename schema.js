const Joi = require("joi");

module.exports.joiTreksitesSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required()
}).required();

module.exports.joiReviewSchema = Joi.object({
    rating: Joi.number().required(),
    review: Joi.string().required()
}).required();