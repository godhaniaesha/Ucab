
// Blog controller function to handle blog operations
const Blog = require('../models/Blog');

// Create new blog post
exports.createBlog = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const image = req.file ? req.file.filename : null;

    // 🔍 Duplicate check
    const existingBlog = await Blog.findOne({ name, email, subject, message });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        error: "Duplicate blog not allowed"
      });
    }

    const blog = new Blog({
      name,
      email,
      image,
      date: new Date(),
      subject,
      message
    });

    await blog.save();

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


// Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get single blog post
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update blog post
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    if (req.file) {
      req.body.image = req.file.filename;
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
