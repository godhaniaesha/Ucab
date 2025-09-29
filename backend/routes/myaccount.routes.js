const router = require('express').Router();
const myAccountController = require('../controllers/myaccount.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');


// Get account details (GET)
router.get('/', authMiddleware(['driver','passenger','superadmin']), myAccountController.getAccount);

// Create account (POST)
router.post('/', myAccountController.createAccount);

// Update account (PUT)
router.put('/', authMiddleware(['driver','passenger','superadmin']), myAccountController.updateAccount);

module.exports = router;
