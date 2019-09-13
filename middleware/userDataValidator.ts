import Joi from '@hapi/joi';
import PasswordComplexity from 'joi-password-complexity';

export const validateUser = async (req, res, next) => {
    try{
    let valid = await user.validate(req.body);
    if (valid.error){
        return res.status(400).send({error: valid.error.details});
    }
    }catch (e) {
        return res.status(400).send({error: e});
    }
    next();
};

const user = Joi.object({
    password: new PasswordComplexity(),
    email: Joi.string()
        .email().required(),

    firstName: Joi.string().required(),
    lastName: Joi.string().required()
});


module.exports = {validateUser};
