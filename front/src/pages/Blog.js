import React, { useEffect, useState, useCallback, useRef } from 'react';
import { IoSearch, IoCloseSharp } from "react-icons/io5";
import '../style/x_app.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, getAllBlogs } from '../redux/slice/blog.slice';
import nofound from '../image/space.png';

// Move SidebarContent outside the main component
const SidebarContent = React.memo(({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  isSearching,
  handleSearch,
  handleClear,
  blogPosts
}) => (
  <>
    <div className="x_sidebar_widget">
      <h4 className="x_widget_title">Search</h4>
      <div className="x_search_bar">
        <input
          type="text"
          placeholder="Search blog posts..."
          className="x_search_input"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
        <button
          className="x_search_btn"
          onClick={isSearching ? handleClear : () => handleSearch(searchTerm)}
        >
          {isSearching ? (
            <IoCloseSharp style={{ fontSize: "1.5rem", color: "#fff" }} />
          ) : (
            <IoSearch style={{ fontSize: "1.5rem", color: "#fff" }} />
          )}
        </button>
      </div>
    </div>

    <div className="x_sidebar_widget">
      <h4 className="x_widget_title">Recent Posts</h4>
      <div className="x_recent_posts">
        {blogPosts.slice(0, 6).map((post) => (
          <div key={post.id} className="x_recent_post">
            <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} className="x_recent_post_image" />
            <div className="x_recent_post_content">
              <h5 className="x_recent_post_title">{post.subject}</h5>
              <span className="x_recent_post_date">{post.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
));

export default function Blog({ onSearch }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const { blogs = [], loading, error, success } = useSelector((state) => state.blog);

  // File input reference for clearing
  const fileInputRef = useRef(null);

  // fetch blogs on mount
  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  // local state for form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: new Date().toISOString().split("T")[0], // default today
    subject: "",
    message: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name) errors.name = "Name is required.";
    else if (!/^[A-Za-z\s]{2,50}$/.test(formData.name)) errors.name = "Name must be 2-50 letters only.";

    if (!formData.email) errors.email = "Email is required.";
    else if (!/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(formData.email)) errors.email = "Invalid email format.";

    if (!formData.date) errors.date = "Date is required.";
    else {
  const selectedDate = new Date(formData.date);
  const today = new Date();

  // 🔹 Dono ne midnight par normalize kariye
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    errors.date = "Date cannot be in the future.";
  }
}


    if (!formData.subject) errors.subject = "Subject is required.";
    else if (!/^[A-Za-z0-9\s,.!?-]{3,100}$/.test(formData.subject)) errors.subject = "Subject must be 3-100 characters.";

    if (!formData.message) errors.message = "Message is required.";
    else if (formData.message.length < 10) errors.message = "Message must be at least 10 characters.";

    if (!formData.image) errors.image = "Image is required.";
    else if (formData.image) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(formData.image.type)) {
        errors.image = "Only JPG, JPEG, PNG images allowed.";
      } else if (formData.image.size > 2 * 1024 * 1024) {
        errors.image = "Image size must be less than 2MB.";
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const blogData = new FormData();
    blogData.append("name", formData.name);
    blogData.append("email", formData.email);
    blogData.append("date", formData.date);
    blogData.append("subject", formData.subject);
    blogData.append("message", formData.message);
    if (formData.image) blogData.append("image", formData.image);

    dispatch(createBlog(blogData));
  };

  useEffect(() => {
    if (success) {
      setFormData({
        name: "",
        email: "",
        date: new Date().toISOString().split("T")[0], // reset to today
        subject: "",
        message: "",
        image: null,
      });

      // Clear file input manually
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      dispatch(getAllBlogs());
    }
  }, [success, dispatch]);

  useEffect(() => {
    const delay = setTimeout(() => {
      handleSearch(searchTerm);
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleSearch = useCallback((value = searchTerm) => {
    if (value.trim() !== "") {
      setIsSearching(true);
      if (onSearch) onSearch(value);
    } else {
      setIsSearching(false);
      if (onSearch) onSearch("");
    }
  }, [searchTerm, onSearch]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    setIsSearching(false);
    if (onSearch) onSearch("");
  }, [onSearch]);

  const filteredPosts = Array.isArray(blogs)
    ? blogs.filter(post => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;
      return (
        (post.subject && post.subject.toLowerCase().includes(term)) ||
        (post.title && post.title.toLowerCase().includes(term)) ||
        (post.message && post.message.toLowerCase().includes(term)) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
        (post.name && post.name.toLowerCase().includes(term)) ||
        (post.author && post.author.toLowerCase().includes(term))
      );
    })
    : [];

  const postsPerPage = 4;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const toggleOffcanvas = () => setIsOffcanvasOpen(!isOffcanvasOpen);

  const truncateExcerpt = (text, wordLimit = 15) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  const togglePostExpansion = (postId) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  return (
    <div>
      <main>
        {/* HERO SECTION */}
        <section className="x_hero_section">
          <img
            src="https://demoxml.com/html/automan/images/background01.jpg"
            alt="Blog Hero"
            className="x_hero_image"
          />
          <div className="x_hero_overlay"></div>
          <div className="x_hero_content">
            <h1>Welcome to Our Blog</h1>
            <p>Your daily source for taxi service tips, travel guides, and transportation news.</p>
          </div>
        </section>

        <section className="x_blog_section">
          <button className="x_offcanvas_toggle" onClick={toggleOffcanvas}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="x_blog_layout">
            <div className="x_blog_main_content">
              <div className="x_blog_header">
                <h1 className="x_blog_title">Our Blog</h1>
                <p className="x_blog_subtitle">Latest news, tips, and insights about transportation services</p>
              </div>

              <div className="x_blog_posts">
                {currentPosts.length === 0 && !loading && (
                  <div className='d-flex justify-content-center align-items-center flex-column' style={{ height: '100px' }}>
                    <div><img src={nofound} style={{ width: "100px" }} /></div>
                    <div><p style={{ textAlign: 'center', color: '#888' }}>No blogs found.</p></div>
                  </div>
                )}
                {currentPosts.length > 0 && currentPosts.map((post) => (
                  <article key={post._id || post.id} className="x_blog_post">
                    <div className="x_post_image">
                      {post.image && <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.subject || post.title} />}
                    </div>
                    <div className="x_post_content">
                      <h2 className="x_post_title">{post.subject || post.title}</h2>
                      <p className="x_post_excerpt">
                        {expandedPosts.has(post._id || post.id) ? post.message || post.excerpt : truncateExcerpt(post.message || post.excerpt)}
                      </p>
                      <div className="x_post_meta">
                        <span className="x_post_date">{post.date}</span>
                        <span className="x_post_author">by {post.name || post.author}</span>
                      </div>
                      <div className="x_post_buttons">
                        <button
                          className="x_read_more_btn"
                          onClick={() => togglePostExpansion(post._id || post.id)}
                        >
                          {expandedPosts.has(post._id || post.id) ? "Read Less" : "Read More"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {currentPosts.length > 0 && (
                <div className="x_pagination">
                  <button
                    className="x_pagination_btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft style={{ height: "14px" }} />
                  </button>

                  <div className="x_page_numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`x_page_btn ${currentPage === page ? "x_active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="x_pagination_btn"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight style={{ height: "14px" }} />
                  </button>
                </div>
              )}

              {/* Contact Form */}
              <div className="x_contact_form_section">
                <h2 className="x_form_title">Leave a Blog</h2>
                <p className="x_form_subtitle">Pen it. Post it. Inspire others — start by completing the form below.</p>

                <form className="x_contact_form" onSubmit={handleSubmit}>
                  <div className="x_form_row">
                    <div className="x_form_group">
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Your Name"
                        className="x_form_input"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {formErrors.name && <p style={{ color: "red", margin: 0 }}>{formErrors.name}</p>}
                    </div>
                    <div className="x_form_group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="x_form_input"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {formErrors.email && <p style={{ color: "red", margin: 0 }}>{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="x_form_group">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="x_form_input"
                      ref={fileInputRef}
                      onChange={handleChange}
                    />
                    {formErrors.image && <p style={{ color: "red", margin: 0 }}>{formErrors.image}</p>}
                  </div>

                  <div className="x_form_group">
  <input
    type="date"
    name="date"
    className="x_form_input"
    value={formData.date}
    min={new Date().toISOString().split("T")[0]}   // 👈 past date disable
    max={new Date().toISOString().split("T")[0]}   // 👈 future date disable
    onChange={handleChange}
  />
  {formErrors.date && <p style={{ color: "red", margin: 0 }}>{formErrors.date}</p>}
</div>


                  <div className="x_form_group">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      className="x_form_input"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    {formErrors.subject && <p style={{ color: "red", margin: 0 }}>{formErrors.subject}</p>}
                  </div>

                  <div className="x_form_group">
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows="5"
                      className="x_form_textarea"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                    {formErrors.message && <p style={{ color: "red", margin: 0 }}>{formErrors.message}</p>}
                  </div>

                  <button type="submit" className="x_submit_btn" disabled={loading}>
                    {loading ? "Submitting..." : "Share My Story"}
                  </button>

                  {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="x_blog_sidebar">
              <SidebarContent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
                isSearching={isSearching}
                handleSearch={handleSearch}
                handleClear={handleClear}
                blogPosts={[...blogs].reverse().slice(0, 6)}
              />
            </div>
          </div>

          <div className={`x_offcanvas ${isOffcanvasOpen ? 'x_open' : ''}`}>
            <div className="x_offcanvas_header">
              <h3 className="x_offcanvas_title">Filter Blog</h3>
              <button className="x_offcanvas_close" onClick={toggleOffcanvas}>
                <span></span>
                <span></span>
              </button>
            </div>

            <div className="x_offcanvas_content">
              <SidebarContent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
                isSearching={isSearching}
                handleSearch={handleSearch}
                handleClear={handleClear}
                blogPosts={[...blogs].reverse().slice(0, 6)}
              />
            </div>
          </div>

          {isOffcanvasOpen && (
            <div className="x_offcanvas_overlay" onClick={toggleOffcanvas}></div>
          )}
        </section>
      </main>
    </div>
  );
}
