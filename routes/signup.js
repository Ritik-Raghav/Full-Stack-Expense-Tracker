const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signup');

router.post('/user', signupController.postUser);

module.exports = router;