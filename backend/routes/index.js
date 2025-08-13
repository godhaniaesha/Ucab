const router = require('express').Router();
router.use('/auth', require('./auth.routes'));
router.use('/passenger', require('./passenger.routes'));
router.use('/driver', require('./driver.routes'));
module.exports = router;
