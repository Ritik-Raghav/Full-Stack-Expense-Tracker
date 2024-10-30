const express = require('express');
const router = express.Router();

const forgetController = require('../controllers/forget');

router.post('/forgotpassword', forgetController.forgotPassword);

module.exports = router;
