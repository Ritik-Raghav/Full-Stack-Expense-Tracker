const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.postExpense = async (req, res, next) => {
    try {
        const user = req.user;
        console.log(user);
        const amount = req.body.amount;
        const desc = req.body.desc;
        const category = req.body.category;

        const newExpense = await user.createExpense({
            amount,
            desc,
            category
        });
        res.status(201).json(newExpense);
    }
    catch(error) {
        res.status(403).json({ message: 'request failed with status code 403'})
        console.log(error);
    }
}

exports.getExpense = async (req, res, next) => {
    try {
        const user = req.user;
        const expenses = await user.getExpenses();
        res.status(200).json(expenses);
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch expenses'});
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;
        const expense = await Expense.findByPk(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found'});
        }
        await expense.destroy();
        console.log('Expense Deleted!');
        res.status(200).json({ message: 'Expense deleted successfully!'});
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete expense'});
    }
}