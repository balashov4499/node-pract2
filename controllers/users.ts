import {User, UserRole} from '../models/user';
import {DeleteResult} from 'typeorm';
import {isAdmin, validateUser} from '../middleware/userDataValidator';
import wrapAsync from '../middleware/requestFunctionsWrapper';
import jwt from 'jsonwebtoken'
import auth from '../middleware/auth';

const express = require('express');
const router = new express.Router();

router.get('/users', auth, isAdmin, async (req, res) => {
    res.send(await User.find());
});

router.post('/users', auth, isAdmin, validateUser, wrapAsync(async function (req, res) {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.role = req.body.role;
    await User.save(user);
    res.status(201).send(user);
}));

router.post('/users/login', wrapAsync(async function (req, res) {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    user.token = jwt.sign({ id: user.id }, 'shhhhh');
    await User.update(user.id, {token: user.token});
    return res.status(200).send(user);
}));

router.post('/users/logout', auth, wrapAsync(async function (req, res) {
    await User.update(req.user.id, {token: null});
    return res.status(200).send();
}));


router.get('/users/:id', auth, isAdmin, async (req, res) => {
    const user = await User.findOne({id: req.params.id});
    if (!user) return  res.status(404).send({error: 'No user with provided id'});
    res.send(user);
});

router.put('/users/:id', auth, isAdmin, validateUser, wrapAsync(async function (req, res) {
    const user = await User.findOne({id: req.params.id});
    if (!user) return res.status(404).send({error: 'No user with provided id'});
    const keysToUpdate = Object.keys(req.body);
    keysToUpdate.forEach((key) => user[key] = req.body[key]);
    const updated = await User.save(user);
    return res.status(201).send(updated)
}));

router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    const result: DeleteResult = await User.delete(req.params.id);
    if (result.raw.affectedRows === 0) {
        return res.status(404).send({error: 'No user with provided id'});
    }
    return res.status(200).send()
});

router.get('/user/me', auth, async (req, res) => {

    res.send(req.user);
});

router.put('/user/me', auth, validateUser, wrapAsync(async function (req, res) {
    const user = req.user;
    const keysToUpdate = Object.keys(req.body);
    keysToUpdate.forEach((key) => {
        if (key!=='role') user[key] = req.body[key]
    });
    const updated = await User.save(user);
    return res.status(201).send(updated)
}));

export default router;
