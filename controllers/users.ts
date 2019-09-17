import {User} from '../models/user';
import {DeleteResult} from 'typeorm';
import {validateUser} from '../middleware/userDataValidator';
import wrapAsync from '../middleware/requestFunctionsWrapper';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import auth from '../middleware/auth';

const express = require('express');
const router = new express.Router();

router.get('/users', auth, async (req, res) => {
    res.send(await User.find());
});

router.post('/users', validateUser, wrapAsync(async function (req, res) {

    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    await User.save(user);
    res.status(201).send(user);
}));

router.post('/users/login', wrapAsync(async function (req, res) {
    const user = await findByCredentials(req.body.email, req.body.password);
    user.token = jwt.sign({ id: user.id }, 'shhhhh');
    await User.update(user.id, {token: user.token});
    res.status(200).send(user);
}));

router.post('/users/logout', auth,  wrapAsync(async function (req, res) {
    await User.update(req.user.id, {token: null});
    res.status(200).send();
}));


router.get('/users/:id', async (req, res) => {
    const user = await User.findOne({id: req.params.id});
    if (!user) res.status(404).send({error: 'No user with provided id'});
    res.send(user);
});

router.put('/users/:id', validateUser, wrapAsync(async function (req, res) {
    const user = await User.findOne({id: req.params.id});
    if (!user) return res.status(404).send({error: 'No user with provided id'});
    const keysToUpdate = Object.keys(req.body);
    keysToUpdate.forEach((key) => user[key] = req.body[key]);
    const updated = await User.save(user);
    res.status(201).send(updated)
}));

router.delete('/users/:id', async (req, res) => {
    const result: DeleteResult = await User.delete(req.params.id);
    if (result.raw.affectedRows === 0) {
        res.status(404).send({error: 'No user with provided id'});
    }
    res.status(200).send()
});

async function findByCredentials(email, password): Promise<User> {
    const user = await User.findOne({email});
    if (!user) throw new Error('unable to login');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('unable to login');
    return user;
}

export default router;
