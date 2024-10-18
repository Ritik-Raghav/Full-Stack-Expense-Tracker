const express = require('express');
const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/user');

const signupRoutes = require('./routes/signup');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/signup/', signupRoutes);

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    })
