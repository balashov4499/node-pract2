import Joi from '@hapi/joi';
import PasswordComplexity from 'joi-password-complexity';

const newUser = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
});

const updateSchema = newUser.optionalKeys("password", "email", "firstName", "lastName");

export const validateUser = async (req, res, next) => {
    const schema = req.method === 'POST' ? newUser : updateSchema;

    try {
        await schema.validate(req.body);
    } catch (e) {
        return res.status(400).send({error: e.details});
    }

    if (req.body.password) {
        try{
            await Joi.validate(req.body.password, new PasswordComplexity(), (err, value) => {
                if (err) {
                    throw err;
                }
            })
        } catch (e) {
            return res.status(400).send({error: e});
        }

    }
    next();
};

module.exports = {validateUser};
