const User = require('../models/user');
const sequelize = require('../util/database');
const bcrypt = require('bcrypt');

exports.postUser = async (req, res, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        bcrypt.hash(password, 10, async (err, hash) => {
            console.log(err);
            const newUser = await User.create({
                username: username,
                email: email,
                password: hash
            });
            res.status(201).json(newUser);
        })
    }
    catch(error) {
        res.status(403).json({ message: 'request failed with status code 403'})
        console.log(error);
    }
}