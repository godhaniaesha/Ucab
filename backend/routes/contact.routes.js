
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const upload = require('../middlewares/upload');

// Create new contact
router.post('/',upload.none(), contactController.createContact);

// Get all contacts 
router.get('/', contactController.getAllContacts);

// Get contact by ID
router.get('/:id', contactController.getContactById);

// Update contact
router.put('/:id', contactController.updateContact);

// Delete contact
router.delete('/:id', contactController.deleteContact);

module.exports = router;