import React, { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import '../style/x_app.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Blog({ onSearch }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Trigger search
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      setIsSearching(true);
      if (onSearch) onSearch(searchTerm); // Call parent search if needed
    }
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm("");
    setIsSearching(false);
    if (onSearch) onSearch("");
  };

  // Sample blog data
  const blogPosts = [
    {
      id: 1,
      title: "Best Taxi Services in New York City",
      excerpt: "Discover the top-rated taxi services that provide reliable transportation across the city that never sleeps. Our comprehensive guide covers everything from luxury rides to budget-friendly options, ensuring you find the perfect transportation solution for your needs in the Big Apple.",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
      date: "March 15, 2024",
      author: "John Smith",
      category: "Transportation"
    },
    {
      id: 2,
      title: "How to Choose the Right Taxi Service",
      excerpt: "Essential tips and guidelines for selecting the best taxi service for your transportation needs. Learn about safety considerations, pricing factors, and how to identify reliable providers. Make informed decisions for stress-free travel experiences.",
      image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=250&fit=crop",
      date: "March 12, 2024",
      author: "Sarah Johnson",
      category: "Tips"
    },
    {
      id: 3,
      title: "Nightlife Transportation Guide",
      excerpt: "Safe and reliable transportation options for your night out in the city. From late-night rides to special event transportation, we cover all the essential services you need for a memorable and secure nightlife experience.",
      image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=250&fit=crop",
      date: "March 10, 2024",
      author: "Mike Wilson",
      category: "Nightlife"
    },
    {
      id: 4,
      title: "Airport Transfer Services",
      excerpt: "Professional airport transfer services for stress-free travel to and from airports. Our comprehensive guide covers booking tips, pricing information, and how to ensure a smooth journey from your doorstep to the terminal.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop",
      date: "March 8, 2024",
      author: "Lisa Brown",
      category: "Airport"
    },
    {
      id: 5,
      title: "Corporate Transportation Solutions",
      excerpt: "Reliable transportation services for business meetings and corporate events. From executive car services to group transportation for conferences, we provide professional solutions that enhance your business travel experience.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
      date: "March 5, 2024",
      author: "David Lee",
      category: "Business"
    },
    {
      id: 6,
      title: "Wedding Transportation Services",
      excerpt: "Elegant and reliable transportation for your special day and wedding celebrations. Our wedding transportation services ensure that you and your guests arrive in style and comfort, making your wedding day truly memorable.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=250&fit=crop",
      date: "March 3, 2024",
      author: "Emma Davis",
      category: "Events"
    },
    {
      id: 7,
      title: "Luxury Car Services in Manhattan",
      excerpt: "Experience premium luxury car services in the heart of Manhattan. From high-end sedans to limousines, our luxury fleet provides the ultimate in comfort and style for discerning clients who demand excellence.",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop",
      date: "March 1, 2024",
      author: "Robert Chen",
      category: "Luxury"
    },
    {
      id: 8,
      title: "Group Transportation for Events",
      excerpt: "Efficient group transportation solutions for large events and gatherings. Whether it's a corporate function, wedding, or special celebration, our group transportation services ensure everyone arrives together and on time.",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop",
      date: "February 28, 2024",
      author: "Jennifer White",
      category: "Events"
    },
    {
      id: 9,
      title: "Emergency Transportation Services",
      excerpt: "24/7 emergency transportation services for urgent travel needs. Our reliable emergency services are available round the clock to provide immediate assistance when you need transportation the most.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
      date: "February 25, 2024",
      author: "Michael Brown",
      category: "Emergency"
    },
    {
      id: 10,
      title: "Tourist Transportation Guide",
      excerpt: "Complete transportation guide for tourists visiting New York City. From airport transfers to sightseeing tours, discover the best transportation options to explore the city's iconic landmarks and attractions.",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=250&fit=crop",
      date: "February 22, 2024",
      author: "Amanda Garcia",
      category: "Tourism"
    },
    {
      id: 11,
      title: "Business Travel Transportation",
      excerpt: "Professional transportation services tailored for business travelers. Our business travel solutions include airport transfers, meeting transportation, and executive car services designed for the modern professional.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
      date: "February 20, 2024",
      author: "Thomas Wilson",
      category: "Business"
    },
    {
      id: 12,
      title: "Weekend Getaway Transportation",
      excerpt: "Reliable transportation for weekend getaways and short trips. Whether you're heading to the airport, train station, or a nearby destination, our weekend transportation services ensure a smooth and enjoyable journey.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      date: "February 18, 2024",
      author: "Rachel Martinez",
      category: "Weekend"
    }
  ];

  const postsPerPage = 4;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = blogPosts.slice(startIndex, endIndex);

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  // Function to truncate excerpt to 15 words
  const truncateExcerpt = (text, wordLimit = 15) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // Function to toggle post expansion
  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
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

  // Sidebar content component

  const SidebarContent = () => (
    <>
      <div className="x_sidebar_widget">
        <h4 className="x_widget_title">Search</h4>
        <div className="x_search_bar">
          <input
            type="text"
            placeholder="Search blog posts..."
            className="x_search_input"
            value={searchTerm}
            onChange={(e) => {
              // Just update the state without triggering search here
              setSearchTerm(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <button
            className="x_search_btn"
            onClick={isSearching ? handleClear : handleSearch}
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
        <h4 className="x_widget_title">Categories</h4>
        <ul className="x_category_list">
          <li><a href="#" className="x_category_link">Transportation</a></li>
          <li><a href="#" className="x_category_link">Tips & Guides</a></li>
          <li><a href="#" className="x_category_link">Nightlife</a></li>
          <li><a href="#" className="x_category_link">Airport Services</a></li>
          <li><a href="#" className="x_category_link">Business</a></li>
          <li><a href="#" className="x_category_link">Events</a></li>
        </ul>
      </div>

      <div className="x_sidebar_widget">
        <h4 className="x_widget_title">Recent Posts</h4>
        <div className="x_recent_posts">
          {blogPosts.slice(0, 3).map((post) => (
            <div key={post.id} className="x_recent_post">
              <img src={post.image} alt={post.title} className="x_recent_post_image" />
              <div className="x_recent_post_content">
                <h5 className="x_recent_post_title">{post.title}</h5>
                <span className="x_recent_post_date">{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>


    </>
  );

  return (
    <div>
      <main>
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
                {currentPosts.map((post) => (
                  <article key={post.id} className="x_blog_post">
                    <div className="x_post_image">
                      <img src={post.image} alt={post.title} />
                      <div className="x_post_category">{post.category}</div>
                    </div>
                    <div className="x_post_content">
                      <h2 className="x_post_title">{post.title}</h2>
                      <p className="x_post_excerpt">
                        {expandedPosts.has(post.id) ? post.excerpt : truncateExcerpt(post.excerpt)}
                      </p>
                      <div className="x_post_meta">
                        <span className="x_post_date">{post.date}</span>
                        <span className="x_post_author">by {post.author}</span>
                      </div>
                      <div className="x_post_buttons">
                        <button
                          className="x_read_more_btn"
                          onClick={() => togglePostExpansion(post.id)}
                        >
                          {expandedPosts.has(post.id) ? 'Read Less' : 'Read More'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className="x_pagination">
                <button
                  className="x_pagination_btn"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                 <FaChevronLeft style={{"height":"14px"}}/>
                </button>

                <div className="x_page_numbers">
                  {getPaginationNumbers().map((page) => (
                    <button
                      key={page}
                      className={`x_page_btn ${currentPage === page ? 'x_active' : ''}`}
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
                  <FaChevronRight style={{"height":"14px"}}/>
                </button>
              </div>

              {/* Contact Form */}
              <div className="x_contact_form_section">
                <h2 className="x_form_title">Leave a Blog</h2>
                <p className="x_form_subtitle">Pen it. Post it. Inspire others — start by completing the form below.</p>

                <form className="x_contact_form">
                  <div className="x_form_row">
                    <div className="x_form_group">
                      <input type="text" placeholder="Your Name" className="x_form_input" />
                    </div>
                    <div className="x_form_group">
                      <input type="email" placeholder="Your Email" className="x_form_input" />
                    </div>
                  </div>

                  {/* New Image Field */}
                  <div className="x_form_group">
                    <input type="file" accept="image/*" className="x_form_input" />
                  </div>

                  {/* New Date Field */}
                  <div className="x_form_group">
                    <input type="date" className="x_form_input" />
                  </div>

                  <div className="x_form_group">
                    <input type="text" placeholder="Subject" className="x_form_input" />
                  </div>

                  <div className="x_form_group">
                    <textarea placeholder="Your Message" rows="5" className="x_form_textarea"></textarea>
                  </div>

                  <button type="submit" className="x_submit_btn">Share My Story</button>
                </form>
              </div>
            </div>

            {/* Sidebar - Displayed by default above 991px */}
            <div className="x_blog_sidebar">
              <SidebarContent />
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
              <SidebarContent />
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