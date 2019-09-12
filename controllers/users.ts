import db from '../db/mysql';
import User from '../models/user';

const express = require('express');
const router = new express.Router();

router.get('/users', (req, res) => {
    db.query("SELECT * FROM users", (err, data: User[]) => {
        if (err) return console.log(err);
        res.send(data);
    });
});

export default router;
