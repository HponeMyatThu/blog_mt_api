const Joi = require('joi');

const addCategorySchema = Joi.object({
    name: Joi.string().required(),
});

const idScheme = Joi.object({
    id: Joi.string().required(),
});

const updateScheme = Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
});


module.exports = { addCategorySchema, idScheme, updateScheme };