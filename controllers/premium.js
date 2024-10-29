const sequelize = require('../util/database');
const User = require('../models/user');
const Expense = require('../models/expense');

exports.getUserLeaderboard = async (req, res, next) => {
    try {
        const userLeaderBoardDetails = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        });
        
        res.status(200).json(userLeaderBoardDetails);
    }
    catch(error) {
        console.log(error);
    }
}
