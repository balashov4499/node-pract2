import Joi from '@hapi/joi';
import {Product} from '../../models/product';
import {newCategory} from './categoryDataValidator';


const product = Joi.object({
    name: Joi.string().min(2).max(55).required(),
    description: Joi.string(),
    categories: Joi.array().items(Joi.string())
});

const updateSchema = product.optionalKeys("name",);

export const validateNewProduct = async (req, res, next) => {
    const schema = req.method === 'POST' ? product : updateSchema;
    try {
        await schema.validate(req.body);
    } catch (e) {
        return res.status(400).send({error: e.details});
    }
    next();
};

module.exports = {validateNewProduct};
