const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const userObj = jwt.verify(token, 'secretkey');
        console.log('userid >>>> ' + userObj.userId);
        const user = await User.findByPk(userObj.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found!'});
        }
        req.user = user;
        next();
    }
    catch(error) {
        console.log(error);
        return res.status(401).json({success: false});
    }
};

module.exports = {
    authenticate
}