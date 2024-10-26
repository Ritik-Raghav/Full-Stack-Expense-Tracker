const User = require('../models/user');
const sequelize = require('../util/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(id) {
    return jwt.sign({ userId : id}, 'secretkey');
}

exports.postUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ where: { email }});
        if (!user) {
            return res.status(404).json({ message: 'User not found!'})
        }
        else {
                bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Something went wrong'})
                }
                if (result) {
                    res.status(200).json({message: 'User logged in successfully', token: generateAccessToken(user.id)});
                }
                else {
                    return res.status(401).json({ message: 'Password does not match!'})
                }
            })
        }

    }
    catch(error) {
        res.status(404).json({ message: 'User not found!'})
        console.log(error);
    }
}
