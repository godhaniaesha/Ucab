import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaSignInAlt,
  FaUserPlus,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaTimes
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { IoMailUnreadOutline, IoClose } from "react-icons/io5";
import { PiPhoneCallBold } from "react-icons/pi";
import { LuAlarmClock } from "react-icons/lu";
import "../style/x_app.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showOtpVerifyModal, setShowOtpVerifyModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Close menu when screen is resized above 850px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 850) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen for global event to open login modal (works from any page)
  useEffect(() => {
    const openLogin = () => setShowLoginModal(true);
    window.addEventListener('showLoginModal', openLogin);
    return () => window.removeEventListener('showLoginModal', openLogin);
  }, []);

  // Close menu/profile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideMenu = event.target.closest('.x_menu') || event.target.closest('.x_filter-btn');
      if (menuOpen && !clickedInsideMenu) {
        setMenuOpen(false);
      }
      const clickedInsideProfile = event.target.closest('.x_profile');
      if (profileOpen && !clickedInsideProfile) {
        setProfileOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Active link checker
  const isActive = (path) => {
    if (path === "/home" && (location.pathname === "/" || location.pathname === "/home")) {
      return true;
    }
    return location.pathname === path;
  };

  // Close menu when clicking a link (mobile only)
  const handleLinkClick = () => {
    if (window.innerWidth <= 850) {
      setMenuOpen(false);
    }
  };

  // Handle Pages link click to show login modal (navigate to /pages then open modal)
  const handlePagesClick = (e) => {
    e.preventDefault();
    handleLinkClick();
    navigate('/pages');
    // Trigger login modal after navigation
    setTimeout(() => {
      const event = new CustomEvent('showLoginModal');
      window.dispatchEvent(event);
    }, 100);
  };

  // Toggle profile dropdown
  const toggleProfileMenu = (e) => {
    e.preventDefault();
    setProfileOpen((v) => !v);
  };

  const closeProfileMenu = () => setProfileOpen(false);

  // Dropdown actions
  const onClickSignIn = (e) => {
    e.preventDefault();
    closeProfileMenu();
    // Open login modal locally without navigation
    setShowLoginModal(true);
  };

  const onClickMyProfile = (e) => {
    e.preventDefault();
    closeProfileMenu();
    handleLinkClick();
    navigate('/pages');
  };
  const onClickFaq = (e) => {
    e.preventDefault();
    closeProfileMenu();
    handleLinkClick();
    navigate('/faq');
  };

  const onClickLogout = (e) => {
    e.preventDefault();
    closeProfileMenu();
    setShowLogoutModal(true); // open modal instead of direct logout
  };

  const handleLoginInputChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Header Login:', loginForm);
    setShowLoginModal(false);
  };

  const closeLoginModal = () => setShowLoginModal(false);

  // Shared handlers for other forms
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Register:', formData);
  };

  const openForgot = (e) => {
    e.preventDefault();
    setShowLoginModal(false);
    setShowForgotModal(true);
  };

  const handleSendOtp = () => {
    // TODO: call API to send OTP
    setShowForgotModal(false);
    setShowOtpVerifyModal(true);
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();
    // TODO: verify OTP
    setShowOtpVerifyModal(false);
    setShowResetPasswordModal(true);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Password Reset:', { newPassword: formData.newPassword });
    setShowResetPasswordModal(false);
    setShowLoginModal(true);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowForgotModal(false);
    setShowOtpVerifyModal(false);
    setShowResetPasswordModal(false);
    setFormData({
      username: '', email: '', phone: '', password: '', confirmPassword: '', otp: '', newPassword: '', confirmNewPassword: ''
    });
  };

  // Toggle menu function
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      {/* Top Bar */}
      <div className="x_top_bar_sec">
        <div className="x_top-bar">
          <div className="x_container">
            <div className="x_top-left">
              <span><IoMailUnreadOutline fontSize={"18px"} /> info@example.com</span>
              <span><PiPhoneCallBold fontSize={"18px"} /> +2 123 654 7898</span>

            </div>
            <div className="x_top-right">
              <span><LuAlarmClock fontSize={"18px"} /> Sun - Fri (08AM - 10PM)</span>
              <span>
                <GiMoneyStack fontSize={"22px"} /> Currency : AU$
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="x_navbar">
        <div className="x_container">
          <div className="x_logo">
            <img src={require("../image/img.png")} className="z_taxi_logo" alt="Taxi Logo" />
          </div>

          {/* Navigation Menu */}
          <nav className={`x_menu ${menuOpen ? "x_menu-open" : ""}`}>
            <button className="x_close-btn" onClick={() => setMenuOpen(false)}>
              <FaTimes />
            </button>
            <Link to="/home" onClick={handleLinkClick} className={isActive("/home") ? "active" : ""}>Home</Link>
            <Link to="/taxi" onClick={handleLinkClick} className={isActive("/taxi") ? "active" : ""}>Taxi</Link>
            <Link to="/service" onClick={handleLinkClick} className={isActive("/service") ? "active" : ""}>Service</Link>
            <Link to="/about" onClick={handleLinkClick} className={isActive("/about") ? "active" : ""}>About</Link>
            <Link to="/blog" onClick={handleLinkClick} className={isActive("/blog") ? "active" : ""}>Blog</Link>
            <Link to="/contact" onClick={handleLinkClick} className={isActive("/contact") ? "active" : ""}>Contact</Link>
            <div className={`x_profile ${profileOpen ? 'x_open' : ''}`}>
              <a href="#" className={`x_profile_btn ${isActive('/pages') ? 'active' : ''}`} onClick={toggleProfileMenu}>Profile ▾</a>
              {profileOpen && (
                <div className="x_profile_dropdown">
                  <button className="x_profile_item" onClick={onClickSignIn}>Sign In</button>
                  <button className="x_profile_item" onClick={onClickMyProfile}>My Profile</button>
                  <button className="x_profile_item" onClick={onClickFaq}>FAQ's</button>
                  <button className="x_profile_item" onClick={onClickLogout}>Logout</button>
                </div>
              )}
            </div>
            <button className="x_book-btn x_mobile-book-btn" onClick={handleLinkClick}>BOOK A TAXI</button>
          </nav>

          {/* Right Actions */}
          <div className="x_actions">
            <button className="x_book-btn x_desktop-book-btn">BOOK A TAXI</button>
            <button className="x_filter-btn" onClick={toggleMenu}>☰</button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {/* {menuOpen && <div className="x_overlay" onClick={() => setMenuOpen(false)}></div>} */}
      {showLoginModal && (
        <div className="x_modal_overlay" onClick={closeLoginModal}>
          <div className="x_modal" onClick={(e) => e.stopPropagation()}>
            <div className="x_modal_header">
              <h3>Login</h3>
              <button className="x_modal_close" onClick={closeLoginModal}><IoClose /></button>
            </div>
            <form onSubmit={handleLoginSubmit} className="x_modal_form">
              <div className="x_form_group">
                <label>Email</label>
                <input type="email" name="email" value={loginForm.email} onChange={handleLoginInputChange} required placeholder="Enter your email" />
              </div>
              <div className="x_form_group">
                <label>Password</label>
                <input type="password" name="password" value={loginForm.password} onChange={handleLoginInputChange} required placeholder="Enter your password" />
              </div>
              <button type="submit" className="x_modal_btn">Login</button>
              <div className="x_modal_links">
                <button type="button" className="x_link_btn" onClick={openForgot}>Forgot Password?</button>
                <button type="button" className="x_link_btn" onClick={() => { setShowLoginModal(false); setShowRegisterModal(true); }}>Don't have account? Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="x_modal_overlay" onClick={closeAllModals}>
          <div className="x_modal" onClick={(e) => e.stopPropagation()}>
            <div className="x_modal_header">
              <h3>Register</h3>
              <button className="x_modal_close" onClick={closeAllModals}><IoClose /></button>
            </div>
            <form onSubmit={handleRegister} className="x_modal_form">
              <div className="x_form_group">
                <label>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} required placeholder="Enter your username" />
              </div>
              <div className="x_form_group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Enter your email" />
              </div>
              <div className="x_form_group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Enter your phone number" />
              </div>
              <div className="x_form_group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder="Enter your password" />
              </div>
              <button type="submit" className="x_modal_btn">Register</button>
              <div className="x_modal_links">
                <button type="button" className="x_link_btn" onClick={() => { setShowRegisterModal(false); setShowLoginModal(true); }}>Already have account? Login</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="x_modal_overlay" onClick={closeAllModals}>
          <div className="x_modal" onClick={(e) => e.stopPropagation()}>
            <div className="x_modal_header">
              <h3>Forgot Password</h3>
              <button className="x_modal_close" onClick={closeAllModals}><IoClose /></button>
            </div>
            <div className="x_modal_form">
              <div className="x_form_group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Enter your phone number" />
              </div>
              <button type="button" onClick={handleSendOtp} className="x_modal_btn">Send OTP</button>
              <div className="x_modal_links">
                <button type="button" onClick={() => { setShowForgotModal(false); setShowLoginModal(true); }} className="x_link_btn">Back to Login</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verify Modal */}
      {showOtpVerifyModal && (
        <div className="x_modal_overlay" onClick={closeAllModals}>
          <div className="x_modal" onClick={(e) => e.stopPropagation()}>
            <div className="x_modal_header">
              <h3>Verify OTP</h3>
              <button className="x_modal_close" onClick={closeAllModals}><IoClose /></button>
            </div>
            <form onSubmit={handleOtpVerification} className="x_modal_form">
              <div className="x_form_group">
                <label>Enter 4-Digit OTP</label>
                <input type="text" name="otp" value={formData.otp} onChange={handleInputChange} required maxLength="4" placeholder="Enter 4-digit OTP" />
              </div>
              <button type="submit" className="x_modal_btn">Verify OTP</button>
              <div className="x_modal_links">
                <button type="button" onClick={() => { setShowOtpVerifyModal(false); setShowLoginModal(true); }} className="x_link_btn">Back to Login</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="x_modal_overlay" onClick={closeAllModals}>
          <div className="x_modal" onClick={(e) => e.stopPropagation()}>
            <div className="x_modal_header">
              <h3>Reset Password</h3>
              <button className="x_modal_close" onClick={closeAllModals}><IoClose /></button>
            </div>
            <form onSubmit={handlePasswordReset} className="x_modal_form">
              <div className="x_form_group">
                <label>New Password</label>
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} required placeholder="Enter new password" />
              </div>
              <div className="x_form_group">
                <label>Confirm New Password</label>
                <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleInputChange} required placeholder="Confirm new password" />
              </div>
              <button type="submit" className="x_modal_btn">Reset Password</button>
              <div className="x_modal_links">
                <button type="button" onClick={() => { setShowResetPasswordModal(false); setShowLoginModal(true); }} className="x_link_btn">Back to Login</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="x_modal_overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="x_modal" onClick={(e) => e.stopPropagation()}>
            <div className="x_modal_header">
              <h3>Confirm Logout</h3>
              <button className="x_modal_close" onClick={() => setShowLogoutModal(false)}>
                <IoClose />
              </button>
            </div>
            <div className="x_modal_body">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/057/218/554/small/illustration-of-the-open-door-concept-encouraging-collaboration-and-transparency-vector.jpg"
                alt="Open door illustration"
                className="x_modal_image"
              />
              <p>Are you sure you want to logout? You can always come back later.</p>
            </div>
            <div className="x_modal_footer">
              <button className="x_modal_btn cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button
                className="x_modal_btn confirm"
                onClick={() => {
                  setShowLogoutModal(false);
                  // onLogoutConfirm(); // your real logout handler
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}


    </header>
  );
}
