import React from "react";
import "../style/x_app.css";
import carBg1 from "../image/bg_img1.png";   // first car vector
// import carBg2 from "../image/bg_img.png"; // second car vector

function PrivacyPolicy() {
  return (
    <div className="x_privacy">
      {/* Background Cars */}
      <div className="x_privacy-bg x_privacy-bg-center">
        <img src={carBg1} alt="Car Vector" className="x_privacy-car" />
      </div>
      {/* <div className="x_privacy-bg x_privacy-bg-bottom">
        <img src={carBg2} alt="Car Vector" className="x_privacy-car" />
      </div> */}

      {/* Page Content */}
      <div className="x_privacy-container">
        <h1 className="x_privacy-title">Privacy Policy</h1>
        <p className="x_privacy-updated">Last updated: August 2025</p>

        <section className="x_privacy-section">
          <h2>1. Introduction</h2>
          <p>
            At UCab, we respect your privacy and are committed to protecting your
            personal data. This Privacy Policy explains how we collect, use,
            and safeguard your information when you use our online taxi booking
            platform.
          </p>
        </section>

        <section className="x_privacy-section">
          <h2>2. Information We Collect</h2>
          <ul>
            <li>Personal Identification Information (name, email, phone number)</li>
            <li>Payment & Billing Information (credit/debit card, UPI, wallet)</li>
            <li>Trip & Location Data (pickup & drop-off points, travel history)</li>
            <li>Device & Browser Information (IP address, cookies, session data)</li>
            <li>Driver Feedback & Ratings provided by users</li>
          </ul>
        </section>

        <section className="x_privacy-section">
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To confirm and manage your taxi bookings</li>
            <li>To send you booking updates and driver details</li>
            <li>To improve route optimization and reduce waiting times</li>
            <li>To offer promotions, loyalty rewards, and discounts</li>
            <li>For safety, fraud prevention, and legal compliance</li>
          </ul>
        </section>

        <section className="x_privacy-section">
          <h2>4. Data Sharing & Disclosure</h2>
          <p>We may share your data with:</p>
          <ul>
            <li>Drivers (only essential trip-related info)</li>
            <li>Payment Gateways (for secure transactions)</li>
            <li>Analytics Providers (to improve app performance)</li>
            <li>Government Authorities (only when legally required)</li>
          </ul>
        </section>

        <section className="x_privacy-section">
          <h2>5. Data Retention</h2>
          <p>
            UCab retains your personal data only for as long as necessary to fulfill
            booking services, comply with legal obligations, and resolve disputes.
            After this period, your data will be securely deleted or anonymized.
          </p>
        </section>

        <section className="x_privacy-section">
          <h2>6. Cookies & Tracking</h2>
          <p>
            UCab uses cookies and tracking tools to enhance user experience, save
            preferences, and analyze traffic. You can disable cookies in your browser
            settings, but this may limit some features.
          </p>
        </section>

        <section className="x_privacy-section">
          <h2>7. Your Rights</h2>
          <p>
            You can request access, update, or deletion of your data at any time.
            Additionally, you can opt out of marketing communications through the
            unsubscribe option in emails or by contacting UCab support.
          </p>
        </section>

        <section className="x_privacy-section">
          <h2>8. Children’s Privacy</h2>
          <p>
            UCab services are not directed at children under 16. We do not knowingly
            collect data from minors. Parents/guardians can contact us to remove any
            accidental data collected.
          </p>
        </section>

        <section className="x_privacy-section">
          <h2>9. International Data Transfer</h2>
          <p>
            Since UCab operates in multiple locations, your information may be stored
            and processed outside your country. We ensure proper safeguards are in
            place to protect your data globally.
          </p>
        </section>

        <section className="x_privacy-section">
          <h2>10. Policy Updates</h2>
          <p>
            UCab may revise this Privacy Policy occasionally. Updates will be
            reflected on this page with a new "Last Updated" date. Please check back
            regularly.
          </p>
        </section>

        <section className="x_privacy-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact us at:  
            <b> support@ucab.com </b>
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
