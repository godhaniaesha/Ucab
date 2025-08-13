// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FaSignInAlt,
//   FaUserPlus,
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedinIn,
//   FaTimes
// } from "react-icons/fa";
// import { IoMailUnreadOutline } from "react-icons/io5";
// import { PiPhoneCallBold } from "react-icons/pi";
// import { LuAlarmClock } from "react-icons/lu";
// import "../style/x_app.css";

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const location = useLocation();

//   // Close menu automatically if screen size is greater than 850px
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 850) {
//         setMenuOpen(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Function to check active link
//   const isActive = (path) => {
//     if (path === "/home" && (location.pathname === "/" || location.pathname === "/home")) {
//       return true;
//     }
//     return location.pathname === path;
//   };

//   // Function to handle link clicks and close offcanvas
//   const handleLinkClick = () => {
//     if (window.innerWidth <= 850) {
//       setMenuOpen(false);
//     }
//   };

//   return (
//     <header>
//       {/* Top Bar */}
//       <div className="x_top_bar_sec">
//         <div className="x_top-bar">
//           <div className="x_container">
//             <div className="x_top-left">
//               <span><IoMailUnreadOutline fontSize={"18px"} /> info@example.com</span>
//               <span><PiPhoneCallBold fontSize={"18px"} /> +2 123 654 7898</span>
//               <span><LuAlarmClock fontSize={"18px"} /> Sun - Fri (08AM - 10PM)</span>
//             </div>
//             <div className="x_top-right">
//               <Link to="#"><FaSignInAlt /> Login</Link>
//               <Link to="#"><FaUserPlus /> Register</Link>
//               <span>Follow Us:</span>
//               <Link to="#"><FaFacebookF /></Link>
//               <Link to="#"><FaTwitter /></Link>
//               <Link to="#"><FaInstagram /></Link>
//               <Link to="#"><FaLinkedinIn /></Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Nav */}
//       <div className="x_navbar">
//         <div className="x_container">
//           <div className="x_logo">
//             <img src={require("../image/img.png")} alt="Taxi Logo" />
//           </div>
//           <nav className={`x_menu ${menuOpen ? "x_menu-open" : ""}`}>
//             <button className="x_close-btn" onClick={() => setMenuOpen(false)}>
//               <FaTimes />
//             </button>
//             <Link to="/home" onClick={handleLinkClick} className={isActive("/home") ? "active" : ""}>Home</Link>
//             <Link to="/about" onClick={handleLinkClick} className={isActive("/about") ? "active" : ""}>About</Link>
//             <Link to="/taxi" onClick={handleLinkClick} className={isActive("/taxi") ? "active" : ""}>Taxi</Link>
//             <Link to="/service" onClick={handleLinkClick} className={isActive("/service") ? "active" : ""}>Service</Link>
//             <Link to="/pages" onClick={handleLinkClick} className={isActive("/pages") ? "active" : ""}>Pages</Link>
//             <Link to="/blog" onClick={handleLinkClick} className={isActive("/blog") ? "active" : ""}>Blog</Link>
//             <Link to="/contact" onClick={handleLinkClick} className={isActive("/contact") ? "active" : ""}>Contact</Link>

//             {/* BOOK button for mobile only */}
//             <button className="x_book-btn x_mobile-book-btn" onClick={handleLinkClick}>BOOK A TAXI</button>
//           </nav>
//           <div className="x_actions">
//             <button className="x_book-btn x_desktop-book-btn">BOOK A TAXI</button>
//             <button className="x_filter-btn" onClick={() => setMenuOpen(true)}>☰</button>
//           </div>
//         </div>
//       </div>

//       {/* Overlay for Offcanvas */}
//       {menuOpen && <div className="x_overlay" onClick={() => setMenuOpen(false)}></div>}
//     </header>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaSignInAlt,
  FaUserPlus,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaTimes
} from "react-icons/fa";
import { IoMailUnreadOutline } from "react-icons/io5";
import { PiPhoneCallBold } from "react-icons/pi";
import { LuAlarmClock } from "react-icons/lu";
import "../style/x_app.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu if screen is resized above 850px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 850) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <header>
      {/* Top Bar */}
      <div className="x_top_bar_sec">
        <div className="x_top-bar">
          <div className="x_container">
            <div className="x_top-left">
              <span><IoMailUnreadOutline fontSize={"18px"} /> info@example.com</span>
              <span><PiPhoneCallBold fontSize={"18px"} /> +2 123 654 7898</span>
              <span><LuAlarmClock fontSize={"18px"} /> Sun - Fri (08AM - 10PM)</span>
            </div>
            <div className="x_top-right">
              <Link to="#"><FaSignInAlt /> Login</Link>
              <Link to="#"><FaUserPlus /> Register</Link>
              <span>Follow Us:</span>
              <Link to="#"><FaFacebookF /></Link>
              <Link to="#"><FaTwitter /></Link>
              <Link to="#"><FaInstagram /></Link>
              <Link to="#"><FaLinkedinIn /></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="x_navbar">
        <div className="x_container">
          <div className="x_logo">
            <img src={require("../image/img.png")} alt="Taxi Logo" />
          </div>

          {/* Navigation Menu */}
          <nav className={`x_menu ${menuOpen ? "x_menu-open" : ""}`}>
            <button className="x_close-btn" onClick={() => setMenuOpen(false)}>
              <FaTimes />
            </button>
            <Link to="/home" onClick={handleLinkClick} className={isActive("/home") ? "active" : ""}>Home</Link>
            <Link to="/about" onClick={handleLinkClick} className={isActive("/about") ? "active" : ""}>About</Link>
            <Link to="/taxi" onClick={handleLinkClick} className={isActive("/taxi") ? "active" : ""}>Taxi</Link>
            <Link to="/service" onClick={handleLinkClick} className={isActive("/service") ? "active" : ""}>Service</Link>
            <Link to="/pages" onClick={handleLinkClick} className={isActive("/pages") ? "active" : ""}>Pages</Link>
            <Link to="/blog" onClick={handleLinkClick} className={isActive("/blog") ? "active" : ""}>Blog</Link>
            <Link to="/contact" onClick={handleLinkClick} className={isActive("/contact") ? "active" : ""}>Contact</Link>
            <button className="x_book-btn x_mobile-book-btn" onClick={handleLinkClick}>BOOK A TAXI</button>
          </nav>

          {/* Right Actions */}
          <div className="x_actions">
            <button className="x_book-btn x_desktop-book-btn">BOOK A TAXI</button>
            <button className="x_filter-btn" onClick={() => setMenuOpen(true)}>☰</button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="x_overlay" onClick={() => setMenuOpen(false)}></div>}
    </header>
  );
}
