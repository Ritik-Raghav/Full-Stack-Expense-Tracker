const sequelize = require('../util/database');
const User = require('../models/user');
const Expense = require('../models/expense');

exports.getUserLeaderboard = async (req, res, next) => {
    try {
        const userLeaderBoardDetails = await User.findAll({
            attributes: ['id', 'username', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_cost', 'DESC']]
        });
        
        res.status(200).json(userLeaderBoardDetails);
    }
    catch(error) {
        console.log(error);
    }
}
