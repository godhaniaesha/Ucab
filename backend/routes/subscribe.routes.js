const express = require('express');
const router = express.Router();
const subscribeController = require('../controllers/subscribe.controller');
const upload = require('../middlewares/upload');

// Create new subscription
router.post('/', upload.none(),subscribeController.createSubscribe);

// Get all subscriptions
router.get('/', subscribeController.getAllSubscribes);

// Get subscription by ID
router.get('/:id', subscribeController.getSubscribeById);

// Delete subscription by ID
router.delete('/:id', subscribeController.deleteSubscribe);

module.exports = router;
