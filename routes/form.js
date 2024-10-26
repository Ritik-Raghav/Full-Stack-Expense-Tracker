const express = require('express');
const router = express.Router();
const formController = require('../controllers/form');
const userAuthentication = require('../middleware/auth');

router.post('/addExpense', userAuthentication.authenticate, formController.postExpense);

router.get('/addExpense', userAuthentication.authenticate, formController.getExpense);

router.get('/getUser', userAuthentication.authenticate, formController.getUser);

router.delete('/delete/:id', formController.deleteExpense);

module.exports = router;