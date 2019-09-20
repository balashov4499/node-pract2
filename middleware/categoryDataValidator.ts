import Joi from '@hapi/joi';

export const newCategory = Joi.object({
    name: Joi.string().min(2).max(55).required(),
    description: Joi.string(),
    parentCategory: Joi.string()
});

const updateSchema = newCategory.optionalKeys("name");

export const validateCategory = async (req, res, next) => {
    const schema = req.method === 'POST' ? newCategory : updateSchema;
    try {
        await schema.validate(req.body);
    } catch (e) {
        return res.status(400).send({error: e.details});
    }
    next();
};

module.exports = {validateCategory, newCategory};
