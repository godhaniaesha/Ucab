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

export default function Footer() {
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When footer comes into view, show the taxi animation
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    // Hide animation when footer is out of view
                    setIsVisible(false);
                }
            },
            {
                threshold: 0.1, // Trigger when 10% of footer is visible
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before footer is fully visible
            }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    return (
        <footer className="x_footer" ref={footerRef}>
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
                            <p><FaPhoneAlt /> +2 123 654 7898</p>
                            <p><FaMapMarkerAlt /> 25/B Milford Road, New York</p>
                            <p><FaEnvelope /> info@example.com</p>
                        </div>
                    </div>

                    {/* Col 2 - Quick Links */}
                    <div className="x_footer-col">
                        <h3>Quick Links</h3>
                        <ul>
                            <li>
                                <FaCaretRight color="#199675" /> <Link to="/home">Home</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link to="/blog">Blog</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link to="/about">About Us</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link to="/pages">My Account</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link to="/taxi">Book A Ride</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3 - Support Center */}
                    <div className="x_footer-col">
                        <h3>Support Center</h3>
                        <ul>
                            <li>
                                <FaCaretRight color="#199675" /> <Link to="/faq">FAQ's</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link to="/contact">Contact Us</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link to="/service">Service</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link to="/privacy">Privacy Policy</Link>
                            </li>
                            <li>
                                <FaCaretRight color="#199675" /> <Link to="/terms">Terms & Condition</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4 - Newsletter */}
                    <div className="x_footer-col">
                        <div className="x_footer-ls">
                            <h3>Newsletter</h3>
                            <p>Subscribe our newsletter to get latest update and news.</p>
                            <div className="x_footer-newsletter">
                                <input type="email" placeholder="Your Email" />
                                <button>SUBSCRIBE NOW <PiTelegramLogoBold /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Running Taxi Animation - Only visible when footer is in view */}
            {isVisible && (
                <div className="running-taxi">
                    <div className="taxi"></div>
                    <div className="taxi-2"></div>
                    <div className="taxi-3"></div>
                </div>
            )}

            {/* Bottom Bar */}
            <div className="copyright-area no-menu-set">
                <div className="container">
                    <div className="copyright-inner">
                        <div className="site-info">
                            © Copyright 2025 <a href="https://themeforest.net/user/dynamiclayers">DynamicLayers</a>. All Rights Reserved. </div>
                    </div>
                </div>
            </div>


        </footer>
    );
}
