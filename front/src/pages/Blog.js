import React, { useEffect, useState, useCallback } from 'react';
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

  const dispatch = useDispatch();

  // ✅ Correct way
  const { blogs = [], loading, error, success } = useSelector((state) => state.blog);

  // fetch blogs on mount
  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  // local state for form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
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

    const blogData = new FormData();
    blogData.append("name", formData.name);
    blogData.append("email", formData.email);
    blogData.append("date", formData.date);
    blogData.append("subject", formData.subject);
    blogData.append("message", formData.message);
    if (formData.image) {
      blogData.append("image", formData.image);
    }

    dispatch(createBlog(blogData));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      handleSearch(searchTerm);
    }, 400); // wait 400ms after typing
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Use useCallback to memoize these functions
  const handleSearch = useCallback((value = searchTerm) => {
    if (value.trim() !== "") {
      setIsSearching(true);
      if (onSearch) onSearch(value); // pass search text to parent
    } else {
      setIsSearching(false);
      if (onSearch) onSearch("");
    }
  }, [searchTerm, onSearch]);

  // Clear search
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

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  // Function to truncate excerpt to 15 words
  const truncateExcerpt = (text, wordLimit = 15) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  // Function to toggle post expansion
  const togglePostExpansion = (postId) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  // Function to get pagination numbers (previous, current, next)
  const getPaginationNumbers = () => {
    const numbers = [];

    if (totalPages <= 3) {
      // If total pages is 3 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      // Show previous, current, and next page
      if (currentPage > 1) {
        numbers.push(currentPage - 1);
      }
      numbers.push(currentPage);
      if (currentPage < totalPages) {
        numbers.push(currentPage + 1);
      }
    }

    return numbers;
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
          {/* Offcanvas Toggle Button - Only visible below 991px */}
          <button className="x_offcanvas_toggle" onClick={toggleOffcanvas}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Main Blog Layout */}
          <div className="x_blog_layout">
            {/* Main Content Area */}
            <div className="x_blog_main_content">
              <div className="x_blog_header">
                <h1 className="x_blog_title">Our Blog</h1>
                <p className="x_blog_subtitle">Latest news, tips, and insights about transportation services</p>
              </div>

              {/* Blog Posts Grid */}
              <div className="x_blog_posts">
                {currentPosts.length === 0 && !loading && (
                  <div className='d-flex justify-content-center align-items-center flex-column' style={{ height: '100px' }}>
                    <div> <img src={nofound} style={{ width: "100px" }} /></div>
                   <div> <p style={{ textAlign: 'center', color: '#888' }}>No blogs found.</p></div>
                  </div>
                )}
                {currentPosts.length > 0 && currentPosts.map((post) => (
                  <article key={post._id || post.id} className="x_blog_post">
                    <div className="x_post_image">
                      {post.image && <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.subject || post.title} />}
                      {/* <div className="x_post_category">{post.category || "General"}</div> */}
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

              {/* Pagination */}
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
                        placeholder="Your Name"
                        className="x_form_input"
                        value={formData.name}
                        onChange={handleChange}
                      />
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
                    </div>
                  </div>

                  <div className="x_form_group">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="x_form_input"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="x_form_group">
                    <input
                      type="date"
                      name="date"
                      className="x_form_input"
                      value={formData.date}
                      onChange={handleChange}
                    />
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
                  </div>

                  <button type="submit" className="x_submit_btn" disabled={loading}>
                    {loading ? "Submitting..." : "Share My Story"}
                  </button>

                  {success && <p style={{ color: "green" }}>Blog created successfully!</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </form>

              </div>
            </div>

            {/* Sidebar - Displayed by default above 991px */}
            <div className="x_blog_sidebar">
              <SidebarContent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
                isSearching={isSearching}
                handleSearch={handleSearch}
                handleClear={handleClear}
                blogPosts={[...blogs].reverse().slice(0, 6)} // <-- Show last 6 blogs from API
              />
            </div>
          </div>

          {/* Offcanvas Sidebar - Only for mobile/tablet below 991px */}
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
                blogPosts={[...blogs].reverse().slice(0, 6)} // <-- Show last 6 blogs from API
              />
            </div>
          </div>

          {/* Offcanvas Overlay */}
          {isOffcanvasOpen && (
            <div className="x_offcanvas_overlay" onClick={toggleOffcanvas}></div>
          )}
        </section>
      </main>
    </div>
  );
}