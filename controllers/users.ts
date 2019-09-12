import db from '../db/mysql';
import User from '../models/user';

const express = require('express');
const router = new express.Router();

router.get('/users', (req, res) => {
    db.query("SELECT * FROM userds", (err, data: User[]) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.send(data);
    });
});

export default router;
