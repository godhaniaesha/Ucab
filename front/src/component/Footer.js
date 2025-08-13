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

export default function Footer() {
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
                            <p><FaPhoneAlt /> +2 123 654 7898</p>
                            <p><FaMapMarkerAlt /> 25/B Milford Road, New York</p>
                            <p><FaEnvelope /> info@example.com</p>
                        </div>
                    </div>

                    {/* Col 2 - Quick Links */}
                    <div className="x_footer-col">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><FaCaretRight color="#199675" /> About Us</li>
                            <li><FaCaretRight color="#199675" /> Update News</li>
                            <li><FaCaretRight color="#199675" /> Testimonials</li>
                            <li><FaCaretRight color="#199675" /> Terms Of Service</li>
                            <li><FaCaretRight color="#199675" /> Privacy Policy</li>
                            <li><FaCaretRight color="#199675" /> Our Drivers</li>
                        </ul>
                    </div>

                    {/* Col 3 - Support Center */}
                    <div className="x_footer-col">
                        <h3>Support Center</h3>
                        <ul>
                            <li><FaCaretRight color="#199675" /> FAQ's</li>
                            <li><FaCaretRight color="#199675" /> Affiliates</li>
                            <li><FaCaretRight color="#199675" /> Booking Tips</li>
                            <li><FaCaretRight color="#199675" /> Book A Ride</li>
                            <li><FaCaretRight color="#199675" /> Contact Us</li>
                            <li><FaCaretRight color="#199675" /> Sitemap</li>
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
            <div class="running-taxi">
                <div class="taxi"></div>
                <div class="taxi-2"></div>
                <div class="taxi-3"></div>
            </div>

            {/* Bottom Bar */}
            <div class="copyright-area no-menu-set">
                <div class="container">
                    <div class="copyright-inner">
                        <div class="site-info">
                            © Copyright 2025 <a href="https://themeforest.net/user/dynamiclayers">DynamicLayers</a>. All Rights Reserved. </div>
                    </div>
                </div>
            </div>

            
        </footer>
    );
}
