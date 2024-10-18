const User = require('../models/user');
const sequelize = require('../util/database');

exports.postUser = async (req, res, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const newUser = await User.create({
            username: username,
            email: email,
            password: password
        })

        res.status(201).json(newUser);
    }
    catch(error) {
        console.log(error);
    }
}