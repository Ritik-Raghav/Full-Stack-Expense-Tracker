const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premium');

router.get('/showLeaderBoard', premiumController.getUserLeaderboard);

module.exports = router;