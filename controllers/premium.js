const sequelize = require('../util/database');
const User = require('../models/user');
const Expense = require('../models/expense');

exports.getUserLeaderboard = async (req, res, next) => {
    try {
        const users = await User.findAll();
        const expense = await Expense.findAll();
        const userAggregatedExpenses = {};

        expense.forEach(expense => {
            if (userAggregatedExpenses[expense.userId]) {
                userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.amount;
            }
            else {
                userAggregatedExpenses[expense.userId] = expense.amount;
            }
        })

        var userLeaderBoardDetails = [];
        users.forEach(user => {
            userLeaderBoardDetails.push({name: user.username, total_cost: userAggregatedExpenses[user.id] || 0});
        });
        userLeaderBoardDetails.sort((a, b) => a.total_cost - b.total_cost);
        userLeaderBoardDetails.reverse();
        console.log(userLeaderBoardDetails);
        res.status(200).json(userLeaderBoardDetails);
    }
    catch(error) {
        console.log(error);
    }
}
