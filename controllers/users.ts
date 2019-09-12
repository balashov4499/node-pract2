import {User} from '../models/user';

const express = require('express');
const router = new express.Router();

router.get('/users', async (req, res) => {
    try {
        res.send(await User.find());
    } catch (e) {
        res.status(500).send()
    }
});

router.post('/users', async (req, res) => {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;

    try {
        await User.save(user);
        res.status(201).send(user);
    } catch (e) {
        res.status(500).send(e)
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        res.send(await User.findOne({id: req.params.id}));
    } catch (e) {
        res.status(500).send()
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        await User.update(req.params.id, req.body);
        res.status(202).send()
    } catch (e) {
        res.status(500).send()
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await User.delete(req.params.id);
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
});

export default router;
