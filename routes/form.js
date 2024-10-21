const express = require('express');
const router = express.Router();
const formController = require('../controllers/form');

router.post('/addExpense', formController.postExpense);

router.get('/addExpense', formController.getExpense);

router.delete('/delete/:id', formController.deleteExpense);

module.exports = router;