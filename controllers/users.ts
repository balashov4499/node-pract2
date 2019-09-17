import {User} from '../models/user';
import {DeleteResult} from 'typeorm';
import {validateUser} from '../middleware/userDataValidator';
import bcrypt from 'bcryptjs'
import wrapAsync from '../middleware/requestFunctionsWrapper';

const express = require('express');
const router = new express.Router();

router.get('/users', async (req, res) => {
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

router.get('/users/:id', async (req, res) => {
    const user = await User.findOne({id: req.params.id});
    if (!user) res.status(404).send({error: 'No user with provided id'});
    res.send(user);
});

router.put('/users/:id', validateUser, wrapAsync(async function (req, res) {
    const user = await User.findOne({id: req.params.id});
    if (!user)  return res.status(404).send({error: 'No user with provided id'});
    const keysToUpdate = Object.keys(req.body);
    keysToUpdate.forEach((key) => user[key] = req.body[key])
    const updated = await User.save(user);
    res.status(201).send()
}));

router.delete('/users/:id', async (req, res) => {
    const result: DeleteResult = await User.delete(req.params.id);
    if (result.raw.affectedRows === 0) {
        res.status(404).send({error: 'No user with provided id'});
    }
    res.status(200).send()
});

export default router;
