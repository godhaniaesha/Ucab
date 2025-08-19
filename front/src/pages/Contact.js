import React from 'react';
import "../style/z_app.css";
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import "../style/Contect.css";
import Footer from '../component/Footer';

export default function Contact() {
  return (
    <>
      {/* Hero Section */}
      <section className="z_cntct_hero">
        <div className="z_cntct_hero_overlay">
          <div className="z_cntct_hero_content">
            <h1 className="z_cntct_hero_title">Contact Us</h1>
            <p className="z_cntct_hero_subtitle">
              We’re here to assist you — anytime, anywhere.
            </p>
          </div>
        </div>
      </section>



      {/* Contact Us */}
      <section className="z_cntct_section">
        <div className="z_cntct_overlay">
          <div className="container">
            <div className="row g-4">
              {/* Left Side - Info */}
              <div className="col-md-6 mt-0 px-0">
                <div className="z_cntct_info h-100">
                  <div className="z_cntct_info_inner">
                    <h2 className="z_cntct_title">Get in Touch</h2>
                    <p className="z_cntct_subtitle">
                      Experience comfort, class, and safety. Book your premium ride today.
                    </p>
                    <ul>
                      <li><FaPhoneAlt /> +91 98765 43210</li>
                      <li><FaEnvelope /> info@cabbooking.com</li>
                      <li><FaMapMarkerAlt /> 123 Green Street, Ahmedabad, India</li>
                      <li><FaClock /> Mon - Sun: 24/7 Service</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="col-md-6 pb-4" style={{ padding: "0 20px" }}>
                <div className="z_cntct_form h-100 d-flex align-items-center">
                  <form className="w-100">
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <input type="tel" placeholder="Your Phone" required />
                    <textarea
                      placeholder="Your Message"
                      rows="4"
                      required
                    ></textarea>
                    <button type="submit" className="z_cntct_btn">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className='container mb-5'>
        <div className="z_cntct_map_section">
          <iframe
            className="z_cntct_map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.8914058748824!2d72.5713625749929!3d22.58904567948078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f2be0a4f97%3A0x64b6ab7e9e8f4c25!2sAhmedabad%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1690284576826!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          ></iframe>
        </div>
      </section>

      <Footer />
    </>
  );
}