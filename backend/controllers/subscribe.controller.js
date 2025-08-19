const Subscribe = require("../models/Subscribe");
const logger = require("../utils/logger");

const subscribeController = {
  // Create new subscription
  createSubscribe: async (req, res) => {
    try {
      const { name, email } = req.body;

      // Validate required fields
      if (!email) {
        logger.warn("Missing required field in subscription", req.body);
        return res.status(400).json({
          message: "Email is required to subscribe",
        });
      }

      // Check for duplicate email
      const existing = await Subscribe.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({
          message: "This email is already subscribed",
        });
      }

      const newSubscribe = await Subscribe.create({
        name: name || "",
        email: email.toLowerCase(),
        dateSubscribed: new Date(),
      });

      logger.info("New subscription created", newSubscribe._id);
      res.status(201).json(newSubscribe);
    } catch (error) {
      logger.error("Error creating subscription", error);
      res.status(400).json({ message: error.message });
    }
  },

  // Get all subscriptions
  getAllSubscribes: async (req, res) => {
    try {
      const subscriptions = await Subscribe.find().sort({ dateSubscribed: -1 });
      res.json(subscriptions);
    } catch (error) {
      logger.error("Error fetching subscriptions", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get subscription by ID
  getSubscribeById: async (req, res) => {
    try {
      const subscription = await Subscribe.findById(req.params.id);
      if (!subscription) {
        logger.warn(`Subscription not found: ${req.params.id}`);
        return res.status(404).json({ message: "Subscription not found" });
      }
      res.json(subscription);
    } catch (error) {
      logger.error(`Error fetching subscription ${req.params.id}`, error);
      res.status(500).json({ message: error.message });
    }
  },

  // Delete subscription
  deleteSubscribe: async (req, res) => {
    try {
      const deleted = await Subscribe.findByIdAndDelete(req.params.id);
      if (!deleted) {
        logger.warn(`Subscription not found for deletion: ${req.params.id}`);
        return res.status(404).json({ message: "Subscription not found" });
      }
      logger.info(`Subscription deleted: ${req.params.id}`);
      res.json({ message: "Subscription deleted successfully" });
    } catch (error) {
      logger.error(`Error deleting subscription ${req.params.id}`, error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = subscribeController;
