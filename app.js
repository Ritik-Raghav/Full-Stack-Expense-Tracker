const express = require('express');
const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const formRoutes = require('./routes/form');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/signup/', signupRoutes);

app.use('/login/', loginRoutes);

app.use('/expense/' , formRoutes);

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    })
