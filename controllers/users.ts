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
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = hashedPassword;
    await User.save(user);
    res.status(201).send(user);
}));

router.get('/users/:id', async (req, res) => {
    const user = await User.findOne({id: req.params.id});
    if (!user) res.status(404).send({error: 'No user with provided id'});
    res.send(user);
});

router.put('/users/:id', validateUser, wrapAsync(async function (req, res) {
    const updated = await User.update(req.params.id, {...req.body});
    if (updated.raw.affectedRows === 0) {
        res.status(404).send({error: 'No user with provided id'});
    }
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
