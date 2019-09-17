import jwt from 'jsonwebtoken';
import {User} from '../models/user';

export default async function auth(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded: any = jwt.verify(token, 'shhhhh');

        const user = await User.findOne({id: decoded.id, token: token});

        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send({error: 'Please login'})
    }

};

module.exports = auth;
