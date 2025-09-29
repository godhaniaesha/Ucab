const router = require('express').Router();
router.use('/auth', require('./auth.routes'));
router.use('/passenger', require('./passenger.routes'));
router.use('/driver', require('./driver.routes'));
router.use('/payment', require('./payment.route'));
router.use('/transaction', require('./transaction.routes')); 
router.use('/vehicle', require('./vehicles.routes'));
router.use('/blog', require('./blog.route'));
router.use('/contact', require('./contact.routes'));
router.use('/subscribe', require('./subscribe.routes'));
router.use('/acc', require('./myaccount.routes'));
router.use('/bank', require('./bank.routes'));


module.exports = router;
