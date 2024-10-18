const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

router.post('/user', loginController.postUser);

module.exports = router;