
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const upload = require('../middlewares/upload');


// Blog routes
router.post('/create', upload.single('image'), blogController.createBlog);
router.get('/all', blogController.getAllBlogs);
router.get('/:id', blogController.getBlog);
router.put('/update/:id', upload.single('image'), blogController.updateBlog);
router.delete('/delete/:id', blogController.deleteBlog);

module.exports = router;
