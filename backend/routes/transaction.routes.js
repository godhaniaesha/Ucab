const express = require('express');
const router = express.Router();
const {getMyTransactions} = require('../controllers/transaction.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/getall', authMiddleware(['passenger','driver','superadmin']), getMyTransactions);

module.exports = router;