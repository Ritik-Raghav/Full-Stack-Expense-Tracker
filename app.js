require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const formRoutes = require('./routes/form');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/signup/', signupRoutes);

app.use('/login/', loginRoutes);

app.use('/expense/' , formRoutes);

app.use('/purchase/', purchaseRoutes);

app.use('/premium/', premiumRoutes);

Expense.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Expense);

Order.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Order);

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    })
