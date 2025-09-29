const router = require('express').Router();
const bankController = require('../controllers/bank.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');


// Get bankDetails and paymentMethods (GET)
router.get('/', authMiddleware(['driver','passenger','superadmin']), bankController.getBankPayment);

// Add bankDetails and paymentMethods
router.post('/', authMiddleware(['driver','passenger','superadmin']), bankController.addBankPayment);

// Edit bankDetails and paymentMethods
router.put('/', authMiddleware(['driver','passenger','superadmin']), bankController.editBankPayment);

module.exports = router;
