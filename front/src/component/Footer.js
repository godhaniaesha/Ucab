import React, { useState, useEffect, useRef } from 'react';
import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaYoutube,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaEnvelope,
    FaCaretRight
} from "react-icons/fa";
import { PiTelegramLogoBold } from "react-icons/pi";
import "../style/x_app.css";
import { Link } from 'react-router-dom';
import { createSubscribe } from '../redux/slice/subscribe.slice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

export default function Footer() {
    const [isVisible, setIsVisible] = useState(false);
    const copyrightRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When copyright-area comes into view, show the taxi animation
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        if (copyrightRef.current) {
            observer.observe(copyrightRef.current);
        }
        return () => {
            if (copyrightRef.current) {
                observer.unobserve(copyrightRef.current);
            }
        };
    }, []);
 const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { loading, error, success, message } = useSelector((state) => state.subscribe);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Dispatch the createSubscribe thunk
    dispatch(createSubscribe({ email }))
      .unwrap()
      .then(() => {
        toast.success(message || "Subscribed successfully!");
        setEmail(""); // Clear input after success
      })
      .catch((err) => {
        toast.error(err || "Subscription failed");
      });
  };

    return (
        <footer className="x_footer">
            {/* Top Border Pattern */}
            <div className="x_footer-pattern"></div>

            <div className="x_container">
                <div className="x_footer-row">
                    {/* Col 1 - Logo & Description */}
                    <div className="x_footer-col">
                        <div className="x_footer-logo">
                            <img src={require("../image/img.png")} alt="Taxi Logo" />
                        </div>
                        <p>
                            We are many variations of passages available but the majority have
                            suffered alteration in some form by injected humour words believable.
                        </p>
                        <div className="x_footer-contact">



                            <p>
                                <a href="tel:+21236547898" className="contact-link">
                                    <FaPhoneAlt fontSize={"18px"} /> +2 123 654 7898
                                </a>
                            </p>
                            {/* <p><FaPhoneAlt /> +2 123 654 7898</p> */}
                            <p>
                                <a
                                    href="https://www.google.com/maps?q=25/B+Milford+Road,+New+York"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
                                    <FaMapMarkerAlt /> 25/B Milford Road, New York
                                </a>
                            </p>
                            {/* <p><FaEnvelope /> info@example.com</p> */}
                            <p>
                                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@kalathiyainfotech.com"
                                    target="_blank" className="contact-link">
                                    <FaEnvelope fontSize={"18px"} /> info@example.com
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Col 2 - Quick Links */}
                    <div className="x_footer-col">
                        <h3>Quick Links</h3>
                        <ul>
                            <li>
                                <FaCaretRight color="#199675" /> <Link className='xf_link' to="/home">Home</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link className='xf_link' to="/blog">Blog</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link className='xf_link' to="/about">About Us</Link>
                            </li>
                            
                            <li>
                                <FaCaretRight color="#199675" /> <Link className='xf_link' to="/taxi">Book A Ride</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3 - Support Center */}
                    <div className="x_footer-col">
                        <h3>Support Center</h3>
                        <ul>
                            <li>
                                <FaCaretRight color="#199675" /> <Link className='xf_link' to="/faq">FAQ's</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link className='xf_link' to="/contact">Contact Us</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link className='xf_link' to="/service">Service</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link className='xf_link' to="/privacy">Privacy Policy</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link className='xf_link' to="/terms">Terms & Condition</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4 - Newsletter */}
                   <div className="x_footer-col">
      <div className="x_footer-ls">
        <h3>Newsletter</h3>
        <p>Subscribe our newsletter to get latest updates and news.</p>
        <form className="x_footer-newsletter" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">
            SUBSCRIBE NOW <PiTelegramLogoBold />
          </button>
        </form>
      </div>
    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="copyright-area no-menu-set" ref={copyrightRef}>
                <div className="container">
                    <div className="copyright-inner">
                        <div className="site-info">
                            © Copyright 2025 <a href="https://themeforest.net/user/dynamiclayers">DynamicLayers</a>. All Rights Reserved. </div>
                    </div>
                </div>
            </div>

            {/* Running Taxi Animation - Only visible when copyright-area is in view */}
            {isVisible && (
                <div className="running-taxi">
                    <div className="taxi"></div>
                    <div className="taxi-2"></div>
                    <div className="taxi-3"></div>
                </div>
            )}


        </footer>
    );
}
