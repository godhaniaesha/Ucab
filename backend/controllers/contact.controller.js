const Contact = require("../models/Contact");
const logger = require("../utils/logger");

// Simple contact form controller
const contactController = {
  // Create new contact
  createContact: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        logger.warn("Missing required fields in contact creation", req.body);
        return res.status(400).json({
          message: "Please fill in all required fields (name, email, message)",
        });
      }

      const savedContact = await Contact.create({
        name,
        email,
        subject: subject || "",
        message,
        createdAt: new Date(),
      });

      logger.info("Contact created successfully", savedContact._id);
      res.status(201).json(savedContact);
    } catch (error) {
      logger.error("Error creating contact", error);
      res.status(400).json({ message: error.message });
    }
  },

  // Get all contacts
  getAllContacts: async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json(contacts);
    } catch (error) {
      logger.error("Error fetching contacts", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get contact by ID
  getContactById: async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        logger.warn(`Contact not found: ${req.params.id}`);
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      logger.error(`Error fetching contact ${req.params.id}`, error);
      res.status(500).json({ message: error.message });
    }
  },

  // Update contact
  updateContact: async (req, res) => {
    try {
      const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedContact) {
        logger.warn(`Contact not found for update: ${req.params.id}`);
        return res.status(404).json({ message: "Contact not found" });
      }
      logger.info(`Contact updated: ${req.params.id}`);
      res.json(updatedContact);
    } catch (error) {
      logger.error(`Error updating contact ${req.params.id}`, error);
      res.status(400).json({ message: error.message });
    }
  },

  // Delete contact
  deleteContact: async (req, res) => {
    try {
      const deletedContact = await Contact.findByIdAndDelete(req.params.id);
      if (!deletedContact) {
        logger.warn(`Contact not found for deletion: ${req.params.id}`);
        return res.status(404).json({ message: "Contact not found" });
      }
      logger.info(`Contact deleted: ${req.params.id}`);
      res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      logger.error(`Error deleting contact ${req.params.id}`, error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = contactController;
