const User = require('../models/user');
const sequelize = require('../util/database');

exports.postUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ where: { email }});
        if (!user) {
            return res.status(404).json({ message: 'User not found!'})
        }
        else {
            if (user.password === password) {
                return res.status(204).json({message: 'User logged in successfully'});
            }
            else {
                res.status(401).json({ message: 'Password does not match!'})
            }
        }

    }
    catch(error) {
        res.status(404).json({ message: 'User not found!'})
        console.log(error);
    }
}