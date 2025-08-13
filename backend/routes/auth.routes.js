const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validation.middleware');

router.post('/register', [ body('name').notEmpty(), body('email').isEmail(), body('password').isLength({min:6}) ], validate, authController.register);
router.post('/login', [ body('email').isEmail(), body('password').notEmpty() ], validate, authController.login);
module.exports = router;
