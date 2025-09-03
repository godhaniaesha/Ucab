import React, { useEffect } from "react";
import "../style/z_app.css";
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import "../style/Contect.css";
import Footer from "../component/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  createContact,
  clearContactError,
  clearContactSuccess,
} from "../redux/slice/contact.slice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Validation Schema with Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().min(10, "Message must be at least 10 characters").required("Message is required"),
});

export default function Contact() {
  const dispatch = useDispatch();

  const { loading, error, success, message } = useSelector(
    (state) => state.contact
  );

  // ✅ Formik Setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createContact(values));
    },
  });


  // ✅ Handle toast messages
  useEffect(() => {
    if (success) {
      toast.success("Message sent successfully!");
      formik.resetForm();   // <-- clear form here after success
    }
    if (error) {
      toast.error(error);
    }

    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearContactSuccess());
        dispatch(clearContactError());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error, message, dispatch]);

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
                      Experience comfort, class, and safety. Book your premium
                      ride today.
                    </p>
                    <ul>
                    <li>
                      <a
                        href="tel:+61234567890"
                       style={{ textDecoration: "none", color: "inherit", gap: "8px", display: 'flex', alignItems: 'center' }}
                      >
                        <FaPhoneAlt /> +61 2 3456 7890
                      </a>
                    </li>

                    <li>
                      <a
                        href="mailto:info@cabbooking.com"
                        target="_blank"
                        rel="noopener noreferrer"
                       style={{ textDecoration: "none", color: "inherit", gap: "8px", display: 'flex', alignItems: 'center' }}
                      >
                        <FaEnvelope /> info@cabbooking.com
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=456+Business+Avenue,+Australia"
                        target="_blank"
                        rel="noopener noreferrer"
                       style={{ textDecoration: "none", color: "inherit", gap: "8px", display: 'flex', alignItems: 'center' }}
                      >
                        <FaMapMarkerAlt /> 456 Business Avenue, Australia.
                      </a>
                    </li>

                    <li>
                      <FaClock /> Mon - Sun: 24/7 Service
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="col-md-6 pb-4" style={{ padding: "0 20px" }}>
              <div className="z_cntct_form h-100 d-flex align-items-center">
                <form className="w-100" onSubmit={formik.handleSubmit}>
                  {/* Example for Name field */}
                  <div className="z_cntct_form_group">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={formik.errors.name ? "input-error" : ""}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="x_text-danger" style={{ marginTop: "-10px", marginBottom: "8px" }}>
                        {formik.errors.name}
                      </div>
                    )}
                  </div>
                  <div className="z_cntct_form_group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="x_text-danger" style={{ marginTop: "-10px", marginBottom: "8px" }}>{formik.errors.email}</div>
                    )}
                  </div>
                  <div className="z_cntct_form_group">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <div className="x_text-danger" style={{ marginTop: "-10px", marginBottom: "8px" }}>{formik.errors.subject}</div>
                    )}
                  </div>
                  <div className="z_cntct_form_group">
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows="4"
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    ></textarea>
                    {formik.touched.message && formik.errors.message && (
                      <div className="x_text-danger" style={{ marginTop: "-16px", marginBottom: "8px" }}>{formik.errors.message}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="z_cntct_btn"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >

      {/* Map Section */ }
      < section className = "container mb-5" >
        <div className="z_cntct_map_section">
          {/* <iframe
            className="z_cntct_map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.8914058748824!2d72.5713625749929!3d22.58904567948078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f2be0a4f97%3A0x64b6ab7e9e8f4c25!2sAhmedabad%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1690284576826!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          ></iframe> */}
          <iframe
            className="z_cntct_map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6304.080007782037!2d144.95645279824618!3d-37.81253196188106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d3d1412ac51%3A0x234488535eb9350a!2sClarence%20%7C%20456%20Lonsdale%20Street%20-%20Serviced%20Offices%20%26%20Workspaces!5e0!3m2!1sen!2sin!4v1756095683853!5m2!1sen!2sin"
            width="600"
            height="450"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </section >

    </>
  );
}
