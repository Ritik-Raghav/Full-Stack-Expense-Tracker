require('dotenv').config();
const express = require('express');
const app = express();

const path =  require('path');
const fs =  require('fs');


const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const Forgotpassword = require('./models/forgotpassword');
const Files = require('./models/files');

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const formRoutes = require('./routes/form');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const forgetRoutes = require('./routes/forget');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a'});

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/signup/', signupRoutes);

app.use('/login/', loginRoutes);

app.use('/expense/' , formRoutes);

app.use('/purchase/', purchaseRoutes);

app.use('/premium/', premiumRoutes);

app.use('/password/', forgetRoutes);

Expense.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Expense);

Order.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Order);

Forgotpassword.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Forgotpassword);

Files.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Files);



const syncDB = () => {
	sequelize.sync().then(()=>{console.log("Synced!! ")});
}
app.listen(3000,()=>console.log("listening"))



