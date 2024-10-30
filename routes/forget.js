const express = require('express');
const router = express.Router();

const forgetController = require('../controllers/forget');

router.post('/forgotpassword', forgetController.forgotPassword);

router.get('/resetpassword/:id', forgetController.resetPassword);

router.get('/updatepassword/:resetpasswordid', forgetController.updatePassword);

module.exports = router;
