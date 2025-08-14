const router = require('express').Router();
router.use('/auth', require('./auth.routes'));
router.use('/passenger', require('./passenger.routes'));
router.use('/driver', require('./driver.routes'));
router.use('/payment', require('./payment.route')); 
module.exports = router;
