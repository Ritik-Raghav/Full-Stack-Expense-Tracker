const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premium');
const userAuthentication = require('../middleware/auth');

router.get('/showLeaderBoard', premiumController.getUserLeaderboard);

router.get('/downloadExpenses', userAuthentication.authenticate, premiumController.downloadExpenses);

router.post('/uploadFiles', userAuthentication.authenticate, premiumController.uploadFiles);

router.get('/uploadFiles', userAuthentication.authenticate, premiumController.downloadFiles);

module.exports = router;